import { Context, Vertex } from "../types";
import {
    ListArgument,
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ServiceControlOptions_subentries as subentriesBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import readChildren from "../dit/readChildren";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { AccessPointInformation, ContinuationReference } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import {
    ListResult,
    _encode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import {
    ListResultData_listInfo_subordinates_Item as ListItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";

export
async function list_i (
    ctx: Context,
    admPoints: Vertex[],
    target: Vertex,
    request: ChainedArgument,
): Promise<ChainedResult> {
    const arg: ListArgument = _decode_ListArgument(request.argument);
    const data = getOptionallyProtectedValue(arg);
    const targetDN = getDistinguishedName(target);
    const subordinates = await readChildren(ctx, target);
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const SRcontinuationList: ContinuationReference[] = [];
    const listItems: ListItem[] = [];
    if (subentries) {
        // TODO: Check ACI
        const result: ListResult = {
            unsigned: {
                listInfo: new ListResultData_listInfo(
                    // {
                    //     rdnSequence: targetDN,
                    // },
                    undefined,
                    subordinates
                        .filter((sub) => sub.dse.subentry)
                        .map((sub) => new ListItem(sub.dse.rdn, undefined, undefined)),
                    undefined,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            },
        };
        return new ChainedResult(
            new ChainingResults(
                undefined,
                undefined,
                undefined,
                undefined,
            ),
            _encode_ListResult(result, DER),
        );
    }
    if (target.dse.nssr) {
        SRcontinuationList.push(new ContinuationReference(
            {
                rdnSequence: targetDN,
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
            undefined,
            ReferenceType_nonSpecificSubordinate,
            target.dse.nssr.nonSpecificKnowledge
                .map((nsk): AccessPointInformation | undefined => {
                    const [ masters, shadows ] = splitIntoMastersAndShadows(nsk);
                    const preferred = shadows[0] ?? masters[0];
                    if (!preferred) {
                        return undefined;
                    }
                    return new AccessPointInformation(
                        preferred.ae_title,
                        preferred.address,
                        preferred.protocolInformation,
                        preferred.category,
                        preferred.chainingRequired,
                        shadows[0]
                            ? [ ...shadows.slice(1), ...masters ]
                            : [ ...shadows, ...masters.slice(1) ],
                    );
                })
                .filter((api): api is AccessPointInformation => !!api),
            undefined,
            undefined,
            undefined,
            undefined,
        ));
    }
    for (const subordinate of subordinates) {
        // TODO: Check ACI
        if (subordinate.dse.subr) {
            SRcontinuationList.push(new ContinuationReference(
                /**
                 * The specification says to return the DN of the TARGET, not
                 * the subordinate... This does not quite make sense to me. I
                 * wonder if the specification is incorrect, but it also seems
                 * plausible that I am misunderstanding the semantics of the
                 * ContinuationReference.
                 */
                // {
                //     rdnSequence: [ ...targetDN, subordinate.dse.rdn ],
                // },
                {
                    rdnSequence: targetDN,
                },
                undefined,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_completed,
                    undefined,
                ),
                undefined,
                ReferenceType_subordinate,
                ((): AccessPointInformation[] => {
                    const [
                        masters,
                        shadows,
                    ] = splitIntoMastersAndShadows(subordinate.dse.subr.specificKnowledge);
                    const preferred = shadows[0] ?? masters[0];
                    if (!preferred) {
                        return [];
                    }
                    return [
                        new AccessPointInformation(
                            preferred.ae_title,
                            preferred.address,
                            preferred.protocolInformation,
                            preferred.category,
                            preferred.chainingRequired,
                            shadows[0]
                                ? [ ...shadows.slice(1), ...masters ]
                                : [ ...shadows, ...masters.slice(1) ],
                        ),
                    ];
                })(),
                undefined,
                undefined,
                undefined,
                undefined,
            ));
        }
        if (subordinate.dse.entry || subordinate.dse.glue) {
            listItems.push(new ListItem(
                subordinate.dse.rdn,
                false,
                Boolean(subordinate.dse.shadow),
            ));
        } else if (subordinate.dse.alias) {
            listItems.push(new ListItem(
                subordinate.dse.rdn,
                true,
                Boolean(subordinate.dse.shadow),
            ));
        }
        // TODO: Check if limit is exceeded.
    }
    const result: ListResult = {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                // FIXME: Change this back to `undefined` when you fix the X.500 library issues.
                {
                    rdnSequence: targetDN,
                },
                // undefined,
                listItems,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        },
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ListResult(result, DER),
    );
}

export default list_i;


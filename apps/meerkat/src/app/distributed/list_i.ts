import { Context, Vertex } from "../types";
import {
    ListArgument,
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ServiceControlOptions_subentries as subentriesBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { TRUE_BIT, BOOLEAN } from "asn1-ts";
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

export
type ListItem = [ vertex: Vertex, aliasEntry?: BOOLEAN, fromEntry?: BOOLEAN ];

export
interface ListIReturn {
    listInfoSubordinates: ListItem[];
    // PartialOutcomeQualifier
    SRcontinuationList: ContinuationReference[];
}

export
async function list_i (
    ctx: Context,
    admPoints: Vertex[],
    target: Vertex,
    request: ChainedArgument,
): Promise<ListIReturn> {
    const arg: ListArgument = _decode_ListArgument(request.argument);
    const data = getOptionallyProtectedValue(arg);
    const targetDN = getDistinguishedName(target);
    const subordinates = await readChildren(ctx, target);
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const SRcontinuationList: ContinuationReference[] = [];
    if (subentries) {
        // TODO: Check ACI
        return {
            listInfoSubordinates: subordinates
                .filter((sub) => sub.dse.subentry)
                .map((sub) => [ sub, ]),
            SRcontinuationList,
        };
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
    const listInfoSubordinates: ListItem[] = [];
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
            ))
        }
        if (subordinate.dse.entry || subordinate.dse.glue) {
            listInfoSubordinates.push([
                subordinate,
                false,
                Boolean(subordinate.dse.shadow),
            ]);
        } else if (subordinate.dse.alias) {
            listInfoSubordinates.push([
                subordinate,
                true,
                Boolean(subordinate.dse.shadow),
            ]);
        }
        // TODO: Check if limit is exceeded.
    }
    return {
        listInfoSubordinates,
        SRcontinuationList,
    };
}

export default list_i;


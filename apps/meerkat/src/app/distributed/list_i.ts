import { Context, Vertex, ClientConnection } from "../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
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
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import { NameProblem_noSuchObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_list,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";

export
async function list_i (
    ctx: Context,
    conn: ClientConnection,
    admPoints: Vertex[],
    target: Vertex,
    request: ChainedArgument,
): Promise<ChainedResult> {
    const arg: ListArgument = _decode_ListArgument(request.argument);
    const data = getOptionallyProtectedValue(arg);
    const targetDN = getDistinguishedName(target);
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const targetACI = [
        ...((accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME) && !target.dse.subentry)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && target.dse.subentry)
            ? target.immediateSuperior?.dse?.admPoint?.subentryACI ?? []
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? target.dse.entryACI ?? []
            : []),
    ];
    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
            ...tuple,
            await userWithinACIUserClass(
                tuple[0],
                conn.boundNameAndUID!, // FIXME:
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    if (accessControlScheme) {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_BROWSE,
                PERMISSION_CATEGORY_RETURN_DN,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorized) {
            // Non-disclosure of the target object is at least addressed in X.501 RBAC!
            throw new errors.NameError(
                "Not permitted to list the target entry.",
                new NameErrorData(
                    NameProblem_noSuchObject,
                    {
                        rdnSequence: [],
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        nameError["&errorCode"],
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    const subordinates = await readChildren(ctx, target);
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const SRcontinuationList: ContinuationReference[] = [];
    const listItems: ListItem[] = [];
    if (subentries) {
        for (const subordinate of subordinates) {
            if (!subordinate.dse.subentry) {
                continue;
            }
            const subordinateDN = [ ...targetDN, subordinate.dse.rdn ];
            const subordinateACI = [
                ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && subordinate.dse.subentry)
                    ? subordinate.immediateSuperior?.dse?.admPoint?.subentryACI ?? []
                    : []),
                ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                    ? subordinate.dse.entryACI ?? []
                    : []),
            ];
            const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantSubordinateTuples: ACDFTupleExtended[] = (await Promise.all(
                subordinateACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                    ...tuple,
                    await userWithinACIUserClass(
                        tuple[0],
                        conn.boundNameAndUID!, // FIXME:
                        subordinateDN,
                        EQUALITY_MATCHER,
                        isMemberOfGroup,
                    ),
                ]),
            ))
                .filter((tuple) => (tuple[5] > 0));
            const {
                authorized: authorizedToList,
            } = bacACDF(
                relevantSubordinateTuples,
                conn.authLevel,
                {
                    entry: Array.from(subordinate.dse.objectClass).map(ObjectIdentifier.fromString),
                },
                [
                    PERMISSION_CATEGORY_BROWSE,
                    PERMISSION_CATEGORY_RETURN_DN,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToList) {
                continue;
            }
            listItems.push(new ListItem(subordinate.dse.rdn, undefined, undefined));
        }

        const result: ListResult = {
            unsigned: {
                listInfo: new ListResultData_listInfo(
                    // {
                    //     rdnSequence: targetDN,
                    // },
                    undefined,
                    listItems,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        id_opcode_list,
                    ),
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
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    id_opcode_list,
                ),
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
        if (accessControlScheme) {
            const subordinateDN = [ ...targetDN, subordinate.dse.rdn ];
            const subordinateACI = [
                ...((accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME) && !subordinate.dse.subentry)
                    ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                    : []),
                ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                    ? subordinate.dse.entryACI ?? []
                    : []),
            ];
            const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantSubordinateTuples: ACDFTupleExtended[] = (await Promise.all(
                subordinateACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                    ...tuple,
                    await userWithinACIUserClass(
                        tuple[0],
                        conn.boundNameAndUID!, // FIXME:
                        subordinateDN,
                        EQUALITY_MATCHER,
                        isMemberOfGroup,
                    ),
                ]),
            ))
                .filter((tuple) => (tuple[5] > 0));
            const {
                authorized: authorizedToList,
            } = bacACDF(
                relevantSubordinateTuples,
                conn.authLevel,
                {
                    entry: Array.from(subordinate.dse.objectClass).map(ObjectIdentifier.fromString),
                },
                [
                    PERMISSION_CATEGORY_BROWSE,
                    PERMISSION_CATEGORY_RETURN_DN,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToList) {
                continue;
            }
        }

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
                undefined,
                listItems,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    id_opcode_list,
                ),
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
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_list,
            ),
            undefined,
        ),
        _encode_ListResult(result, DER),
    );
}

export default list_i;


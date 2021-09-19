import { Context, Vertex, ClientConnection, OperationReturn } from "../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import * as crypto from "crypto";
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
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidQueryReference,
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import type {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import {
    LimitProblem,
    LimitProblem_sizeLimitExceeded,
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getStatisticsFromPagedResultsRequest from "../telemetry/getStatisticsFromPagedResultsRequest";
import getListResultStatistics from "../telemetry/getListResultStatistics";
import getPartialOutcomeQualifierStatistics from "../telemetry/getPartialOutcomeQualifierStatistics";

const BYTES_IN_A_UUID: number = 16;

export
async function list_i (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const arg: ListArgument = _decode_ListArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(arg);
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const targetDN = getDistinguishedName(target);
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
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
                conn.boundNameAndUID!,
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
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    let pagingRequest: PagedResultsRequest_newRequest | undefined;
    let page: number = 0;
    let queryReference: string | undefined;
    if (data.pagedResults) {
        if ("newRequest" in data.pagedResults) {
            const nr = data.pagedResults.newRequest;
            const pi = ((nr.pageNumber ?? 1) - 1); // The spec is unclear if this is zero-indexed.
            if ((pi < 0) || !Number.isSafeInteger(pi)) {
                throw new errors.ServiceError(
                    `Paginated query page index ${pi} is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                );
            }
            // pageSize = 0 is a problem because we push entry to results before checking if we have a full page.
            if ((nr.pageSize < 1) || !Number.isSafeInteger(nr.pageSize)) {
                throw new errors.ServiceError(
                    `Paginated query page size ${nr.pageSize} is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                );
            }
            queryReference = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            pagingRequest = data.pagedResults.newRequest;
            page = ((data.pagedResults.newRequest.pageNumber ?? 1) - 1);
        } else if ("queryReference" in data.pagedResults) {
            queryReference = Buffer.from(data.pagedResults.queryReference).toString("base64");
            const paging = conn.pagedResultsRequests.get(queryReference);
            if (!paging) {
                throw new errors.ServiceError(
                    `Paginated query reference '${queryReference.slice(0, 32)}' is invalid.`,
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                );
            }
            pagingRequest = paging[0];
            page = paging[1];
        } else if ("abandonQuery" in data.pagedResults) {
            queryReference = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
            throw new errors.AbandonError(
                `Abandoned paginated query identified by query reference '${queryReference.slice(0, 32)}'.`,
                new AbandonedData(
                    AbandonedProblem_pagingAbandoned,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            );
        } else {
            throw new errors.ServiceError(
                "Unrecognized paginated query syntax.",
                new ServiceErrorData(
                    ServiceProblem_unavailable,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    const SRcontinuationList: ContinuationReference[] = [];
    const listItems: ListItem[] = [];
    const pageNumber: number = pagingRequest?.pageNumber ?? 0;
    const pageSize: number = pagingRequest?.pageSize
        ?? data.serviceControls?.sizeLimit
        ?? Infinity;
    let cursorId: number | undefined;
    let subordinatesInBatch = await readChildren(
        ctx,
        target,
        pageSize,
        undefined,
        cursorId,
        {
            subentry: subentries,
        },
    );
    let skipsRemaining = (data.pagedResults && ("newRequest" in data.pagedResults))
        ? (pageNumber * pageSize)
        : 0;

    let limitExceeded: LimitProblem | undefined;
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
            if ("present" in state.invokeId) {
                const op = conn.invocations.get(state.invokeId.present);
                if (op?.abandonTime) {
                    throw new errors.AbandonError(
                        "Abandoned.",
                        new AbandonedData(
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                abandoned["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    );
                }
            }
            if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
                limitExceeded = LimitProblem_timeLimitExceeded;
                break;
            }
            cursorId = subordinate.dse.id;
            if (listItems.length >= pageSize) {
                limitExceeded = LimitProblem_sizeLimitExceeded;
                break;
            }
            if (subentries && !subordinate.dse.subentry) {
                continue;
            }
            if (accessControlScheme) {
                const subordinateDN = [ ...targetDN, subordinate.dse.rdn ];
                const subordinateACI = [
                    ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && subordinate.dse.subentry)
                        ? target.dse.admPoint?.subentryACI ?? []
                        : []),
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
                            conn.boundNameAndUID!,
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
            if (subentries && subordinate.dse.subentry) {
                if (skipsRemaining <= 0) {
                    listItems.push(new ListItem(
                        subordinate.dse.rdn,
                        undefined,
                        undefined,
                    ));
                    continue;
                } else {
                    skipsRemaining--;
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
                if (skipsRemaining <= 0) {
                    listItems.push(new ListItem(
                        subordinate.dse.rdn,
                        false,
                        Boolean(subordinate.dse.shadow),
                    ));
                } else {
                    skipsRemaining--;
                }
            } else if (subordinate.dse.alias) {
                if (skipsRemaining <= 0) {
                    listItems.push(new ListItem(
                        subordinate.dse.rdn,
                        true,
                        Boolean(subordinate.dse.shadow),
                    ));
                } else {
                    skipsRemaining--;
                }
            }
        }
        if (limitExceeded !== undefined) {
            break;
        }
        subordinatesInBatch = await readChildren(
            ctx,
            target,
            pageSize,
            undefined,
            cursorId,
            {
                subentry: subentries,
            },
        );
    }

    if (queryReference && pagingRequest) {
        conn.pagedResultsRequests.set(queryReference, {
            request: pagingRequest,
            pageIndex: page + 1,
            cursorId,
        });
    }

    // TODO: Implement sorting.
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

    const result: ListResult = {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                undefined,
                listItems,
                // The POQ shall only be present if the results are incomplete.
                (queryReference && (limitExceeded !== undefined))
                    ? new PartialOutcomeQualifier(
                        limitExceeded,
                        undefined,
                        undefined,
                        undefined,
                        Buffer.from(queryReference, "base64"),
                        undefined,
                        undefined,
                        undefined,
                    )
                    : undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    id_opcode_list,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        },
    };
    return {
        result: new ChainedResult(
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
        ),
        stats: {
            request: {
                operationCode: codeToString(id_opcode_list),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                listFamily: data.listFamily,
                prr: data.pagedResults
                    ? getStatisticsFromPagedResultsRequest(data.pagedResults)
                    : undefined,
            },
            outcome: {
                result: {
                    list: getListResultStatistics(result),
                    poq: (("listInfo" in result.unsigned) && result.unsigned.listInfo.partialOutcomeQualifier)
                        ? getPartialOutcomeQualifierStatistics(result.unsigned.listInfo.partialOutcomeQualifier)
                        : undefined,
                },
            },
        },
    };
}

export default list_i;


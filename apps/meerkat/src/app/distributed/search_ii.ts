import type { ClientAssociation, PagedResultsRequestState } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { TRUE_BIT, TRUE } from "asn1-ts";
import * as crypto from "crypto";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
    ServiceControlOptions_preferChaining as preferChainingBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import readSubordinates from "../dit/readSubordinates";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import checkSuitabilityProcedure from "./checkSuitability";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import search_i_ex, { SearchState, update_search_state_with_search_rule } from "./search_i";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";
import {
    ServiceProblem_invalidQueryReference,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedProblem.ta";
import {
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import { stringifyDN } from "../x500/stringifyDN";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { printInvokeId } from "../utils/printInvokeId";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { getServiceAdminPoint } from "../dit/getServiceAdminPoint";
import getEntryExistsFilter from "../database/entryExistsFilter";
import { searchRules } from "@wildboar/x500/src/lib/collections/attributes";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import { MAX_RESULTS } from "../constants";
import accessControlSchemesThatUseRBAC from "../authz/accessControlSchemesThatUseRBAC";
import { get_security_labels_for_rdn } from "../authz/get_security_labels_for_rdn";

const BYTES_IN_A_UUID: number = 16;

/**
 * "Why don't you just fetch `pageSize` number of entries?"
 *
 * Pagination fetches `pageSize` number of entries at _each level_ of search
 * recursion. In other words, if you request a page size of 100, and, in the
 * process, you recurse into the DIT ten layers deep, there will actually be
 * 1000 entries loaded into memory at the deepest part. This means that a
 * request could consume considerably higher memory than expected. To prevent
 * this, a fixed page size is used. In the future, this may be configurable.
 */
const ENTRIES_PER_BATCH: number = 1000;
const AUTONOMOUS: string = id_ar_autonomousArea.toString();

/**
 * @summary The Search (II) Procedure, as specified in ITU Recommendation X.518.
 * @description
 *
 * The `search` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 11.2, per the recommended implementation of the Search (II) procedure
 * defined in in ITU Recommendation X.518 (2016), Section 19.3.2.2.6.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param argument The original SearchArgument
 * @param searchState The current search state
 *
 * @function
 * @async
 */
export
async function search_ii (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    argument: SearchArgument,
    searchState: SearchState,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );

    searchState.effectiveFilter = searchState.effectiveFilter ?? data.extendedFilter ?? data.filter;
    searchState.effectiveEntryLimit = Number(data.serviceControls?.sizeLimit ?? MAX_RESULTS);
    searchState.effectiveFamilyGrouping = data.familyGrouping;
    searchState.effectiveFamilyReturn = data.selection?.familyReturn;

    // NOTE: This is copied from Search (I)
    if (state.chainingArguments.searchRuleId && !searchState.governingSearchRule) {
        const searchRuleId = state.chainingArguments.searchRuleId;
        const sap = getServiceAdminPoint(state.foundDSE);
        if (sap) {
            const governing_search_rule = (await ctx.db.attributeValue.findMany({
                where: {
                    entry: {
                        ...getEntryExistsFilter(),
                        immediate_superior_id: sap.dse.id,
                        subentry: true,
                    },
                    type_oid: searchRules["&id"].toBytes(),
                },
                select: {
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            }))
                .map(attributeValueFromDB)
                .map(searchRules.decoderFor["&Type"]!)
                .find((sr) => (
                    (sr.id === searchRuleId.id)
                    && sr.dmdId.isEqualTo(searchRuleId.dmdId)
                ));
                ;
            if (governing_search_rule) {
                update_search_state_with_search_rule(data, searchState, governing_search_rule);
            } else {
                ctx.log.warn(ctx.i18n.t("log:unable_to_find_search_rule", {
                    dmd_id: searchRuleId.dmdId.toString(),
                    id: searchRuleId.id.toString(),
                }));
            }
        }
    }

    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    if (requestor) {
        ctx.log.debug(ctx.i18n.t("log:requester", {
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            r: stringifyDN(ctx, requestor).slice(0, 256),
            context: "search_ii",
        }));
    }

    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     *
     * Meerkat DSA allows operations with invalid signatures to progress
     * through all pre-operation-evaluation procedures leading up to operation
     * evaluation, but with `AuthenticationLevel.basicLevels.signed` set to
     * `FALSE` so that access controls are still respected. Therefore, if we get
     * to this point in the code, and the argument is signed, but the
     * authentication level has the `signed` field set to `FALSE`, we throw an
     * `invalidSignature` error.
     */
    if (
        (searchState.depth === 0)
        && ("signed" in argument)
        && state.chainingArguments.authenticationLevel
        && ("basicLevels" in state.chainingArguments.authenticationLevel)
        && !state.chainingArguments.authenticationLevel.basicLevels.signed
    ) {
        const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
        const logInfo = {
            context: "arg",
            host: remoteHostIdentifier,
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            ap: stringifyDN(ctx, requestor ?? []),
        };
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    // #endregion Signature validation
    const chainingProhibited = (
        (data.serviceControls?.options?.[chainingProhibitedBit] === TRUE_BIT)
        || (data.serviceControls?.options?.[manageDSAITBit] === TRUE_BIT)
    );
    const preferChaining: boolean = (data.serviceControls?.options?.[preferChainingBit] === TRUE_BIT);
    if (
        data.pagedResults
        && (data.securityParameters?.target === ProtectionRequest_signed)
        && (!chainingProhibited || preferChaining)
    ) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:cannot_use_pagination_and_signing"),
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const serviceControlOptions = data.serviceControls?.options;
    const dontUseCopy: boolean = (serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);

    /**
     * NOTE: Joins are going to be ENTIRELY UNSUPPORTED, because many details
     * are unspecified:
     *
     * - The `relatedEntry` attribute that joining depends on is _undefined_ by any ITU specification.
     * - ~~It is not clear what `JoinArgument.domainLocalID` even is, nor how to handle if it is not understood.~~
     *   - I rescined this statement^. `domainLocalID` is defined in X.518.
     *   - However, it is still undefined what to do if it is not recognized.
     *
     * If this is ever implemented, the code below will also need to perform
     * pagination before joining. The code below is _extremely unscalable_.
     * Because every entry has to be compared against every other entry
     * (and indexing attribute values generally is not viable), the compute
     * time will grow a O(n^2) or even worse time (because all attributes of
     * each entry must be compared, and the same for all values of said
     * attributes.) This is so unscalable, I had doubts about implementing it
     * in the first place.
     *
     * Also, if the code below is ever implemented, another deduplication may be
     * necessary, because the additional entries brought in by the joins may
     * overlap. On the other hand, maybe it's fine to allow the user to do this?
     *
     * For now, if a join is attempted, the server should just return an
     * unwillingToPerform error.
     */
    if (data.joinArguments) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:joins_unsupported"),
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    let cursorId: number | undefined = searchState.paging?.[1].cursorIds[searchState.depth];
    if (!searchState.depth && data.pagedResults) { // This should only be done for the first recursion.
        if ("newRequest" in data.pagedResults) {
            const nr = data.pagedResults.newRequest;
            const pi = (((nr.pageNumber !== undefined) ? Number(nr.pageNumber) : 1) - 1); // The spec is unclear if this is zero-indexed.
            if ((pi < 0) || !Number.isSafeInteger(pi)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:page_number_invalid", {
                        pi,
                    }),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            // pageSize = 0 is a problem because we push entry to results before checking if we have a full page.
            if ((nr.pageSize < 1) || !Number.isSafeInteger(nr.pageSize)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:page_size_invalid", {
                        ps: nr.pageSize,
                    }),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            if (nr.sortKeys?.length) {
                const uniqueSortKeys = new Set(nr.sortKeys.map((sk) => sk.type_.toString()));
                if (uniqueSortKeys.size < nr.sortKeys.length) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:duplicate_sort_key", {
                            ps: nr.pageSize,
                        }),
                        new ServiceErrorData(
                            ServiceProblem_unwillingToPerform,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_errcode_serviceError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
                if (nr.sortKeys.length > 3) {
                    ctx.log.warn(ctx.i18n.t("log:too_many_sort_keys", {
                        aid: assn.id,
                        num: nr.sortKeys.length,
                    }), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                    nr.sortKeys.length = 3;
                }
            }
            const queryReference: string = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            const newPagingState: PagedResultsRequestState = {
                cursorIds: [],
                request: data.pagedResults.newRequest,
                alreadyReturnedById: new Set(),
            };
            searchState.paging = [ queryReference, newPagingState ];
            if (assn.pagedResultsRequests.size >= 5) {
                assn.pagedResultsRequests.clear();
            }
            assn.pagedResultsRequests.set(queryReference, newPagingState);
        } else if ("queryReference" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.queryReference).toString("base64");
            const paging = assn.pagedResultsRequests.get(queryReference);
            if (!paging) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:paginated_query_ref_invalid"),
                    new ServiceErrorData(
                        ServiceProblem_invalidQueryReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_serviceError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            searchState.paging = [ queryReference, paging ];
            cursorId = searchState.paging[1].cursorIds[searchState.depth];
        } else if ("abandonQuery" in data.pagedResults) {
            const queryReference: string = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
            assn.pagedResultsRequests.delete(queryReference);
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned_paginated_query"),
                new AbandonedData(
                    AbandonedProblem_pagingAbandoned,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else {
            throw new errors.ServiceError(
                ctx.i18n.t("err:unrecognized_paginated_query_syntax"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    let subordinatesInBatch = await readSubordinates(
        ctx,
        target,
        ENTRIES_PER_BATCH,
        undefined,
        cursorId,
        {
            cp: true,
        },
    );
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
            cursorId = subordinate.dse.id;
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            if (!subordinate.dse.cp) {
                continue;
            }
            const suitable: boolean = await checkSuitabilityProcedure(
                ctx,
                state,
                assn,
                subordinate,
                search["&operationCode"]!,
                state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
                data.criticalExtensions ?? new Uint8ClampedArray(),
                dontUseCopy,
                copyShallDo,
                state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
                undefined,
                argument,
                signErrors,
            );
            if (!suitable) {
                continue;
            }
            // Step #4
            const newArgument: SearchArgument = (
                (subset === SearchArgumentData_subset_oneLevel)
                && (subordinate.dse.alias)
            )
                ? {
                    unsigned: new SearchArgumentData(
                        data.baseObject,
                        data.subset,
                        data.filter,
                        data.searchAliases,
                        data.selection,
                        data.pagedResults,
                        data.matchedValuesOnly,
                        data.extendedFilter,
                        data.checkOverspecified,
                        data.relaxation,
                        data.extendedArea,
                        data.hierarchySelections,
                        data.searchControlOptions,
                        data.joinArguments,
                        data.joinType,
                        data._unrecognizedExtensionsList,
                        data.serviceControls,
                        data.securityParameters,
                        data.requestor,
                        data.operationProgress,
                        data.aliasedRDNs,
                        data.criticalExtensions,
                        data.referenceType,
                        TRUE, // data.entryOnly,
                        data.exclusions,
                        data.nameResolveOnMaster,
                        data.operationContexts,
                        data.familyGrouping,
                    ),
                }
                : argument;
            searchState.depth++;
            await search_i_ex(
                ctx,
                assn,
                {
                    ...state,
                    admPoints: subordinate.dse.admPoint
                        ? (subordinate.dse.admPoint.administrativeRole.has(AUTONOMOUS)
                            ? [ subordinate ]
                            : [ ...state.admPoints, subordinate ])
                        : [ ...state.admPoints ],
                },
                newArgument,
                searchState,
            );
            searchState.depth--;
        }
        subordinatesInBatch = await readSubordinates(
            ctx,
            target,
            ENTRIES_PER_BATCH,
            undefined,
            cursorId,
        );
    }
}

export default search_ii;

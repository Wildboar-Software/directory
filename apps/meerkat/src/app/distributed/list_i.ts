import {
    Vertex,
    ClientAssociation,
    WithRequestStatistics,
    WithOutcomeStatistics,
    PagedResultsRequestState,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { ObjectIdentifier, TRUE_BIT, FALSE } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import * as errors from "@wildboar/meerkat-types";
import * as crypto from "crypto";
import {
    ListArgument,
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ServiceControlOptions_subentries as subentriesBit,
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
    ServiceControlOptions_preferChaining as preferChainingBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import readSubordinates from "../dit/readSubordinates";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    ListResultData_listInfo_subordinates_Item as ListItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_READ,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_list,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
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
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
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
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import {
    child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
import type { Prisma } from "@prisma/client";
import { MAX_RESULTS, UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import {
    alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
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
import DSPAssociation from "../dsp/DSPConnection";
import { entryACI, prescriptiveACI, subentryACI } from "@wildboar/x500/src/lib/collections/attributes";

const BYTES_IN_A_UUID: number = 16;
const PARENT: string = parent["&id"].toString();
const CHILD: string = child["&id"].toString();
const ID_AUTONOMOUS: string = id_ar_autonomousArea.toString();
const ID_AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
const ID_AC_INNER: string = id_ar_accessControlInnerArea.toString();

export
interface ListState extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    chaining: ChainingResults;
    results: ListItem[];
    resultSets: ListResult[];
    poq?: PartialOutcomeQualifier;
    queryReference?: string;
}

/**
 * @summary The List (I) Procedure, as specified in ITU Recommendation X.518.
 * @description
 *
 * The `list` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 11.1, per the recommended implementation of the List (I) procedure
 * defined in in ITU Recommendation X.518 (2016), Section 19.3.1.2.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function list_i (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<ListState> {
    const target = state.foundDSE;
    const argument: ListArgument = _decode_ListArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );

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
        ("signed" in argument)
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
                    serviceError["&errorCode"],
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
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const targetDN = getDistinguishedName(target);
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const targetRelevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const targetAccessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);

    const isParent: boolean = target.dse.objectClass.has(PARENT);
    const isChild: boolean = target.dse.objectClass.has(CHILD);
    const isAncestor: boolean = (isParent && !isChild);

    let pagingRequest: PagedResultsRequest_newRequest | undefined;
    let queryReference: string | undefined;
    let cursorId: number | undefined;
    const signDSPResult: boolean = (
        (state.chainingArguments.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn instanceof DSPAssociation)
        && assn.authorizedForSignedResults
    );
    const chainingResults = new ChainingResults(
        undefined,
        undefined,
        createSecurityParameters(
            ctx,
            signDSPResult,
            assn.boundNameAndUID?.dn,
            id_opcode_list,
        ),
        undefined,
    );
    const ret: ListState = {
        chaining: chainingResults,
        results: [],
        resultSets: [],
    };
    if (data.pagedResults) {
        if ("newRequest" in data.pagedResults) {
            const nr = data.pagedResults.newRequest;
            const pi = (((nr.pageNumber !== undefined)
                ? Number(nr.pageNumber)
                : 1) - 1); // The spec is unclear if this is zero-indexed.
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
                            serviceError["&errorCode"],
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
                            serviceError["&errorCode"],
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
                                serviceError["&errorCode"],
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
            queryReference = crypto.randomBytes(BYTES_IN_A_UUID).toString("base64");
            pagingRequest = data.pagedResults.newRequest;
            const newPagingState: PagedResultsRequestState = {
                cursorIds: [],
                request: data.pagedResults.newRequest,
                alreadyReturnedById: new Set(),
            };
            // listState.paging = [ queryReference, newPagingState ];
            if (assn.pagedResultsRequests.size >= 5) {
                assn.pagedResultsRequests.clear();
            }
            assn.pagedResultsRequests.set(queryReference, newPagingState);
            ret.queryReference = queryReference;
        } else if ("queryReference" in data.pagedResults) {
            queryReference = Buffer.from(data.pagedResults.queryReference).toString("base64");
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
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            pagingRequest = paging.request;
            cursorId = paging.cursorIds[0];
            return ret;
        } else if ("abandonQuery" in data.pagedResults) {
            queryReference = Buffer.from(data.pagedResults.abandonQuery).toString("base64");
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
                    ServiceProblem_unavailable,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }
    const sizeLimit: number = pagingRequest
        ? MAX_RESULTS
        : Number(data.serviceControls?.sizeLimit ?? MAX_RESULTS);
    const whereArgs: Partial<Prisma.EntryWhereInput> = {
        subentry: subentries,
        EntryObjectClass: (data.listFamily && target.dse.objectClass.has(PARENT))
            ? {
                some: {
                    object_class: CHILD,
                },
            }
            : undefined,
    };
    const getNextBatchOfSubordinates = () => readSubordinates(ctx, target, sizeLimit, undefined, cursorId, whereArgs);
    let limitExceeded: LimitProblem | undefined;
    let subordinatesInBatch = await getNextBatchOfSubordinates();
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
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
            if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
                limitExceeded = LimitProblem_timeLimitExceeded;
                break;
            }
            if (ret.results.length >= sizeLimit) {
                limitExceeded = LimitProblem_sizeLimitExceeded;
                break;
            }
            /**
             * This MUST appear after processing the limits, because the entry
             * has not really been "processed" if we bailed out of this loop
             * because of limits.
             */
            cursorId = subordinate.dse.id;
            if (isAncestor && data.listFamily && !subordinate.dse.objectClass.has(CHILD)) {
                continue;
            }
            if (subentries && !subordinate.dse.subentry) {
                continue;
            }
            let authorizedToKnowSubordinateIsAlias: boolean = true;
            const effectiveAccessControlScheme = subordinate.dse.admPoint?.accessControlScheme
                ?? targetAccessControlScheme;
            if (
                effectiveAccessControlScheme
                && accessControlSchemesThatUseACIItems.has(effectiveAccessControlScheme.toString())
            ) {
                const subordinateDN = [ ...targetDN, subordinate.dse.rdn ];
                const effectiveRelevantSubentries = subordinate.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)
                    ? []
                    : [ ...targetRelevantSubentries ]; // Must spread to create a new reference. Otherwise...
                if (subordinate.dse.admPoint?.administrativeRole.has(ID_AC_SPECIFIC)) { // ... (keep going)
                    effectiveRelevantSubentries.length = 0; // ...this will modify the target-relevant subentries!
                    effectiveRelevantSubentries.push(...(await getRelevantSubentries(ctx, subordinate, subordinateDN, subordinate)));
                } else if (subordinate.dse.admPoint?.administrativeRole.has(ID_AC_INNER)) {
                    effectiveRelevantSubentries.push(...(await getRelevantSubentries(ctx, subordinate, subordinateDN, subordinate)));
                }
                const subordinateACI = await getACIItems(
                    ctx,
                    effectiveAccessControlScheme,
                    subordinate.immediateSuperior,
                    subordinate,
                    effectiveRelevantSubentries,
                    Boolean(subordinate.dse.subentry),
                );
                const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                    .flatMap((aci) => getACDFTuplesFromACIItem(aci));
                const relevantSubordinateTuples: ACDFTupleExtended[] = await preprocessTuples(
                    effectiveAccessControlScheme,
                    subordinateACDFTuples,
                    user,
                    state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                    subordinateDN,
                    isMemberOfGroup,
                    NAMING_MATCHER,
                );
                const objectClasses = Array.from(subordinate.dse.objectClass).map(ObjectIdentifier.fromString);
                const { authorized: authorizedToList } = bacACDF(
                    relevantSubordinateTuples,
                    user,
                    { entry: objectClasses },
                    [
                        PERMISSION_CATEGORY_BROWSE,
                        PERMISSION_CATEGORY_RETURN_DN,
                    ],
                    bacSettings,
                    true,
                );
                if (!authorizedToList) {
                    continue;
                }
                if (subordinate.dse.alias) {
                    const { authorized: authorizedToReadObjectClasses } = bacACDF(
                        relevantSubordinateTuples,
                        user,
                        {
                            attributeType: objectClass["&id"],
                            operational: false,
                        },
                        [ PERMISSION_CATEGORY_READ ],
                        bacSettings,
                        true,
                    );
                    const { authorized: authorizedToReadAliasObjectClasses } = bacACDF(
                        relevantSubordinateTuples,
                        user,
                        {
                            value: new AttributeTypeAndValue(
                                objectClass["&id"],
                                _encodeObjectIdentifier(alias["&id"], DER),
                            ),
                            operational: false,
                        },
                        [ PERMISSION_CATEGORY_READ ],
                        bacSettings,
                        true,
                    );
                    const { authorized: authorizedToReadAliasedEntryName } = bacACDF(
                        relevantSubordinateTuples,
                        user,
                        {
                            attributeType: aliasedEntryName["&id"],
                            operational: false,
                        },
                        [ PERMISSION_CATEGORY_READ ],
                        bacSettings,
                        true,
                    );
                    authorizedToKnowSubordinateIsAlias = (
                        authorizedToReadObjectClasses
                        && authorizedToReadAliasObjectClasses
                        && authorizedToReadAliasedEntryName
                    );
                }
            }
            if (subentries && subordinate.dse.subentry) {
                ret.results.push(new ListItem(
                    subordinate.dse.rdn,
                    authorizedToKnowSubordinateIsAlias
                        ? Boolean(subordinate.dse.alias)
                        : FALSE,
                    Boolean(!subordinate.dse.shadow),
                ));
                continue;
            }
            if (subordinate.dse.subr) {
                /**
                 * [ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en),
                 * Section 19.3.1.2.1, Bullet Point 3.b.i, states that:
                 *
                 * > If e' is of type `subr`, then there are two cases. In the
                 * > first case, the subordinate entry's ACI and object class is
                 * > available locally, in which case, based on local policy and
                 * > the ACI's permission, add the RDN of e' to
                 * > `listInfo.subordinates`... The other case is when the ACI
                 * > of the entry is not available in e', in which case add a
                 * > Continuation Reference to SRcontinuationList...
                 *
                 * At this point in the code, the access controls were already
                 * checked: we just need to check if they were checked on the
                 * basis of ACI data that was replicated in the subordinate
                 * reference DSE. To do this, we merely check if any ACI items
                 * are associated directly with the DSE. If not, we assume the
                 * ACI items have not been replicated, meaning that we do not
                 * have it locally, meaning that we need to continue the
                 * request in the subordinate DSA, which should have it.
                 */
                const aciAndObjectClassAvailableLocally: boolean = !!(
                    (subordinate.dse.objectClass.size > 0)
                    && ( // ...if there are any attributes that suggest that this DSE is subject to access control...
                        !!(await ctx.db.attributeValue.findFirst(({
                            where: {
                                entry_id: subordinate.dse.id,
                                type_oid: {
                                    in: [
                                        entryACI["&id"].toBytes(),
                                        subentryACI["&id"].toBytes(),
                                        prescriptiveACI["&id"].toBytes(),
                                    ],
                                },
                            },
                            select: { id: true },
                        })))
                        // Rule-based access control is not supported yet, so if
                        // this next line were enabled, it would simply make the
                        // subr DSE unavailable to all users.
                        // || subordinate.dse.clearances?.length
                    )
                );
                if (!aciAndObjectClassAvailableLocally) {
                    state.SRcontinuationList.push(new ContinuationReference(
                        /**
                         * The specification says to return the DN of the TARGET, not
                         * the subordinate... This does not quite make sense to me. I
                         * wonder if the specification is incorrect, but it also seems
                         * plausible that I am misunderstanding the semantics of the
                         * ContinuationReference.
                         *
                         * Actually, I think this makes sense. You are telling the
                         * subordinate DSA that it should continue to return the
                         * subordinates of the target DSE, not the subordinate.
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
                    ));
                    continue;
                }
                ret.results.push(new ListItem(
                    subordinate.dse.rdn,
                    !!(subordinate.dse.alias && authorizedToKnowSubordinateIsAlias),
                    !subordinate.dse.shadow,
                ));
            } else if (subordinate.dse.entry || subordinate.dse.glue) {
                ret.results.push(new ListItem(
                    subordinate.dse.rdn,
                    FALSE,
                    !subordinate.dse.shadow,
                ));
            } else if (subordinate.dse.alias) {
                ret.results.push(new ListItem(
                    subordinate.dse.rdn,
                    authorizedToKnowSubordinateIsAlias,
                    !subordinate.dse.shadow,
                ));
            }
        }
        if (limitExceeded !== undefined) {
            break;
        }
        subordinatesInBatch = await getNextBatchOfSubordinates();
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    if (target.dse.nssr) {
        state.SRcontinuationList.push(new ContinuationReference(
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
        ));
    }

    // DEVIATION: No error at all is returned if there are no subordinates.
    // I think this is unnecessary, because Meerkat DSA already checks that you
    // have Browse and ReturnDN permissions to even discover the base object.
    // Note that this is not a requirement of the X.500 standards, which is
    // probably why they want you to check DiscloseOnError permissions here.

    return {
        ...ret,
        poq: (limitExceeded !== undefined)
            ? new PartialOutcomeQualifier(
                limitExceeded,
            )
            : undefined,
    };
}

export default list_i;


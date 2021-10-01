import type { Context, Vertex, ClientConnection, WithRequestStatistics, WithOutcomeStatistics } from "../types";
import * as errors from "../errors";
import * as crypto from "crypto";
import { DER } from "asn1-ts/dist/node/functional";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    HierarchySelections_self,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import { OBJECT_IDENTIFIER, TRUE_BIT, TRUE, ASN1Element, ObjectIdentifier } from "asn1-ts";
import readChildren from "../dit/readChildren";
import readChildrenSorted from "../dit/readChildrenSorted";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ServiceControlOptions_subentries as subentriesBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import type ApproxMatcher from "@wildboar/x500/src/lib/types/ApproxMatcher";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import getDistinguishedName from "../x500/getDistinguishedName";
import { evaluateFilter, EvaluateFilterSettings } from "@wildboar/x500/src/lib/utils/evaluateFilter";
import { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
    OperationProgress_nameResolutionPhase_proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import isPrefix from "../x500/isPrefix";
import searchAliasesProcedure from "./searchAliases";
import hierarchySelectionProcedure from "./hierarchySelection";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import getAttributeTypesFromFilter from "../x500/getAttributeTypesFromFilter";
import readAttributes from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    readEntryInformation,
} from "../database/entry/readEntryInformation";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_COMPARE,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
    PERMISSION_CATEGORY_FILTER_MATCH,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import attributesFromValues from "../x500/attributesFromValues";
import {
    id_at_aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-aliasedEntryName.va";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidQueryReference,
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
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";
import cloneChainingArguments from "../x500/cloneChainingArguments";
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getOrderingMatcherGetter from "../x500/getOrderingMatcherGetter";
import getSubstringsMatcherGetter from "../x500/getSubstringsMatcherGetter";

// TODO: This will require serious changes when service specific areas are implemented.

const BYTES_IN_A_UUID: number = 16;

export
interface SearchIReturn extends Partial<WithRequestStatistics>, Partial<WithOutcomeStatistics> {
    chaining: ChainingResults;
    results: EntryInformation[];
    poq?: PartialOutcomeQualifier;
    skipsRemaining?: number;
}

export
async function search_i (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
    argument: SearchArgument,
    ret: SearchIReturn,
): Promise<void> {
    const target = state.foundDSE;
    const data = getOptionallyProtectedValue(argument);

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
            "Joins are entirely unsupported by this server.",
            new ServiceErrorData(
                ServiceProblem_unwillingToPerform,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_serviceError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const targetDN = getDistinguishedName(target);
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
                            id_errcode_serviceError,
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
                            id_errcode_serviceError,
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
                            id_errcode_serviceError,
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
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_serviceError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    const pageNumber: number = pagingRequest?.pageNumber ?? 0;
    const pageSize: number = pagingRequest?.pageSize
        ?? data.serviceControls?.sizeLimit
        ?? Infinity;
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        ret.poq = new PartialOutcomeQualifier(
            LimitProblem_timeLimitExceeded,
            undefined,
            undefined,
            undefined,
            queryReference
                ? Buffer.from(queryReference, "base64")
                : undefined,
            undefined,
            undefined,
            undefined,
        );
        return;
    }
    if (ret.results.length >= pageSize) {
        ret.poq = new PartialOutcomeQualifier(
            LimitProblem_sizeLimitExceeded,
            undefined,
            undefined,
            undefined,
            queryReference
                ? Buffer.from(queryReference, "base64")
                : undefined,
            undefined,
            undefined,
            undefined,
        );
        return;
    }
    if (ret.skipsRemaining === undefined) {
        ret.skipsRemaining = (data.pagedResults && ("newRequest" in data.pagedResults))
            ? (pageNumber * pageSize)
            : 0;
    }
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
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
    const onBaseObjectIteration: boolean = (targetDN.length === data.baseObject.rdnSequence.length);
    const authorized = (permissions: number[]) => {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            permissions,
            EQUALITY_MATCHER,
        );
        return authorized;
    };
    if (accessControlScheme) {
        const authorizedToSearch = authorized([
            PERMISSION_CATEGORY_RETURN_DN,
            PERMISSION_CATEGORY_BROWSE,
        ]);
        if (onBaseObjectIteration) {
            const authorizedForDisclosure = authorized([
                PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
            ]);
            if (!authorizedToSearch) {
                if (authorizedForDisclosure) {
                    throw new errors.SecurityError(
                        "Not permitted to search the base object entry.",
                        new SecurityErrorData(
                            SecurityProblem_insufficientAccessRights,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                securityError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    );
                } else {
                    throw new errors.NameError(
                        "Not permitted to search the base object entry.",
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
        } else if (!authorizedToSearch) {
            return;
        }
    }
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const searchAliases = data.searchAliases ?? SearchArgumentData._default_value_for_searchAliases;
    /**
     * NOTE: It is critical that entryOnly comes from ChainingArguments. The
     * default values are the OPPOSITE between ChainingArguments and CommonArguments.
     */
    const entryOnly = state.chainingArguments.entryOnly ?? ChainingArguments._default_value_for_entryOnly;
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const filter = data.filter ?? SearchArgumentData._default_value_for_filter;
    const serviceControlOptions = data.serviceControls?.options;
    // Service controls
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const filteredAttributes = filter
        ? getAttributeTypesFromFilter(filter)
        : undefined;
    const infoItems: EntryInformation_information_Item[] = [];
    const eis: EntryInformationSelection | undefined = filteredAttributes
        ? new EntryInformationSelection(
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributes.get(attr.toString());
                        if (!spec) {
                            return true; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage === AttributeUsage_userApplications);
                    }),
            },
            undefined,
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributes.get(attr.toString());
                        if (!spec) {
                            return false; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage !== AttributeUsage_userApplications);
                    }),
            },
            undefined,
            undefined,
            undefined,
        )
        : undefined;
    const {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    } = await readAttributes(ctx, target, eis, relevantSubentries, data.operationContexts);
    const attributes = [
        ...userAttributes,
        ...operationalAttributes,
        ...collectiveAttributes,
    ];
    infoItems.push(...attributes.map((attribute): EntryInformation_information_Item => ({
        attribute,
    })));
    /**
     * This is the entry information that is used for filtering, not necessarily
     * what is returned by the search (via `selection`).
     */
    const entryInfo = new EntryInformation(
        {
            rdnSequence: targetDN,
        },
        undefined,
        infoItems,
        undefined,
        undefined,
        undefined,
    );
    const filterOptions: EvaluateFilterSettings = {
        getEqualityMatcher: getEqualityMatcherGetter(ctx),
        getOrderingMatcher: getOrderingMatcherGetter(ctx),
        getSubstringsMatcher: getSubstringsMatcherGetter(ctx),
        getApproximateMatcher: (attributeType: OBJECT_IDENTIFIER): ApproxMatcher | undefined => {
            return undefined; // TODO:
        },
        getContextMatcher: (contextType: OBJECT_IDENTIFIER): ContextMatcher | undefined => {
            return ctx.contextMatchers.get(contextType.toString());
        },
        isMatchingRuleCompatibleWithAttributeType: (mr: OBJECT_IDENTIFIER, at: OBJECT_IDENTIFIER): boolean => {
            return true; // FIXME:
        },
        isAttributeSubtype: (attributeType: OBJECT_IDENTIFIER, parentType: OBJECT_IDENTIFIER): boolean => {
            return true; // FIXME:
        },
        permittedToMatch: (attributeType: OBJECT_IDENTIFIER, value?: ASN1Element): boolean => {
            if (!accessControlScheme) {
                return true;
            }
            const {
                authorized: authorizedToMatch,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                value
                    ? {
                        value: new AttributeTypeAndValue(
                            attributeType,
                            value,
                        ),
                    }
                    : {
                        attributeType,
                    },
                [
                    PERMISSION_CATEGORY_FILTER_MATCH,
                    PERMISSION_CATEGORY_COMPARE, // Not required by specification.
                    PERMISSION_CATEGORY_READ, // Not required by specification.
                ],
                EQUALITY_MATCHER,
            );
            return authorizedToMatch;
        },
        performExactly: false, // FIXME:
    };

    if (target.dse.cp) {
        if (data.exclusions?.some((x) => isPrefix(ctx, x, targetDN))) {
            return;
        } else {
            const suitable: boolean = checkSuitabilityProcedure(
                ctx,
                target,
                search["&operationCode"]!,
                dontUseCopy,
                copyShallDo,
                state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
            );
            if (suitable) {
                if (ret.chaining.alreadySearched) {
                    ret.chaining.alreadySearched.push(targetDN);
                } else {
                    ret.chaining = new ChainingResults(
                        ret.chaining.info,
                        ret.chaining.crossReferences,
                        ret.chaining.securityParameters,
                        [ targetDN ],
                    );
                }
            } else {
                const cr = new ContinuationReference(
                    {
                        rdnSequence: targetDN.slice(0, -1),
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        (targetDN.length - 1),
                    ),
                    undefined,
                    ReferenceType_subordinate,
                    (target.dse.cp.supplierKnowledge ?? [])
                        .map((sk) => new AccessPointInformation(
                                sk.ae_title,
                                sk.address,
                                sk.protocolInformation,
                                (typeof sk.supplier_is_master === "boolean")
                                    ? sk.supplier_is_master
                                        ? MasterOrShadowAccessPoint_category_master
                                        : MasterOrShadowAccessPoint_category_shadow
                                    : undefined,
                                undefined,
                                undefined,
                            )),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                state.SRcontinuationList.push(cr);
            }
            return;
        }
    }

    // NOTE: This was copied from the read operation.
    const filterUnauthorizedEntryInformation = (
        einfo: EntryInformation_information_Item[],
    ): [ boolean, EntryInformation_information_Item[] ] => {
        if (!accessControlScheme) {
            return [ true, einfo ];
        }
        let incompleteEntry: boolean = false;
        const permittedEinfo: EntryInformation_information_Item[] = [];
        for (const info of einfo) {
            if ("attribute" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attribute.type_,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (!authorizedToAddAttributeType) {
                    incompleteEntry = true;
                    continue;
                }
                const permittedValues = valuesFromAttribute(info.attribute)
                    .filter((value) => {
                        const {
                            authorized: authorizedToAddAttributeValue,
                        } = bacACDF(
                            relevantTuples,
                            conn.authLevel,
                            {
                                value: new AttributeTypeAndValue(
                                    value.id,
                                    value.value,
                                ),
                            },
                            [
                                PERMISSION_CATEGORY_READ,
                            ],
                            EQUALITY_MATCHER,
                        );
                        if (!authorizedToAddAttributeValue) {
                            incompleteEntry = true;
                        }
                        return authorizedToAddAttributeValue;
                    });
                const attribute = attributesFromValues(permittedValues)[0];
                if (attribute) {
                    permittedEinfo.push({ attribute });
                } else {
                    permittedEinfo.push({
                        attributeType: info.attribute.type_,
                    });
                }
            } else if ("attributeType" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attributeType,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (authorizedToAddAttributeType) {
                    permittedEinfo.push(info);
                }
            } else {
                continue;
            }
        }
        return [ incompleteEntry, permittedEinfo ];
    };

    if (target.dse.alias && searchAliases) {
        const authorizedToReadEntry: boolean = authorized([
            PERMISSION_CATEGORY_READ,
        ]);
        const {
            authorized: authorizedToReadAliasedEntryName,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                attributeType: id_at_aliasedEntryName,
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToReadAliasedEntryNameValue,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                value: new AttributeTypeAndValue(
                    id_at_aliasedEntryName,
                    _encode_DistinguishedName(target.dse.alias.aliasedEntryName, DER),
                ),
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
        );
        if (
            !authorizedToReadEntry
            || !authorizedToReadAliasedEntryName
            || !authorizedToReadAliasedEntryNameValue
        ) {
            return; // REVIEW: This is not totally correct.
        }
        await searchAliasesProcedure(
            ctx,
            conn,
            target,
            argument,
            state.chainingArguments,
            ret,
        );
        return;
    }
    if ((subset === SearchArgumentData_subset_oneLevel) && !entryOnly) {
        // Nothing needs to be done here. Proceed to step 6.
    } else if ((subset === SearchArgumentData_subset_baseObject) || entryOnly) {
        if (
            (target.dse.subentry && subentries)
            || (!target.dse.subentry && !subentries)
        ) {
            // Entry ACI is checked above.
            const match = evaluateFilter(filter, entryInfo, filterOptions);
            if (match) {
                if (ret.skipsRemaining > 0) {
                    ret.skipsRemaining--;
                    return;
                }
                const einfo = await readEntryInformation(
                    ctx,
                    target,
                    data.selection,
                    relevantSubentries,
                    data.operationContexts,
                );
                const [ incompleteEntry, permittedEinfo ] = filterUnauthorizedEntryInformation(einfo);
                ret.results.push(new EntryInformation(
                    {
                        rdnSequence: targetDN,
                    },
                    Boolean(target.dse.shadow),
                    permittedEinfo,
                    incompleteEntry, // Technically, you need DiscloseOnError permission to see this, but this is fine.
                    undefined, // TODO: Review, but I think this will always be false.
                    undefined,
                ));
                if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                    hierarchySelectionProcedure(
                        ctx,
                        data.hierarchySelections,
                        data.serviceControls?.serviceType,
                    );
                }
            }
            return;
        }
    } else if (!entryOnly) /* if ((subset === SearchArgumentData_subset_wholeSubtree) && !entryOnly) */ { // Condition is implied.
        if (
            (target.dse.subentry && subentries)
            || (!target.dse.subentry && !subentries)
        ) {
            // Entry ACI is checked above.
            const match = evaluateFilter(filter, entryInfo, filterOptions);
            if (match) {
                if (ret.skipsRemaining > 0) {
                    ret.skipsRemaining--;
                } else {
                    const einfo = await readEntryInformation(
                        ctx,
                        target,
                        data.selection,
                        relevantSubentries,
                        data.operationContexts,
                    );
                    const [ incompleteEntry, permittedEinfo ] = filterUnauthorizedEntryInformation(einfo);
                    ret.results.push(new EntryInformation(
                        {
                            rdnSequence: targetDN,
                        },
                        Boolean(target.dse.shadow),
                        permittedEinfo,
                        incompleteEntry, // Technically, you need DiscloseOnError permission to see this, but this is fine.
                        undefined, // TODO: Review, but I think this will always be false.
                        undefined,
                    ));
                    if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                        hierarchySelectionProcedure(
                            ctx,
                            data.hierarchySelections,
                            data.serviceControls?.serviceType,
                        );
                    }
                }
            }
        }
    }

    // Step 6.
    if (target.dse.nssr) {
        // Almost copied entirely from list_i().
        const cr = new ContinuationReference(
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
        );
        state.SRcontinuationList.push(cr);
    }

    const useSortedSearch: boolean = Boolean(pagingRequest?.sortKeys?.length);
    let cursorId: number | undefined;
    const getNextBatchOfSubordinates = async (): Promise<Vertex[]> => {
        return useSortedSearch
            ? await (async () => {
                const results: Vertex[] = [];
                const newCursorId = await readChildrenSorted(
                    ctx,
                    target,
                    pagingRequest!.sortKeys![0].type_,
                    results,
                    pagingRequest?.reverse ?? PagedResultsRequest_newRequest._default_value_for_reverse,
                    pageSize,
                    undefined,
                    cursorId,
                );
                cursorId = newCursorId;
                return results;
            })()
            : await readChildren(
                ctx,
                target,
                pageSize,
                undefined,
                cursorId,
                {
                    subentry: subentries,
                },
            );
    };
    let subordinatesInBatch = await getNextBatchOfSubordinates();
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
            if (!useSortedSearch) {
                cursorId = subordinate.dse.id;
            }
            if (subentries && !subordinate.dse.subentry) {
                continue;
            }
            if (subordinate.dse.subr && !subordinate.dse.cp) {
                const cr = new ContinuationReference(
                    {
                        // REVIEW: The documentation says use the DN of e, but I am pretty sure they mean e'.
                        // rdnSequence: [ ...targetDN, subordinate.dse.rdn ],
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
                );
                state.SRcontinuationList.push(cr);
            }
            const newChainingArguments: ChainingArguments = (subset === SearchArgumentData_subset_oneLevel)
                ? cloneChainingArguments(state.chainingArguments, {
                    entryOnly: TRUE,
                })
                : state.chainingArguments;
            await search_i(
                ctx,
                conn,
                {
                    ...state,
                    chainingArguments: newChainingArguments,
                    foundDSE: subordinate,
                }, // TODO: Are you sure you can always pass in the same admPoints?
                argument,
                ret,
            );
        }
        if (limitExceeded !== undefined) {
            break;
        }
        subordinatesInBatch = await getNextBatchOfSubordinates();
    }

    if (queryReference && pagingRequest) {
        conn.pagedResultsRequests.set(queryReference, {
            request: pagingRequest,
            pageIndex: page + 1,
            cursorId,
        });
    }
}

export default search_i;

import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { Context, DIT, Vertex, ClientAssociation, MistypedArgumentError } from "@wildboar/meerkat-types";
import {
    AccessPointInformation,
    ContinuationReference, OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    OperationProgress_nameResolutionPhase_notStarted,
    OperationProgress_nameResolutionPhase_completed,
    OperationProgress_nameResolutionPhase_proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
    // ServiceControlOptions_subentries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ReferenceType,
    ReferenceType_supplier,
    ReferenceType_master,
    ReferenceType_subordinate,
    ReferenceType_immediateSuperior,
    ReferenceType_cross,
    ReferenceType_superior,
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_ditBridge,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import { TRUE_BIT, TRUE, FALSE, ObjectIdentifier, OBJECT_IDENTIFIER, BERElement, ASN1Construction } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_loopDetected,
    ServiceProblem_unableToProceed,
    ServiceProblem_invalidReference,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    NameProblem_aliasProblem,
    NameProblem_aliasDereferencingProblem,
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { strict as assert } from "assert";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    id_opcode_list,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import {
    id_opcode_search,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import cloneChainingArgs from "../x500/cloneChainingArguments";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import listSubordinates from "../dit/listSubordinates";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import getVertexById from "../database/getVertexById";
import { printInvokeId } from "../utils/printInvokeId";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import {
    CommonArguments,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CommonArguments.ta";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import DSPAssociation from "../dsp/DSPConnection";
import { differenceInSeconds } from "date-fns";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { Prisma } from "@prisma/client";
import getEqualityNormalizer from "../x500/getEqualityNormalizer";
import { isModificationOperation } from "@wildboar/x500";
import { EXT_BIT_USE_ALIAS_ON_UPDATE } from "@wildboar/x500/src/lib/dap/extensions";

const autonomousArea: string = id_ar_autonomousArea.toString();

const MAX_DEPTH: number = 10000;

/**
 * @summary Determine whether some subordinates of a DSE are context prefixes
 * @description
 *
 * This function determines if any subordinate of a DSE is a context prefix.
 *
 * @param ctx The context object
 * @param vertex The vertex whose subordinates are inquired
 * @returns A `boolean` indicating whether at least one subordinate of `vertex`
 *  is a context prefix.
 *
 * @function
 */
async function someSubordinatesAreCP(
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> {
    return Boolean(await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: vertex.dse.id,
            cp: true,
            ...getEntryExistsFilter(),
        },
        select: {
            // Select statements cannot be null in Prisma, so we just select
            // something so we can ignore it.
            id: true,
        },
    }));
}

/**
 * @summary Create a continuation reference from shadow supplier knowledge
 * @description
 *
 * This function creates a `ContinuationReference` to continue the operation in
 * the shadow supplier (meaning, the DSA that gave this DSA the replicated
 * entries that are in this context prefix).
 *
 * @param cp The context prefix of the shadowed area
 * @param needleDN The target distinguished name
 * @param nextRDNToBeResolved The next RDN to be resolved
 * @param rdnsResolved The number of RDNs resolved already
 * @returns A `ContinuationReference` that will continue the operation in the
 *  shadow supplier.
 *
 * @function
 */
function makeContinuationRefFromSupplierKnowledge(
    cp: Vertex,
    needleDN: DistinguishedName,
    nextRDNToBeResolved: number | undefined,
    rdnsResolved?: number,
): ContinuationReference {
    assert(cp.dse.cp);
    assert(cp.dse.cp.supplierKnowledge?.[0]);
    return new ContinuationReference(
        {
            rdnSequence: needleDN,
        },
        undefined,
        new OperationProgress(
            OperationProgress_nameResolutionPhase_proceeding,
            nextRDNToBeResolved,
        ),
        rdnsResolved,
        ReferenceType_supplier,
        [ // Only more than one API may be present if this is for an NSSR.
            new AccessPointInformation(
                cp.dse.cp.supplierKnowledge[0].ae_title,
                cp.dse.cp.supplierKnowledge[0].address,
                cp.dse.cp.supplierKnowledge[0].protocolInformation,
                cp.dse.cp.supplierKnowledge[0].supplier_is_master
                    ? MasterOrShadowAccessPoint_category_master
                    : MasterOrShadowAccessPoint_category_shadow,
                undefined,
                cp.dse.cp.supplierKnowledge
                    .slice(1)
                    .map((sk) => new MasterOrShadowAccessPoint(
                        sk.ae_title,
                        sk.address,
                        sk.protocolInformation,
                        sk.supplier_is_master
                            ? MasterOrShadowAccessPoint_category_master
                            : MasterOrShadowAccessPoint_category_shadow,
                        undefined,
                    )),
            ),
        ],
        false,
        undefined,
        false,
        false,
    );
}

/**
 * @summary The Find DSE procedure defined in ITU Recommendation X.518.
 * @description
 *
 * The Find DSE procedure defined in ITU Recommendation X.518 (2016), Section
 * 18.2.
 *
 * Note that functions internal to this function are named after nodes in the
 * diagrams in ITU Recommendation X.518 (2016), Sections 18.3.1, 18.3.2, and
 * 18.3.3.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param haystackVertex The root of the DIT
 * @param needleDN The distinguished name of the sought-after DSE
 * @param state The operation dispatcher state
 * @param common The common arguments, if applicable
 *
 * @function
 * @async
 */
export
    async function findDSE(
        ctx: Context,
        assn: ClientAssociation | undefined,
        haystackVertex: DIT,
        needleDN: DistinguishedName, // N
        state: OperationDispatcherState,
        common?: CommonArguments,
    ): Promise<void> {
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:time_limit"),
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
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
    };
    /**
     * This procedural deviation is needed. Without it, the subordinates of the
     * root DSE will be searched for an entry with a zero-length RDN!
     */
    if (needleDN.length === 0) {
        state.entrySuitable = true;
        state.foundDSE = ctx.dit.root;
        return;
    }
    let i: number = 0;
    let dse_i: Vertex = haystackVertex;
    let nssrEncountered: boolean = false;
    const m: number = needleDN.length;
    let lastEntryFound: number = 0; // The last RDN whose DSE was of type entry.
    let dse_lastEntryFound: Vertex | undefined = undefined;
    let lastCP: Vertex | undefined;
    const candidateRefs: ContinuationReference[] = [];
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
        : undefined;
    const criticalExtensions = common?.criticalExtensions;
    const serviceControlOptions = common?.serviceControls?.options;
    const manageDSAITPlaneRefElement = common?.serviceControls?.manageDSAITPlaneRef;
    const errorProtection = common?.securityParameters?.errorProtection;
    const signErrors: boolean = (
        (errorProtection === ErrorProtectionRequest_signed)
        && (!assn || (assn.authorizedForSignedErrors))
    );

    // Service controls
    const manageDSAIT: boolean = (
        serviceControlOptions?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
    const partialNameResolution: boolean = (
        serviceControlOptions?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT);
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    // const subentries: boolean = (
    //     serviceControlOptions?.bitString?.[ServiceControlOptions_subentries] === TRUE_BIT);

    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const NORMALIZER_GETTER = getEqualityNormalizer(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const requestor: DistinguishedName | undefined = state.chainingArguments.originator
        ?? assn?.boundNameAndUID?.dn;
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;

    const node_candidateRefs_empty_2 = async (): Promise<void> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // DEVIATION: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
        } else {
            await candidateRefsEmpty_yes_branch();
        }
    };

    const node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false = async (): Promise<void> => {
        if (dse_i.dse.shadow?.subordinateCompleteness === false) {
            if (!lastCP) {
                ctx.log.warn(ctx.i18n.t("log:shadow_not_under_cp", {
                    id: dse_i.dse.uuid,
                }), {
                    remoteFamily: assn?.socket.remoteFamily,
                    remoteAddress: assn?.socket.remoteAddress,
                    remotePort: assn?.socket.remotePort,
                    association_id: assn?.id,
                    invokeID: printInvokeId(state.invokeId),
                });
                return undefined;
            }
            const cr = makeContinuationRefFromSupplierKnowledge(
                lastCP,
                needleDN,
                lastEntryFound,
                state.rdnsResolved,
            );
            candidateRefs.push(cr);
            state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                operationProgress: new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    lastEntryFound,
                ),
                referenceType: ReferenceType_supplier,
            });
            return; // Entry unsuitable.
        }
        if (dse_lastEntryFound?.dse.nssr) {
            const cr = new ContinuationReference(
                {
                    rdnSequence: needleDN,
                },
                undefined,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    lastEntryFound + 1,
                ),
                undefined,
                ReferenceType_nonSpecificSubordinate,
                dse_lastEntryFound?.dse.nssr.nonSpecificKnowledge
                    .map((nsk) => {
                        const [masters, shadows] = splitIntoMastersAndShadows(nsk);
                        const recommendedAP = shadows[0] ?? masters[0];
                        if (!recommendedAP) {
                            return undefined;
                        }
                        return new AccessPointInformation(
                            recommendedAP.ae_title,
                            recommendedAP.address,
                            recommendedAP.protocolInformation,
                            recommendedAP.category,
                            recommendedAP.chainingRequired,
                            [...shadows.slice(1), ...masters.slice(1)],
                        );
                    })
                    .filter((ap): ap is AccessPointInformation => !!ap),
                undefined,
                undefined,
                false,
                false,
            );
            candidateRefs.push(cr);
            // DEVIATION: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
            return; // entry unsuitable.
        }
        await node_candidateRefs_empty_2();
    };

    const candidateRefsEmpty_yes_branch = async (): Promise<void> => {
        if (partialNameResolution === FALSE) {
            throw new errors.NameError(
                ctx.i18n.t("err:entry_not_found"),
                new NameErrorData(
                    NameProblem_noSuchObject,
                    {
                        rdnSequence: needleDN.slice(0, i),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        nameError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else {
            state.entrySuitable = true;
            state.foundDSE = dse_i;
            state.partialName = true;
            state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                operationProgress: new OperationProgress(
                    OperationProgress_nameResolutionPhase_completed,
                    undefined,
                ),
            });
        }
    };

    const candidateRefsEmpty1_Branch = async (): Promise<void> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // DEVIATION: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
        } else {
            await candidateRefsEmpty_yes_branch();
        }
    };

    const targetNotFoundSubprocedure_notStarted_branch = async (): Promise<void> => {
        if (lastEntryFound === 0) { // Target Not Found, Step 3.
            if (ctx.dit.root.dse.supr) { // If this is NOT a first-level DSA.
                const superior = ctx.dit.root.dse.supr.superiorKnowledge[0];
                assert(superior);
                const cr = new ContinuationReference(
                    {
                        rdnSequence: needleDN,
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_notStarted,
                        undefined,
                    ),
                    undefined,
                    ReferenceType_superior,
                    [
                        new AccessPointInformation(
                            superior.ae_title,
                            superior.address,
                            superior.protocolInformation,
                            undefined,
                            undefined,
                            ctx.dit.root.dse.supr.superiorKnowledge
                                .slice(1)
                                .map((sk) => new MasterOrShadowAccessPoint(
                                    sk.ae_title,
                                    sk.address,
                                    sk.protocolInformation,
                                )),
                        ),
                    ],
                    undefined,
                    undefined,
                    undefined, // Return to DUA not supported.
                    undefined,
                );
                candidateRefs.push(cr);
                await candidateRefsEmpty1_Branch();
                return;
            } else { // Root DSE is not of type subr (meaning that this IS a first-level DSA.)
                // Target Not Found, Step 4.
                if (m === 0) { // ...and the operation was directed at the root DSE.
                    // Target Not Found, Step 5.
                    if (
                        compareCode(state.operationCode, list["&operationCode"]!)
                        || compareCode(state.operationCode, search["&operationCode"]!)
                    ) {
                        state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                            operationProgress: new OperationProgress(
                                OperationProgress_nameResolutionPhase_completed,
                                undefined,
                            ),
                        });
                        state.entrySuitable = true;
                        state.foundDSE = dse_i;
                        return;
                    } else {
                        throw new errors.NameError(
                            ctx.i18n.t("err:can_only_list_or_search_root"),
                            new NameErrorData(
                                NameProblem_noSuchObject,
                                {
                                    rdnSequence: [],
                                },
                                [],
                                createSecurityParameters(
                                    ctx,
                                    signErrors,
                                    assn?.boundNameAndUID?.dn,
                                    undefined,
                                    nameError["&errorCode"],
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                state.chainingArguments.aliasDereferenced,
                                undefined,
                            ),
                            signErrors,
                        );
                    }
                } else { // m !== 0
                    // Target Not Found, Step 4 (continued).
                    // In a first-level DSA, the root DSE should have an NSSR.
                    // Basically, a root DSE will always have a type of either subr or nssr.
                    (ctx.dit.root.dse.nssr?.nonSpecificKnowledge ?? []).forEach((knowledge): void => {
                        const [masters, shadows] = splitIntoMastersAndShadows(knowledge);
                        const recommendedAP = shadows[0] ?? masters[0];
                        if (!recommendedAP) {
                            return;
                        }
                        const cr = new ContinuationReference(
                            {
                                rdnSequence: needleDN,
                            },
                            undefined,
                            new OperationProgress(
                                OperationProgress_nameResolutionPhase_proceeding,
                                1,
                            ),
                            undefined,
                            ReferenceType_nonSpecificSubordinate,
                            [
                                new AccessPointInformation(
                                    recommendedAP.ae_title,
                                    recommendedAP.address,
                                    recommendedAP.protocolInformation,
                                    recommendedAP.category,
                                    recommendedAP.chainingRequired,
                                    [...shadows.slice(1), ...masters.slice(1)],
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            nssrEncountered,
                        );
                        candidateRefs.push(cr);
                    });
                    await candidateRefsEmpty1_Branch();
                    return;
                }
            }
        } else { // Last entry found !== 0
            state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                operationProgress: new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    state.chainingArguments.operationProgress?.nextRDNToBeResolved,
                ),
            });
            await node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false();
            return;
        }
    };

    const targetNotFoundSubprocedure = async (): Promise<void> => {
        const nameResolutionPhase = state.chainingArguments.operationProgress?.nameResolutionPhase
            ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
        switch (nameResolutionPhase) {
            case (OperationProgress_nameResolutionPhase_notStarted): {
                await targetNotFoundSubprocedure_notStarted_branch();
                return;
            }
            case (OperationProgress_nameResolutionPhase_proceeding): {
                const nextRDNToBeResolved = state.chainingArguments.operationProgress?.nextRDNToBeResolved;
                if (lastEntryFound >= (nextRDNToBeResolved ?? 0)) {
                    await node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false();
                    return;
                }
                if (
                    (state.chainingArguments.referenceType === ReferenceType_nonSpecificSubordinate)
                    && (nextRDNToBeResolved === (i + 1))
                ) {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:unable_to_proceed"),
                        new ServiceErrorData(
                            ServiceProblem_unableToProceed,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn?.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                } else {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:invalid_reference"),
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn?.boundNameAndUID?.dn,
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
            case (OperationProgress_nameResolutionPhase_completed): {
                /**
                 * Hello, this Dr. Steve Brule, president and CEO of Pfizer, and
                 * founder of "Brules Rules," the #1 media syndicate for life
                 * advice, leaving a comment in your code to help you develop
                 * and use Meerkat DSA.
                 *
                 * If you're wondering why you're seeing this error, it
                 * might be because you've set the manageDSAIT flag in your
                 * request. Doing so sets the name resolution phase to
                 * completed, which effectively makes it looks like your
                 * request came from another DSA. Sorry for the deceptive error,
                 * but this is required by the X.500 specifications.
                 */
                throw new errors.ServiceError(
                    // REVIEW: I am not really sure about this error message.
                    ctx.i18n.t("err:invalid_reference_no_reason_to_search_here"),
                    new ServiceErrorData(
                        ServiceProblem_invalidReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn?.boundNameAndUID?.dn,
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
            default: {
                ctx.log.error(ctx.i18n.t("log:operation_progress_not_understood", {
                    value: nameResolutionPhase,
                    cid: assn?.id ?? "INTERNAL",
                }), {
                    remoteFamily: assn?.socket.remoteFamily,
                    remoteAddress: assn?.socket.remoteAddress,
                    remotePort: assn?.socket.remotePort,
                    association_id: assn?.id,
                    invokeID: printInvokeId(state.invokeId),
                });
                throw new MistypedArgumentError();
            }
        }
    };

    const targetFoundSubprocedure = async (): Promise<Vertex | undefined> => {
        const suitable: boolean = await checkSuitabilityProcedure(
            ctx,
            assn,
            dse_i,
            state.operationCode,
            state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
            criticalExtensions ?? new Uint8ClampedArray(),
            dontUseCopy,
            copyShallDo,
            state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
            state.operationArgument,
            undefined,
            signErrors,
        );
        if (suitable) {
            state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                operationProgress: new OperationProgress(
                    OperationProgress_nameResolutionPhase_completed,
                    undefined,
                ),
            });
            state.entrySuitable = true;
            state.foundDSE = dse_i;
            return dse_i;
        } else {
            state.chainingArguments = cloneChainingArgs(state.chainingArguments, {
                operationProgress: new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    m,
                ),
            });
            assert(lastCP);
            const nextRDNToBeResolved = state.chainingArguments.operationProgress?.nextRDNToBeResolved;
            const cr = makeContinuationRefFromSupplierKnowledge(
                lastCP,
                needleDN,
                nextRDNToBeResolved !== undefined
                    ? Number(nextRDNToBeResolved)
                    : undefined,
                state.rdnsResolved,
            );
            candidateRefs.push(cr);
            return undefined;
        }
    };

    let accessControlScheme: OBJECT_IDENTIFIER | undefined;
    let iterations: number = 0;
    while (iterations < MAX_DEPTH) {
        iterations++;
        if (i === m) {
            const nameResolutionPhase = state.chainingArguments.operationProgress?.nameResolutionPhase
                ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
            // I pretty much don't understand this entire section.
            if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                await targetNotFoundSubprocedure();
                return;
            }
            if (manageDSAITPlaneRefElement || manageDSAIT) {
                state.foundDSE = dse_i;
                state.entrySuitable = true;
                return;
            }
            // This is present in the diagram, but not the text.
            // if (
            //     (state.chainingArguments.referenceType === ReferenceType_supplier)
            //     || (state.chainingArguments.referenceType === ReferenceType_master)
            // ) {
            //     return targetNotFoundSubprocedure();
            // }
            // I don't understand why we do this.
            // Name resolution phase MUST be completed at this point.
            if (
                !compareCode(state.operationCode, id_opcode_list)
                && !compareCode(state.operationCode, id_opcode_search)
            ) {
                state.foundDSE = dse_i;
                state.entrySuitable = true;
                return;
            }
            if (!await someSubordinatesAreCP(ctx, dse_i)) {
                await targetNotFoundSubprocedure();
            }
            state.foundDSE = dse_i;
            state.entrySuitable = true;
            return;
        }
        const needleRDN = needleDN[i];
        let rdnMatched: boolean = false;
        accessControlScheme = (dse_i.dse.admPoint
            ? [...state.admPoints, dse_i]
            : [...state.admPoints])
            .reverse()
            .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        let cursorId: number | undefined;
        /**
         * This is where we use the cached most recent vertex, if it is a prefix of
         * the target object. This is not part of the ITU specifications: just an
         * optimization used by Meerkat DSA.
         */
        if (assn?.mostRecentVertex) {
            const since = assn.mostRecentVertex.since;
            const now = new Date();
            const timeLived = Math.abs(differenceInSeconds(since, now));
            if (timeLived < ctx.config.mostRecentVertexTTL) {
                const mostRecentVertex = assn.mostRecentVertex.path[i];
                if (mostRecentVertex) {
                    rdnMatched = compareRDN(
                        needleRDN,
                        mostRecentVertex.dse.rdn,
                        NAMING_MATCHER,
                    );
                    if (rdnMatched) {
                        i++;
                        dse_i = mostRecentVertex;
                        state.rdnsResolved++;
                        // If we are performing an operation that could invalidate the
                        // entry cache, we need to clear it.
                        // This is critical if you delete an entry, then recreate it.
                        // The cached one will have the database ID of the old one.
                        if (
                            compareCode(state.operationCode, removeEntry["&operationCode"]!)
                            || compareCode(state.operationCode, modifyDN["&operationCode"]!)
                        ) {
                            assn.mostRecentVertex = undefined;
                        }
                    }
                } else {
                    assn.mostRecentVertex = undefined;
                }
            } else {
                assn.mostRecentVertex = undefined;
            }
        }
        /**
         * What follows in this if statement is an optimization to make Find DSE
         * run in O(1) time. If the RDN can be normalized to a string, this
         * string is compared byte-for-byte, if not, we at least attempt to find
         * the entry by searching byte-for-byte.
         */
        if (
            !rdnMatched
            && (
                !dse_i.subordinates
                || (dse_i.subordinates.length > ctx.config.useDatabaseWhenThereAreXSubordinates)
            )
        ) {
            let use_normalized_rdn_search: boolean = true;
            const atav_strs: [type: OBJECT_IDENTIFIER, value: string][] = [];
            for (const atav of needleRDN) {
                const normalized_value: string | undefined = NORMALIZER_GETTER(atav.type_)?.(ctx, atav.value);
                if (!normalized_value) {
                    use_normalized_rdn_search = false;
                    break;
                }
                atav_strs.push([ atav.type_, normalized_value ]);
            }

            const match = await ctx.db.entry.findFirst({
                where: {
                    AND: [
                        {
                            immediate_superior_id: dse_i.dse.id,
                            ...getEntryExistsFilter(),
                        },
                        ...(use_normalized_rdn_search
                            ? atav_strs.map(([ type_, str ]): Prisma.EntryWhereInput => ({
                                RDN: {
                                    some: {
                                        type_oid: type_.toBytes(),
                                        normalized_str: str,
                                    },
                                },
                            }))
                            : needleRDN.map((atav) => ({
                                RDN: {
                                    some: {
                                        type_oid: atav.type_.toBytes(),
                                        tag_class: atav.value.tagClass,
                                        constructed: (atav.value.construction === ASN1Construction.constructed),
                                        tag_number: atav.value.tagNumber,
                                        content_octets: Buffer.from(
                                            atav.value.value.buffer,
                                            atav.value.value.byteOffset,
                                            atav.value.value.byteLength,
                                        ),
                                    },
                                },
                            }))),
                    ],
                },
                include: {
                    RDN: {
                        select: {
                            type_oid: true,
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                        orderBy: { // So the RDNs appear in the order in which they were entered.
                            // This prevents an undesirable scenario where some users might show
                            // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
                            order_index: "asc",
                        },
                    },
                    EntryObjectClass: {
                        select: {
                            object_class: true,
                        },
                    },
                },
            });

            /**
             * We have to check that the number of distinguished values in the
             * entry found matches the number of RDNs we have sought, otherwise
             * this short-circuit optimization could return a result for, say,
             * SN=Wilbur, when we are actually searching for SN=Wilbur+GN=Jonathan.
             *
             * When/if Prisma implements relational counts, we will be able to
             * remove this check.
             *
             * See: https://github.com/prisma/prisma/issues/8935
             */
            if (match && (match.RDN.length === needleRDN.length)) {
                const matchedVertex = await vertexFromDatabaseEntry(ctx, dse_i, match);
                if (matchedVertex.dse.admPoint?.accessControlScheme) {
                    accessControlScheme = matchedVertex.dse.admPoint.accessControlScheme;
                }
                if (
                    !ctx.config.bulkInsertMode
                    && accessControlScheme
                    && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
                ) {
                    const childDN = getDistinguishedName(matchedVertex);
                    // Without this, all first-level DSEs are discoverable.
                    const relevantAdmPoints: Vertex[] = matchedVertex.dse.admPoint
                        ? [...state.admPoints, matchedVertex]
                        : [...state.admPoints];
                    const relevantSubentries: Vertex[] = (await Promise.all(
                        relevantAdmPoints.map((ap) => getRelevantSubentries(ctx, matchedVertex, childDN, ap)),
                    )).flat();
                    const targetACI = await getACIItems(
                        ctx,
                        accessControlScheme,
                        matchedVertex.immediateSuperior,
                        matchedVertex,
                        relevantSubentries,
                        Boolean(matchedVertex.dse.subentry),
                    );
                    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
                    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                        accessControlScheme,
                        acdfTuples,
                        user,
                        state.chainingArguments.authenticationLevel
                        ?? assn?.authLevel
                        ?? UNTRUSTED_REQ_AUTH_LEVEL,
                        childDN,
                        isMemberOfGroup,
                        NAMING_MATCHER,
                    );
                    const objectClasses = Array
                        .from(matchedVertex.dse.objectClass)
                        .map(ObjectIdentifier.fromString);
                    const { authorized: authorizedToDiscover } = bacACDF(
                        relevantTuples,
                        user,
                        { entry: objectClasses },
                        [
                            PERMISSION_CATEGORY_BROWSE,
                            PERMISSION_CATEGORY_RETURN_DN,
                        ],
                        bacSettings,
                        true,
                    );
                    if (!authorizedToDiscover) {
                        const { authorized: authorizedToDiscoverOnError } = bacACDF(
                            relevantTuples,
                            user,
                            { entry: objectClasses },
                            [PERMISSION_CATEGORY_DISCLOSE_ON_ERROR],
                            bacSettings,
                            true,
                        );
                        if (authorizedToDiscoverOnError) {
                            throw new errors.SecurityError(
                                ctx.i18n.t("err:not_authz_browse"),
                                new SecurityErrorData(
                                    SecurityProblem_insufficientAccessRights,
                                    undefined,
                                    undefined,
                                    [],
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
                        await targetNotFoundSubprocedure();
                        return;
                    }
                }
                i++;
                rdnMatched = true;
                dse_i = matchedVertex;
                state.rdnsResolved++;
            }
            // If we used the normalized RDN search and there was no match, we
            // can conclude that this entry does not exist. There is no point
            // in proceeding further.
            if (use_normalized_rdn_search && !rdnMatched) {
                await targetNotFoundSubprocedure();
                return;
            }
        }
        const getNextBatchOfSubordinates = async () => {
            if (rdnMatched) {
                return [];
            }
            return listSubordinates(
                ctx,
                dse_i.dse.id,
                ctx.config.entriesPerSubordinatesPage,
                undefined,
                cursorId,
                {
                    AND: needleRDN.map((atav) => ({
                        RDN: {
                            some: {
                                type_oid: atav.type_.toBytes(),
                            },
                        },
                    })),
                },
            );
        };
        let subordinatesInBatch = await getNextBatchOfSubordinates();
        while (!rdnMatched && subordinatesInBatch.length) {
            for (const subordinate of subordinatesInBatch) {
                cursorId = subordinate.id;
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
                                assn?.boundNameAndUID?.dn,
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
                checkTimeLimit();
                const childRDN = subordinate.RDN.map((atav) => {
                    const type_el = new BERElement();
                    const value_el = new BERElement();
                    type_el.value = atav.type_oid;
                    value_el.tagClass = atav.tag_class;
                    value_el.construction = atav.constructed
                        ? ASN1Construction.constructed
                        : ASN1Construction.primitive;
                    value_el.tagNumber = atav.tag_number;
                    value_el.value = atav.content_octets;
                    return new AttributeTypeAndValue(
                        type_el.objectIdentifier,
                        value_el,
                    );
                });
                rdnMatched = compareRDN(
                    needleRDN,
                    childRDN,
                    getNamingMatcherGetter(ctx),
                );
                if (rdnMatched) {
                    const child = await getVertexById(ctx, dse_i, subordinate.id);
                    if (!child) {
                        return; // The entry was deleted right after we matched.
                    }
                    if (child.dse.admPoint?.accessControlScheme) {
                        accessControlScheme = child.dse.admPoint.accessControlScheme;
                    }
                    if ( // Check if the user can actually access it.
                        !ctx.config.bulkInsertMode
                        && accessControlScheme
                        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
                    ) {
                        const childDN = getDistinguishedName(child);
                        // Without this, all first-level DSEs are discoverable.
                        const relevantAdmPoints: Vertex[] = child.dse.admPoint
                            ? [...state.admPoints, child]
                            : [...state.admPoints];
                        const relevantSubentries: Vertex[] = (await Promise.all(
                            relevantAdmPoints.map((ap) => getRelevantSubentries(ctx, child, childDN, ap)),
                        )).flat();
                        const targetACI = await getACIItems(
                            ctx,
                            accessControlScheme,
                            dse_i,
                            child,
                            relevantSubentries,
                            Boolean(child.dse.subentry),
                        );
                        const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
                        const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                            accessControlScheme,
                            acdfTuples,
                            user,
                            state.chainingArguments.authenticationLevel
                            ?? assn?.authLevel
                            ?? UNTRUSTED_REQ_AUTH_LEVEL,
                            childDN,
                            isMemberOfGroup,
                            NAMING_MATCHER,
                        );
                        const objectClasses = Array.from(child.dse.objectClass).map(ObjectIdentifier.fromString);
                        /**
                         * We ignore entries for which browse and returnDN permissions
                         * are not granted. This is not specified in the Find DSE
                         * procedure, but it is important for preventing information
                         * disclosure vulnerabilities.
                         */
                        const { authorized: authorizedToDiscover } = bacACDF(
                            relevantTuples,
                            user,
                            { entry: objectClasses },
                            [
                                PERMISSION_CATEGORY_BROWSE,
                                PERMISSION_CATEGORY_RETURN_DN,
                            ],
                            bacSettings,
                            true,
                        );

                        if (!authorizedToDiscover) {
                            const { authorized: authorizedToDiscoverOnError } = bacACDF(
                                relevantTuples,
                                user,
                                { entry: objectClasses },
                                [PERMISSION_CATEGORY_DISCLOSE_ON_ERROR],
                                bacSettings,
                                true,
                            );
                            if (authorizedToDiscoverOnError) {
                                throw new errors.SecurityError(
                                    ctx.i18n.t("err:not_authz_browse"),
                                    new SecurityErrorData(
                                        SecurityProblem_insufficientAccessRights,
                                        undefined,
                                        undefined,
                                        [],
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
                            throw new errors.NameError(
                                ctx.i18n.t("err:entry_not_found"),
                                new NameErrorData(
                                    NameProblem_noSuchObject,
                                    {
                                        rdnSequence: childDN,
                                    },
                                    [],
                                    createSecurityParameters(
                                        ctx,
                                        signErrors,
                                        assn?.boundNameAndUID?.dn,
                                        undefined,
                                        nameError["&errorCode"],
                                    ),
                                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                                    state.chainingArguments.aliasDereferenced,
                                    undefined,
                                ),
                                signErrors,
                            );
                        }
                    }
                    i++;
                    dse_i = child;
                    state.rdnsResolved++;
                    break;
                }
            }
            subordinatesInBatch = await getNextBatchOfSubordinates();
        }
        if (!rdnMatched) {
            await targetNotFoundSubprocedure();
            return;
        }

        let discloseOnError: boolean = true;
        if (
            !ctx.config.bulkInsertMode
            && accessControlScheme
            && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
        ) {
            const currentDN = getDistinguishedName(dse_i);
            const relevantSubentries: Vertex[] = (await Promise.all(
                state.admPoints.map((ap) => getRelevantSubentries(ctx, dse_i, currentDN, ap)),
            )).flat();
            const targetACI = await getACIItems(
                ctx,
                accessControlScheme,
                dse_i.immediateSuperior,
                dse_i,
                relevantSubentries,
                Boolean(dse_i.dse.subentry),
            );
            const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                state.chainingArguments.authenticationLevel
                ?? assn?.authLevel
                ?? UNTRUSTED_REQ_AUTH_LEVEL,
                currentDN,
                isMemberOfGroup,
                NAMING_MATCHER,
            );
            const { authorized: authorizedToDiscloseOnError } = bacACDF(
                relevantTuples,
                user,
                {
                    entry: Array
                        .from(dse_i.dse.objectClass)
                        .map(ObjectIdentifier.fromString),
                },
                [
                    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
                ],
                bacSettings,
                true,
            );
            discloseOnError = authorizedToDiscloseOnError;
        }

        /**
         * This is not explicitly required by the specification, but it seems to
         * be implicitly required for the formation of continuation references.
         */
        if (dse_i.dse.nssr) {
            nssrEncountered = true;
        }
        const nextRDNToBeResolved = state.chainingArguments.operationProgress?.nextRDNToBeResolved;
        if (
            (i === nextRDNToBeResolved)
            // Is checking for shadow enough to determine if !master?
            || (state.chainingArguments.nameResolveOnMaster && dse_i.dse.shadow)
        ) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:could_not_resolve_name_on_master"),
                new ServiceErrorData(
                    ServiceProblem_unableToProceed,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
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
        /**
         * It is CRITICAL that the following `if` blocks appear in the order
         * described in step 7 of ITU Recommendation X.518 (2016), Section
         * 18.3.1.
         *
         * I discovered this because not doing so meant that administrative
         * points were counting themselves as relevant administrative points.
         */
        if (dse_i.dse.cp && dse_i.dse.shadow) {
            lastCP = dse_i;
        }
        if (dse_i.dse.admPoint) {
            /**
             * NOTE: You cannot remove "overridden" administrative points, such
             * as removing all previous access control inner areas when an
             * access control specific area is encountered, because
             * administrative points may have multiple administrative roles.
             *
             * Instead, the behavior of ignoring overridden administrative
             * points should be handled wherever they are actually used.
             */
            if (dse_i.dse.admPoint.administrativeRole.has(autonomousArea)) {
                state.admPoints.length = 0;
            }
            state.admPoints.push(dse_i);
        }
        if (
            dse_i.dse.subr
            || dse_i.dse.xr
            || dse_i.dse.immSupr
            || dse_i.dse.ditBridge
        ) {
            const knowledges = dse_i.dse.subr?.specificKnowledge
                ?? dse_i.dse.xr?.specificKnowledge
                ?? dse_i.dse.immSupr?.specificKnowledge
                ?? dse_i.dse.ditBridge?.ditBridgeKnowledge.flatMap((dbk) => dbk.accessPoints);
            const referenceType: ReferenceType = ((): ReferenceType => {
                if (dse_i.dse.subr) {
                    return ReferenceType_subordinate;
                }
                if (dse_i.dse.immSupr) {
                    return ReferenceType_immediateSuperior;
                }
                if (dse_i.dse.ditBridge) {
                    return ReferenceType_ditBridge;
                }
                return ReferenceType_cross;
            })();
            // TODO: splitIntoMastersAndShadows()
            const masters: MasterOrShadowAccessPoint[] = [];
            const shadows: MasterOrShadowAccessPoint[] = [];
            knowledges!.forEach((mosap) => {
                if (mosap.category === MasterOrShadowAccessPoint_category_master) {
                    masters.push(mosap);
                } else if (mosap.category === MasterOrShadowAccessPoint_category_shadow) {
                    shadows.push(mosap);
                }
            });
            const mainAP = masters.pop() ?? shadows.pop();
            if (!mainAP) {
                return;
            }
            const cr = new ContinuationReference(
                {
                    rdnSequence: needleDN,
                },
                undefined,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    i,
                ),
                i,
                referenceType,
                [
                    new AccessPointInformation(
                        mainAP.ae_title,
                        mainAP.address,
                        mainAP.protocolInformation,
                        mainAP.category,
                        mainAP.chainingRequired,
                        [...shadows, ...masters]
                            .map((ap) => new MasterOrShadowAccessPoint(
                                ap.ae_title,
                                ap.address,
                                ap.protocolInformation,
                                ap.category,
                                ap.chainingRequired,
                            )),
                    ),
                ],
                undefined,
                undefined,
                undefined, // Return to DUA not supported.
                nssrEncountered,
            );
            candidateRefs.push(cr);
        }
        if (dse_i.dse.entry) {
            if (i === m) {
                const nameResolutionPhase = state.chainingArguments.operationProgress?.nameResolutionPhase
                    ?? ChainingArguments._default_value_for_operationProgress.nameResolutionPhase;
                if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                    await targetFoundSubprocedure();
                    return;
                }
                if (manageDSAITPlaneRefElement || manageDSAIT) {
                    state.foundDSE = dse_i;
                    state.entrySuitable = true;
                    return;
                }
                if (
                    (state.chainingArguments.referenceType === ReferenceType_supplier)
                    || (state.chainingArguments.referenceType === ReferenceType_master)
                ) {
                    await targetFoundSubprocedure();
                    return;
                }
                if (
                    !compareCode(state.operationCode, id_opcode_list)
                    && !compareCode(state.operationCode, id_opcode_search)
                ) {
                    state.foundDSE = dse_i;
                    state.entrySuitable = true;
                    return;
                }
                if (!await someSubordinatesAreCP(ctx, dse_i)) {
                    throw new errors.ServiceError(
                        // REVIEW: I am not really sure about this error message.
                        ctx.i18n.t("err:invalid_reference_no_reason_to_search_here"),
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn?.boundNameAndUID?.dn,
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
                state.foundDSE = dse_i;
                state.entrySuitable = true;
                return;
            } else {
                lastEntryFound = i;
                dse_lastEntryFound = dse_i;
            }
        }
        if (dse_i.dse.subentry) {
            if (i === m) {
                await targetFoundSubprocedure();
                return;
            } else {
                throw new errors.NameError(
                    ctx.i18n.t("err:entry_not_found"),
                    new NameErrorData(
                        NameProblem_noSuchObject,
                        {
                            rdnSequence: getDistinguishedName(dse_i),
                        },
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn?.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        if (dse_i.dse.alias) {
            /**
             * This is not required by the specification explicitly. In fact,
             * the specification only mentions this in a diagram for alias
             * dereferencing on search, but not during the Find DSE procedure.
             *
             * This exists exclusively to protect against direct cyclical
             * aliases (e.g. A points to B, then B points to A). All other alias
             * loops are innately not a problem for the find DSE
             * algorithm, because it subtracts an RDN from the remaining DN to
             * find after each entry processed.
             */
            if (state.aliasesEncounteredById.has(dse_i.dse.id)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:loop_detected"),
                    new ServiceErrorData(
                        ServiceProblem_loopDetected,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            undefined,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        TRUE,
                        undefined,
                    ),
                    signErrors,
                );
            }
            state.aliasesEncounteredById.add(dse_i.dse.id);
            const useAliasOnUpdate = (common?.criticalExtensions?.[EXT_BIT_USE_ALIAS_ON_UPDATE - 1] === TRUE_BIT);
            if (dontDereferenceAliases || (isModificationOperation(state.operationCode) && !useAliasOnUpdate)) {
                if (i === m) {
                    await targetFoundSubprocedure();
                    return;
                } else {
                    throw new errors.NameError(
                        discloseOnError
                            ? ctx.i18n.t("err:reached_alias_above_target")
                            : ctx.i18n.t("err:entry_not_found"),
                        new NameErrorData(
                            discloseOnError
                                ? NameProblem_aliasDereferencingProblem
                                : NameProblem_noSuchObject,
                            {
                                rdnSequence: discloseOnError
                                    ? getDistinguishedName(dse_i)
                                    : getDistinguishedName(dse_i.immediateSuperior!),
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn?.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            } else {
                const newN = [
                    ...dse_i.dse.alias.aliasedEntryName,
                    ...needleDN.slice(i), // RDNs N(i + 1) to N(m)
                ];
                const newChaining: ChainingArguments = new ChainingArguments(
                    requestor,
                    newN,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_notStarted,
                        undefined,
                    ),
                    state.chainingArguments.traceInformation,
                    TRUE, // aliasDereferenced
                    undefined, // Specifically told not to set aliasedRDNs.
                    state.chainingArguments.returnCrossRefs,
                    state.chainingArguments.referenceType,
                    state.chainingArguments.info,
                    state.chainingArguments.timeLimit,
                    state.chainingArguments.securityParameters,
                    state.chainingArguments.entryOnly,
                    state.chainingArguments.uniqueIdentifier,
                    state.chainingArguments.authenticationLevel,
                    state.chainingArguments.exclusions,
                    state.chainingArguments.excludeShadows,
                    state.chainingArguments.nameResolveOnMaster,
                    state.chainingArguments.operationIdentifier,
                    state.chainingArguments.searchRuleId,
                    state.chainingArguments.chainedRelaxation,
                    state.chainingArguments.relatedEntry,
                    state.chainingArguments.dspPaging,
                    state.chainingArguments.excludeWriteableCopies,
                );
                state.chainingArguments = newChaining;
                const signDSPResult: boolean = (
                    (assn instanceof DSPAssociation) // The outer signature will only be used for DSP, not DAP.
                    && (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
                    && assn?.authorizedForSignedResults
                );
                const chainingResults = new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signDSPResult,
                        undefined,
                        state.operationCode,
                    ),
                    undefined,
                );
                const newState: OperationDispatcherState = {
                    ...state,
                    NRcontinuationList: [],
                    SRcontinuationList: [],
                    admPoints: [],
                    referralRequests: [],
                    emptyHierarchySelect: false,
                    chainingArguments: newChaining,
                    chainingResults,
                    foundDSE: ctx.dit.root,
                    entrySuitable: false,
                    partialName: false,
                    rdnsResolved: 0,
                };
                await findDSE(
                    ctx,
                    assn,
                    haystackVertex,
                    newN,
                    newState,
                    common,
                );
                if (!newState.entrySuitable) {
                    throw new errors.NameError(
                        ctx.i18n.t("err:alias_problem"),
                        new NameErrorData(
                            NameProblem_aliasProblem,
                            {
                                rdnSequence: getDistinguishedName(dse_i),
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn?.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                        signErrors,
                    );
                }
                Object.assign(state, newState);
                return;
            }
        }
    }
    throw new errors.ServiceError(
        ctx.i18n.t("err:loop_detected"),
        new ServiceErrorData(
            ServiceProblem_loopDetected,
            [],
            createSecurityParameters(
                ctx,
                signErrors,
                assn?.boundNameAndUID?.dn,
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

export default findDSE;

import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Vertex, ClientConnection } from "@wildboar/meerkat-types";
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
    OperationProgress_nameResolutionPhase,
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
    ServiceControlOptions_subentries,
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
import { TRUE_BIT, ASN1TagClass, TRUE, FALSE, ObjectIdentifier } from "asn1-ts";
import readChildren from "../dit/readChildren";
import * as errors from "@wildboar/meerkat-types";
import {
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_loopDetected,
    ServiceProblem_unableToProceed,
    ServiceProblem_invalidReference,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
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
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
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
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";

const autonomousArea: string = id_ar_autonomousArea.toString();

const MAX_DEPTH: number = 10000;

async function someSubordinatesAreCP (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> {
    return Boolean(await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: vertex.dse.id,
            cp: true,
            deleteTimestamp: null,
        },
        select: {
            // Select statements cannot be null in Prisma, so we just select
            // something so we can ignore it.
            id: true,
        },
    }));
}

function makeContinuationRefFromSupplierKnowledge (
    cp: Vertex,
    needleDN: DistinguishedName,
    nextRDNToBeResolved: number | undefined,
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
        undefined, // FIXME:
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
        false, // FIXME:
        undefined,
        false,
        false,
    );
}

export
async function findDSE (
    ctx: Context,
    conn: ClientConnection,
    haystackVertex: DIT,
    needleDN: DistinguishedName, // N
    state: OperationDispatcherState,
    // state.chainingArguments: ChainingArguments,
    // argument: ASN1Element,
    // operationType: Code,
    // NRcontinuationList: ContinuationReference[],
    // admPoints: Vertex[],
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
    let nameResolutionPhase: OperationProgress_nameResolutionPhase = state.chainingArguments
        .operationProgress?.nameResolutionPhase ?? OperationProgress_nameResolutionPhase_notStarted;
    let nextRDNToBeResolved: number = state.chainingArguments.operationProgress?.nextRDNToBeResolved ?? 0;
    const m: number = needleDN.length;
    let lastEntryFound: number = 0; // The last RDN whose DSE was of type entry.
    let dse_lastEntryFound: Vertex | undefined = undefined;
    let lastCP: Vertex | undefined;
    const candidateRefs: ContinuationReference[] = [];
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(state.invokeId.present)
        : undefined;
    const serviceControls = state.operationArgument.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 30)
        ))?.inner;
    const serviceControlOptions = serviceControls?.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ))?.inner;
    // You don't even need to decode this. Just determining that it exists is sufficient.
    const manageDSAITPlaneRefElement = serviceControls?.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 6)
        ));

    // Service controls
    const manageDSAIT: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
    const partialNameResolution: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT);
    const dontUseCopy: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const subentries: boolean = (
        serviceControlOptions?.bitString?.[ServiceControlOptions_subentries] === TRUE_BIT);

    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);

    const node_candidateRefs_empty_2 = async (): Promise<Vertex | undefined> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // TODO: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
            return undefined; // entry unsuitable
        } else {
            return candidateRefsEmpty_yes_branch();
        }
    };

    const node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false = async (): Promise<Vertex | undefined> => {
        if (dse_i.dse.shadow?.subordinateCompleteness === false) {
            if (!lastCP) {
                ctx.log.warn(ctx.i18n.t("log:shadow_not_under_cp", {
                    id: dse_i.dse.uuid,
                }));
                return undefined;
            }
            const cr = makeContinuationRefFromSupplierKnowledge(lastCP, needleDN, lastEntryFound);
            candidateRefs.push(cr);
            nextRDNToBeResolved = i;
            return undefined; // Entry unsuitable.
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
                        const [ masters, shadows ] = splitIntoMastersAndShadows(nsk);
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
                            [ ...shadows.slice(1), ...masters.slice(1) ],
                        );
                    })
                    .filter((ap): ap is AccessPointInformation => !!ap),
                undefined,
                undefined,
                false,
                false,
            );
            candidateRefs.push(cr);
            // TODO: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
            return undefined;
        }
        return node_candidateRefs_empty_2();
    };

    const candidateRefsEmpty_yes_branch = async (): Promise<Vertex | undefined> => {
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        nameError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        } else {
            state.partialName = true;
            nameResolutionPhase = OperationProgress_nameResolutionPhase_completed; // FIXME:
            return dse_i;
        }
    };

    const candidateRefsEmpty1_Branch = async (): Promise<Vertex | undefined> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // TODO: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            state.NRcontinuationList.push(...candidateRefs);
            return undefined; // entry unsuitable
        } else {
            return candidateRefsEmpty_yes_branch();
        }
    };

    const targetNotFoundSubprocedure_notStarted_branch = async (): Promise<Vertex | undefined> => {
        if (lastEntryFound === 0) {
            if (ctx.dit.root.dse.supr) { // If this is NOT a first-level DSA.
                // REVIEW: superiorKnowledge is a multi-valued attribute. Should you create multiple CRs?
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
                            undefined,
                        ),
                    ],
                    undefined,
                    undefined,
                    undefined, // Return to DUA not supported.
                    undefined,
                );
                candidateRefs.push(cr);
                return candidateRefsEmpty1_Branch();
            } else { // Root DSE is not of type subr (meaning that this IS a first-level DSA.)
                if (m === 0) { // ...and the operation was directed at the root DSE.
                    // Step 5.
                    if (
                        compareCode(state.operationCode, list["&operationCode"]!)
                        || compareCode(state.operationCode, search["&operationCode"]!)
                    ) {
                        nameResolutionPhase = OperationProgress_nameResolutionPhase_completed; // TODO: I think you have to return the modified chaningArgs.
                        return dse_i; // Entry suitable.
                    } else {
                        throw new errors.NameError(
                            // REVIEW: This seems incorrect to me... What about read or modifyEntry?
                            ctx.i18n.t("err:can_only_list_or_search_root"),
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
                                state.chainingArguments.aliasDereferenced,
                                undefined,
                            ),
                        );
                    }
                } else { // m !== 0
                    // In a first-level DSA, the root DSE should have an NSSR.
                    // Basically, a root DSE will always have a type of either subr or nssr.
                    (ctx.dit.root.dse.nssr?.nonSpecificKnowledge ?? []).forEach((knowledge): void => {
                        const [ masters, shadows ] = splitIntoMastersAndShadows(knowledge);
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
                                    [ ...shadows.slice(1), ...masters.slice(1) ],
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            nssrEncountered,
                        );
                        candidateRefs.push(cr);
                    });
                    return candidateRefsEmpty1_Branch();
                }
            }
        } else { // Last entry found === 0
            nameResolutionPhase = OperationProgress_nameResolutionPhase_proceeding;
            return node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false();
        }
    };

    const targetNotFoundSubprocedure = async () => {
        switch (nameResolutionPhase) {
            case (OperationProgress_nameResolutionPhase_notStarted): {
                return targetNotFoundSubprocedure_notStarted_branch();
            }
            case (OperationProgress_nameResolutionPhase_proceeding): {
                if (lastEntryFound >= nextRDNToBeResolved) {
                    return node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false();
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
                                conn.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    throw new errors.ServiceError(
                        ctx.i18n.t("err:invalid_reference"),
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            case (OperationProgress_nameResolutionPhase_completed): {
                throw new errors.ServiceError(
                    "7E66876A-D4C5-48FF-815A-93B096F19BB4", // FIXME:
                    new ServiceErrorData(
                        ServiceProblem_invalidReference,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            default: {
                throw new Error(); // FIXME:
            }
        }
    };

    const targetFoundSubprocedure = async (): Promise<Vertex | undefined> => {
        const suitable: boolean = checkSuitabilityProcedure(
            ctx,
            dse_i,
            state.operationCode,
            dontUseCopy,
            copyShallDo,
            state.chainingArguments.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
            state.operationArgument,
        );
        if (suitable) {
            nameResolutionPhase = OperationProgress_nameResolutionPhase_completed;
            state.entrySuitable = true;
            state.foundDSE = dse_i;
            return dse_i;
        } else {
            nameResolutionPhase = OperationProgress_nameResolutionPhase_proceeding;
            nextRDNToBeResolved = m;
            assert(lastCP);
            const cr = makeContinuationRefFromSupplierKnowledge(lastCP, needleDN, nextRDNToBeResolved);
            candidateRefs.push(cr);
            return undefined;
        }
    };

    let iterations: number = 0;
    while (iterations < MAX_DEPTH) {
        iterations++;
        if (i === m) {
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
        const accessControlScheme = state.admPoints
            .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
        let cursorId: number | undefined;
        let subordinatesInBatch = await readChildren(
            ctx,
            dse_i,
            100,
            undefined,
            cursorId,
        );
        while (subordinatesInBatch.length) {
            for (const child of subordinatesInBatch) {
                cursorId = child.dse.id;
                if (op?.abandonTime) {
                    op.events.emit("abandon");
                    throw new errors.AbandonError(
                        ctx.i18n.t("err:abandoned"),
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
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                checkTimeLimit();
                // TODO: Make this a check for AC schemes that use the BAC ACDF.
                if (!ctx.config.bulkInsertMode && accessControlScheme) {
                    const childDN = getDistinguishedName(child);
                    const relevantSubentries: Vertex[] = (await Promise.all(
                        state.admPoints.map((ap) => getRelevantSubentries(ctx, child, childDN, ap)),
                    )).flat();
                    const targetACI = [
                        ...((accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME) && !child.dse.subentry)
                            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                            : []),
                        ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && child.dse.subentry)
                            ? child.immediateSuperior?.dse?.admPoint?.subentryACI ?? []
                            : []),
                        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                            ? child.dse.entryACI ?? []
                            : []),
                    ];
                    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
                    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
                        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                            ...tuple,
                            await userWithinACIUserClass(
                                tuple[0],
                                conn.boundNameAndUID!,
                                childDN,
                                EQUALITY_MATCHER,
                                isMemberOfGroup,
                            ),
                        ]),
                    ))
                        .filter((tuple) => (tuple[5] > 0));
                    const {
                        authorized,
                    } = bacACDF(
                        relevantTuples,
                        conn.authLevel,
                        {
                            entry: Array.from(child.dse.objectClass).map(ObjectIdentifier.fromString),
                        },
                        [
                            PERMISSION_CATEGORY_BROWSE,
                            PERMISSION_CATEGORY_RETURN_DN,
                        ],
                        EQUALITY_MATCHER,
                    );
                    if (!authorized) {
                        /**
                         * We ignore entries for which browse and returnDN permissions
                         * are not granted. This is not specified in the Find DSE
                         * procedure, but it is important for preventing information
                         * disclosure vulnerabilities.
                         */
                        continue;
                    }
                }

                rdnMatched = compareRDN(
                    needleRDN,
                    child.dse.rdn,
                    getNamingMatcherGetter(ctx),
                );
                if (rdnMatched) {
                    i++;
                    dse_i = child;
                    break;
                }
            }
            if (rdnMatched) {
                break;
            }
            subordinatesInBatch = await readChildren(
                ctx,
                dse_i,
                100,
                undefined,
                cursorId,
            );
        }
        if (!rdnMatched) {
            await targetNotFoundSubprocedure();
            return;
        }
        /**
         * This is not explicitly required by the specification, but it seems to
         * be implicitly required for the formation of continuation references.
         */
        if (dse_i.dse.nssr) {
            nssrEncountered = true;
        }
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (dse_i.dse.alias) {
            if (dontDereferenceAliases) {
                if (i === m) {
                    await targetFoundSubprocedure();
                    return;
                } else {
                    throw new errors.NameError(
                        ctx.i18n.t("err:reached_alias_above_target"),
                        new NameErrorData(
                            NameProblem_aliasDereferencingProblem,
                            { // FIXME: Check authorization to see this.
                                rdnSequence: getDistinguishedName(dse_i),
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                    );
                }
            } else {
                const newN = [
                    ...dse_i.dse.alias.aliasedEntryName,
                    ...needleDN.slice(i), // RDNs N(i + 1) to N(m)
                ];
                const newChaining: ChainingArguments = new ChainingArguments(
                    state.chainingArguments.originator,
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
                return findDSE(
                    ctx,
                    conn,
                    haystackVertex,
                    newN,
                    state,
                );
            }
        }
        if (dse_i.dse.subentry) {
            if (i === m) {
                await targetFoundSubprocedure();
                return;
            } else {
                throw new errors.NameError(
                    ctx.i18n.t("err:reached_subentry_above_target"),
                    new NameErrorData(
                        NameProblem_noSuchObject,
                        {
                            rdnSequence: getDistinguishedName(dse_i),
                        },
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            nameError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
        if (dse_i.dse.entry) {
            if (i === m) {
                if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                    await targetFoundSubprocedure();
                    return;
                }
                // if (true) {
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
                        "788EC688-D82A-444A-A2F7-457B80753ADD", // FIXME:
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                serviceError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
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
                { // REVIEW: This might be technically incorrect.
                    rdnSequence: getDistinguishedName(dse_i), // Also requires Access Control checking
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
                        [ ...shadows, ...masters ]
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
        if (dse_i.dse.admPoint) {
            if (dse_i.dse.admPoint.administrativeRole.has(autonomousArea)) {
                state.admPoints.length = 0;
            }
            // TODO: inner areas shall not be used if SAC is in place.
            // NOTE: This actually needs to be implemented elsewhere.
            state.admPoints.push(dse_i);
        }
        if (dse_i.dse.cp && dse_i.dse.shadow) {
            lastCP = dse_i;
        }
    }
    throw new errors.ServiceError(
        ctx.i18n.t("err:loop_detected"),
        new ServiceErrorData(
            ServiceProblem_loopDetected,
            [],
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                undefined,
                serviceError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            undefined,
        ),
    );
}

export default findDSE;

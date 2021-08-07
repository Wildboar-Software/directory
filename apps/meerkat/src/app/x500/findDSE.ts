import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Vertex } from "../types";
import type {
    CommonArguments,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CommonArguments.ta";
import {
    AccessPointInformation,
    ContinuationReference, OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import type {
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    ReferenceType,
    ReferenceType_supplier,
    ReferenceType_master,
    ReferenceType_subordinate,
    ReferenceType_immediateSuperior,
    ReferenceType_cross,
    ReferenceType_superior,
    ReferenceType_nonSpecificSubordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    _decode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import type {
    Filter,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import getDistinguishedName from "./getDistinguishedName";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import { OBJECT_IDENTIFIER, TRUE_BIT, ASN1Element } from "asn1-ts";
import readChildren from "../dit/readChildren";
import readEntryAttributes from "../database/readEntryAttributes";
import { specificKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/specificKnowledge.oa";
import { superiorKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/superiorKnowledge.oa";
import { nonSpecificKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/nonSpecificKnowledge.oa";
import * as errors from "../errors";
import { ServiceErrorData, ServiceProblem_invalidReference, ServiceProblem_loopDetected, ServiceProblem_unableToProceed } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { NameProblem_aliasDereferencingProblem, NameProblem_noSuchObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type { TraceItem } from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import { strict as assert } from "assert";
import { id_opcode_administerPassword } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-administerPassword.va";
import { id_opcode_addEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-addEntry.va";
import { id_opcode_changePassword } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-changePassword.va";
import { id_opcode_compare } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-compare.va";
import { id_opcode_modifyDN } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyDN.va";
import { id_opcode_modifyEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyEntry.va";
import { id_opcode_list } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import { id_opcode_read } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import { id_opcode_removeEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-removeEntry.va";
import { id_opcode_search } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import getMatchingRulesFromFilter from "@wildboar/x500/src/lib/utils/getMatchingRulesFromFilter";

const MAX_DEPTH: number = 10000;

// TODO: X.500
function isModificationOperation (operationType: Code): boolean {
    return (
        compareCode(id_opcode_administerPassword, operationType)
        || compareCode(id_opcode_addEntry, operationType)
        || compareCode(id_opcode_changePassword, operationType)
        || compareCode(id_opcode_modifyDN, operationType)
        || compareCode(id_opcode_modifyEntry, operationType)
        || compareCode(id_opcode_removeEntry, operationType)
    );
}

function makeContinuationRefFromSupplierKnowledge (
    cp: Vertex,
    needleDN: DistinguishedName,
    aliasedRDNs: number | undefined,
    nextRDNToBeResolved: number | undefined,
): ContinuationReference {
    assert(cp.dse.cp);
    assert(cp.dse.cp.supplierKnowledge?.[0]);
    return new ContinuationReference(
        {
            rdnSequence: needleDN,
        },
        aliasedRDNs,
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
    haystackVertex: DIT,
    needleDN: DistinguishedName, // N
    chainArgs: ChainingArguments,
    commonArgs: CommonArguments | undefined, // This won't be present with LDAP Requests
    argument: ASN1Element,
    operationType: Code,
): Promise<boolean> {
    let i: number = 0;
    let dse_i: Vertex = haystackVertex;
    let aliasDereferenced: boolean = false;
    let nssrEncountered: boolean = false;
    let nameResolutionPhase: OperationProgress_nameResolutionPhase | undefined = chainArgs
        .operationProgress?.nameResolutionPhase;
    let nextRDNToBeResolved: number = chainArgs.operationProgress?.nextRDNToBeResolved ?? 0;
    const m: number = needleDN.length;
    let lastEntryFound: number = 0; // The last RDN whose DSE was of type entry.
    let dse_lastEntryFound: Vertex | undefined = undefined;
    let lastCP: Vertex | undefined;
    let aliasedRDNs: number = 0;
    const candidateRefs: ContinuationReference[] = [];

    // Operation Dispatcher variables
    const NRcontinuationList: ContinuationReference[] = [];
    const SRcontinuationList: ContinuationReference[] = [];
    const admPoints: Vertex[] = [];
    const referralRequests: TraceItem[] = [];
    const emptyHierarchySelect: boolean = false;

    // Service controls
    const manageDSAIT: boolean = (
        commonArgs?.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        commonArgs?.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
    const partialNameResolution: boolean = (
        commonArgs?.serviceControls?.options?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT);
    const dontUseCopy: boolean = (
        commonArgs?.serviceControls?.options?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        commonArgs?.serviceControls?.options?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);

    // Variables not defined explicitly, but still referenced by the specification:
    let partialNameResolved: boolean = false;

    const node_candidateRefs_empty_2 = async (): Promise<boolean> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // TODO: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            NRcontinuationList.push(...candidateRefs);
            return false; // entry unsuitable
        } else {
            return candidateRefsEmpty_yes_branch();
        }
    };

    const node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false = async (): Promise<boolean> => {
        if (dse_i.dse.shadow?.subordinateCompleteness === false) {
            if (!lastCP) {
                ctx.log.warn("DIT invalid: shadow copy not under a context prefix.");
                return false;
            }
            const cr = makeContinuationRefFromSupplierKnowledge(lastCP, needleDN, aliasedRDNs, nextRDNToBeResolved);
            candidateRefs.push(cr);
            nextRDNToBeResolved = i;
            return false; // Entry unsuitable.
        }
        if (dse_lastEntryFound?.dse.nssr) {
            const cr = new ContinuationReference(
                {
                    rdnSequence: needleDN,
                },
                aliasedRDNs,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_proceeding,
                    i,
                ),
                undefined, // FIXME:
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
            NRcontinuationList.push(...candidateRefs);
            return false;
        }
        return node_candidateRefs_empty_2();
    };

    const candidateRefsEmpty_yes_branch = async (): Promise<boolean> => {
        if (partialNameResolution) {
            throw new errors.NameError(
                "",
                new NameErrorData(
                    NameProblem_noSuchObject,
                    {
                        rdnSequence: needleDN.slice(0, i),
                    },
                    [],
                    undefined,
                    undefined,
                    aliasDereferenced,
                    undefined,
                ),
            );
        } else {
            partialNameResolved = true;
            nameResolutionPhase = OperationProgress_nameResolutionPhase_completed;
            return true;
        }
    };

    const candidateRefsEmpty1_Branch = async (): Promise<boolean> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            // TODO: The spec seems to suggest only adding one CR to the NRCL. Can I add them all?
            NRcontinuationList.push(...candidateRefs);
            return false; // entry unsuitable
        } else {
            return candidateRefsEmpty_yes_branch();
        }
    };

    const targetNotFoundSubprocedure_notStarted_branch = async (): Promise<boolean> => {
        if (lastEntryFound === 0) {
            if (ctx.dit.root.dse.supr) {
                // Make continuation reference
                const { operationalAttributes } = await readEntryAttributes(ctx, ctx.dit.root, {
                    attributesSelect: [ superiorKnowledge["&id"] ],
                    contextSelection: undefined,
                    returnContexts: false,
                    includeOperationalAttributes: true,
                });
                const superiorKnowledgeAttributes = operationalAttributes
                    .filter((oa) => oa.id.isEqualTo(superiorKnowledge["&id"]));
                const knowledges = superiorKnowledgeAttributes
                    .map((sk) => superiorKnowledge.decoderFor["&Type"]!(sk.value));
                knowledges.forEach((k): void => {
                    const cr = new ContinuationReference(
                        {
                            rdnSequence: needleDN,
                        },
                        aliasedRDNs,
                        new OperationProgress(
                            OperationProgress_nameResolutionPhase_proceeding,
                            i,
                        ),
                        i,
                        ReferenceType_superior,
                        [
                            new AccessPointInformation(
                                k.ae_title,
                                k.address,
                                k.protocolInformation,
                                undefined,
                                undefined,
                                undefined,
                            ),
                        ],
                        undefined, // FIXME:
                        undefined,
                        undefined, // Return to DUA not supported.
                        nssrEncountered,
                    );
                    candidateRefs.push(cr);
                });
                return candidateRefsEmpty1_Branch();
            } else { // Root DSE is not of type subr
                if (m === 0) { // REVIEW: This seems like it would prohibit any operation other than list or search on the root DSE.
                    // Actually, I think we'd only get here if the root DSE is not a top-level root DSE.
                    if (
                        compareCode(operationType, list["&operationCode"]!)
                        || compareCode(operationType, search["&operationCode"]!)
                    ) {
                        nameResolutionPhase = OperationProgress_nameResolutionPhase_completed;
                        return true; // Entry suitable.
                    } else {
                        throw new errors.NameError(
                            "",
                            new NameErrorData(
                                NameProblem_noSuchObject,
                                {
                                    rdnSequence: [],
                                },
                                [],
                                undefined,
                                undefined,
                                aliasDereferenced,
                                undefined,
                            ),
                        );
                    }
                } else { // m !== 0
                    assert(ctx.dit.root.dse.nssr); // Seems to be assumed at this point.
                    const { operationalAttributes } = await readEntryAttributes(ctx, dse_i, {
                        attributesSelect: [ specificKnowledge["&id"] ],
                        contextSelection: undefined,
                        returnContexts: false,
                        includeOperationalAttributes: true,
                    });
                    const nonSpecificKnowledgeAttributes = operationalAttributes
                        .filter((oa) => oa.id.isEqualTo(nonSpecificKnowledge["&id"]));
                    const knowledges = nonSpecificKnowledgeAttributes
                        .map((sk) => nonSpecificKnowledge.decoderFor["&Type"]!(sk.value));
                    knowledges.forEach((knowledge): void => {
                        const [ masters, shadows ] = splitIntoMastersAndShadows(knowledge);
                        const recommendedAP = shadows[0] ?? masters[0];
                        if (!recommendedAP) {
                            return;
                        }
                        const cr = new ContinuationReference(
                            {
                                rdnSequence: needleDN,
                            },
                            aliasedRDNs,
                            new OperationProgress(
                                OperationProgress_nameResolutionPhase_proceeding,
                                1,
                            ),
                            i, // TODO: Review
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
                            undefined, // FIXME:
                            undefined,
                            undefined, // Return to DUA not supported.
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
                    (chainArgs.referenceType === ReferenceType_nonSpecificSubordinate)
                    && (nextRDNToBeResolved === (i + 1))
                ) {
                    throw new errors.ServiceError(
                        "",
                        new ServiceErrorData(
                            ServiceProblem_unableToProceed,
                            [],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    );
                } else {
                    throw new errors.ServiceError(
                        "",
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    );
                }
            }
            case (OperationProgress_nameResolutionPhase_completed): {
                throw new errors.ServiceError(
                    "",
                    new ServiceErrorData(
                        ServiceProblem_invalidReference,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            default: {
                throw new Error(); // FIXME:
            }
        }
    };

    const checkSuitabilityProcedure = async (): Promise<boolean> => {
        const dse = dse_i;
        if (!dse.dse.shadow) {
            // TODO: Check critical extensions
            return true;
        }
        if (isModificationOperation(operationType)) {
            return false; // You cannot modify a shadow copy.
        }
        if (dontUseCopy) {
            return false; // The user specifically demanded a non-shadow copy.
        }
        if (copyShallDo) {
            // TODO: Check critical extensions
            return true;
        }
        if (compareCode(operationType, id_opcode_list)) {
            return Boolean(dse.dse.shadow.subordinateCompleteness);
        } else if (compareCode(operationType, id_opcode_read)) {
            return true; // FIXME: This might be passable for now, but it is technically incorrect.
            // I don't know how to tell if the shadow copy is missing attributes
            // that are present in the master, or if there are no such attributes at all.
        } else if (compareCode(operationType, id_opcode_search)) {
            const searchArgs = _decode_SearchArgument(argument);
            const searchArgData = ("signed" in searchArgs)
                ? searchArgs.signed.toBeSigned
                : searchArgs.unsigned;
            if (searchArgData.searchAliases && dse.dse.alias) {
                return !chainArgs.excludeShadows;
            }
            const mrs = searchArgData.filter
                ? getMatchingRulesFromFilter(searchArgData.filter)
                : [];
            if (mrs.map((mr) => mr.toString()).some((mr) => !(
                ctx.equalityMatchingRules.get(mr)
                ?? ctx.orderingMatchingRules.get(mr)
                ?? ctx.substringsMatchingRules.get(mr)
            ))) { // Matching rule not understood
                return false;
            }
            if (
                (searchArgData.subset === SearchArgumentData_subset_oneLevel)
                || (searchArgData.subset === SearchArgumentData_subset_wholeSubtree)
            ) {
                if (chainArgs.excludeShadows) {
                    return false;
                }
                // TODO: Check that shadowed information can satisfy search.
                return true;
            } else if (searchArgData.subset === SearchArgumentData_subset_baseObject) {
                // TODO: Check if all attributes are present.
                return true;
            } else {
                return false; // TODO: Review. What to do?
            }
        } else if (compareCode(operationType, id_opcode_compare)) {
            // TODO: Bail out if matching rules are not supported by DSA.
            // TODO: Check if all attributes requested are present.
            return true;
        } else {
            return false; // TODO: Review. What to do?
        }
    };

    const targetFoundSubprocedure = async (): Promise<boolean> => {
        if (await checkSuitabilityProcedure()) {
            nameResolutionPhase = OperationProgress_nameResolutionPhase_completed;
            return true;
        } else {
            nameResolutionPhase = OperationProgress_nameResolutionPhase_proceeding;
            nextRDNToBeResolved = i;
            assert(lastCP);
            const cr = makeContinuationRefFromSupplierKnowledge(lastCP, needleDN, aliasedRDNs, nextRDNToBeResolved);
            candidateRefs.push(cr);
            return false;
        }
    };

    let iterations: number = 0;
    while (iterations < MAX_DEPTH) {
        iterations++;
        const children = await readChildren(ctx, dse_i);
        if (i === m) {
            // I pretty much don't understand this entire section.
            if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                return targetNotFoundSubprocedure();
            }
            if (commonArgs?.serviceControls?.manageDSAITPlaneRef || manageDSAIT) {
                return true;
            }
            if (
                (chainArgs.referenceType === ReferenceType_supplier)
                || (chainArgs.referenceType === ReferenceType_master)
            ) {
                return targetNotFoundSubprocedure();
            }
            // I don't understand why we do this.
            const someChildrenAreCP: boolean = (children.some((child) => child.dse.cp));
            return someChildrenAreCP
                ? true
                : targetNotFoundSubprocedure();
        }
        const needleRDN = needleDN[i];
        for (const child of children) {
            const rdnMatched: boolean = compareRDN(
                needleRDN,
                child.dse.rdn,
                (attributeType: OBJECT_IDENTIFIER) => ctx.attributes.get(attributeType.toString())?.namingMatcher,
            );
            if (rdnMatched) {
                i++;
                dse_i = child;
                break;
            }
        }
        /**
         * This is not explicitly required by the specification, but it seems to
         * be implicitly required for the formation of continuation references.
         */
        if (dse_i.dse.nssr) {
            nssrEncountered = true;
        }
        if (
            (i === chainArgs.operationProgress?.nextRDNToBeResolved)
            // Is checking for shadow enough to determine if !master?
            || (chainArgs.nameResolveOnMaster && dse_i.dse.shadow)
        ) {
            throw new errors.ServiceError(
                "Could not resolve name on master.",
                new ServiceErrorData(
                    ServiceProblem_unableToProceed,
                    [],
                    undefined,
                    undefined,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (dse_i.dse.alias) {
            if (dontDereferenceAliases) {
                if (i === m) {
                    return targetFoundSubprocedure();
                } else {
                    throw new errors.NameError(
                        "Reached an alias above the sought object, and dereferencing was prohibited.",
                        new NameErrorData(
                            NameProblem_aliasDereferencingProblem,
                            { // FIXME: Check authorization to see this.
                                rdnSequence: getDistinguishedName(dse_i),
                            },
                            [],
                            undefined,
                            undefined,
                            false,
                            undefined,
                        ),
                    );
                }
            } else {
                aliasDereferenced = true;
                nameResolutionPhase = OperationProgress_nameResolutionPhase_notStarted;
                const newN = [
                    // ...(dse_i.aliasedEntry ? getDistinguishedName(dse_i.aliasedEntry) : []), // FIXME:
                    ...needleDN.slice(i), // RDNs N(i + 1) to N(m)
                ];
                aliasedRDNs = 1;
                return findDSE(
                    ctx,
                    haystackVertex,
                    newN,
                    chainArgs,
                    commonArgs,
                    argument,
                    operationType,
                );
            }
        }
        if (dse_i.dse.subentry) {
            if (i === m) {
                return targetFoundSubprocedure();
            } else {
                throw new errors.NameError(
                    "No DSEs to find beneath a subentry.",
                    new NameErrorData(
                        NameProblem_noSuchObject,
                        {
                            rdnSequence: needleDN.slice(0, i),
                        },
                        [],
                        undefined,
                        undefined,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
        if (dse_i.dse.entry) {
            if (i === m) {
                if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                    return targetFoundSubprocedure();
                }
                if (commonArgs?.serviceControls?.manageDSAITPlaneRef || manageDSAIT) {
                    return true;
                }
                if (
                    (chainArgs.referenceType === ReferenceType_supplier)
                    || (chainArgs.referenceType === ReferenceType_master)
                ) {
                    return targetFoundSubprocedure();
                }
                const someSubordinatesAreCP = children.some((child) => child.dse.cp);
                if (!someSubordinatesAreCP) {
                    throw new errors.ServiceError(
                        "",
                        new ServiceErrorData(
                            ServiceProblem_invalidReference,
                            [],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    );
                }
                return true; // Entry suitable
            } else {
                lastEntryFound = i;
                dse_lastEntryFound = dse_i;
            }
        }
        if (
            dse_i.dse.subr
            || dse_i.dse.xr
            || dse_i.dse.immSupr
        ) {
            const { operationalAttributes } = await readEntryAttributes(ctx, dse_i, {
                attributesSelect: [ specificKnowledge["&id"] ],
                contextSelection: undefined,
                returnContexts: false,
                includeOperationalAttributes: true,
            });
            const specificKnowledgeAttributes = operationalAttributes
                .filter((oa) => oa.id.isEqualTo(specificKnowledge["&id"]));
            const knowledges = specificKnowledgeAttributes
                .map((sk) => specificKnowledge.decoderFor["&Type"]!(sk.value));
            knowledges
                .forEach((k): void => {
                    const referenceType: ReferenceType = ((): ReferenceType => {
                        if (dse_i.dse.subr) {
                            return ReferenceType_subordinate;
                        }
                        if (dse_i.dse.immSupr) {
                            return ReferenceType_immediateSuperior;
                        }
                        return ReferenceType_cross;
                    })();
                    const masters: MasterOrShadowAccessPoint[] = [];
                    const shadows: MasterOrShadowAccessPoint[] = [];
                    k.forEach((mosap) => {
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
                        aliasedRDNs,
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
                        undefined, // FIXME:
                        undefined,
                        undefined, // Return to DUA not supported.
                        nssrEncountered,
                    );
                    candidateRefs.push(cr);
                });
        }
        if (dse_i.dse.admPoint) {
            admPoints.push(dse_i);
        }
        if (dse_i.dse.cp && dse_i.dse.shadow) {
            lastCP = dse_i;
        }
    }
    throw new errors.ServiceError(
        "Loop detected in Find DSE procedure.",
        new ServiceErrorData(
            ServiceProblem_loopDetected,
            [],
            undefined,
            undefined,
            aliasDereferenced,
            undefined,
        ),
    );
}

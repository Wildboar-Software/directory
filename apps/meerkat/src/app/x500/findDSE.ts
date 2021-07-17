import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Entry } from "../types";
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
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import getDistinguishedName from "./getDistinguishedName";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import { OBJECT_IDENTIFIER, TRUE_BIT } from "asn1-ts";
import readChildren from "../dit/readChildren";
import readEntryAttributes from "../database/readEntryAttributes";
// import getRDN from "./getRDN";
// import isLocalContextPrefix from "../dit/isLocalContextPrefix";
import { specificKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/specificKnowledge.oa";
import { superiorKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/superiorKnowledge.oa";
import { nonSpecificKnowledge } from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/nonSpecificKnowledge.oa";
import * as errors from "../dap/errors";
import { ServiceErrorData, ServiceProblem_loopDetected, ServiceProblem_unableToProceed } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { NameProblem_aliasDereferencingProblem, NameProblem_noSuchObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type { TraceItem } from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";

const MAX_DEPTH: number = 10000;

function compareCode (a: Code, b: Code): boolean {
    if (("local" in a) && ("local" in b)) {
        return a.local === b.local;
    } else if (("global" in a) && ("global" in b)) {
        return a.global.isEqualTo(b.global);
    } else {
        return false;
    }
}

function splitIntoMastersAndShadows (
    mosaps: MasterOrShadowAccessPoint[],
): [ masters: MasterOrShadowAccessPoint[], shadows: MasterOrShadowAccessPoint[] ] {
    const masters: MasterOrShadowAccessPoint[] = [];
    const shadows: MasterOrShadowAccessPoint[] = [];
    for (const mosap of mosaps) {
        if (mosap.category === MasterOrShadowAccessPoint_category_master) {
            masters.push(mosap);
        } else if (mosap.category === MasterOrShadowAccessPoint_category_shadow) {
            shadows.push(mosap);
        }
    }
    return [ masters, shadows ];
}

export
async function findDSE <T extends CommonArguments> (
    ctx: Context,
    haystackVertex: DIT,
    needleDN: DistinguishedName, // N
    args: ChainingArguments,
    operation: T,
    operationType: Code,
): Promise<boolean> {
    let i: number = 0;
    let dse_i: Entry = haystackVertex;
    let aliasDereferenced: boolean = false;
    let nssrEncountered: boolean = false;
    let nameResolutionPhase: OperationProgress_nameResolutionPhase | undefined = args
        .operationProgress?.nameResolutionPhase;
    const m: number = needleDN.length;
    let lastEntryFound: number = 0; // The last RDN whose DSE was of type entry.
    let lastCP: Entry | undefined;
    let aliasedRDNs: number = 0;
    const candidateRefs: ContinuationReference[] = [];

    // Operation Dispatcher variables
    const NRcontinuationList: ContinuationReference[] = [];
    const SRcontinuationList: ContinuationReference[] = [];
    const admPoints: Entry[] = [];
    const referralRequests: TraceItem[] = [];
    const emptyHierarchySelect: boolean = false;

    const manageDSAIT: boolean = (operation.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        operation.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);
    const partialNameResolution: boolean = (
        operation.serviceControls?.options?.[ServiceControlOptions_partialNameResolution] === TRUE_BIT);

    // Variables not defined explicitly, but still referenced by the specification:
    let partialNameResolved: boolean = false;

    // const node_is_dse_i_shadow_and_with_subordinate_completeness_flag_false = async (): Promise<boolean> => {
    //     if (dse_i.dseType.shadow) { // TODO: Add shadowing completeness flags to directory entries

    //     }
    // };

    const candidateRefsEmpty_yes_branch = async (): Promise<boolean> => {
        if (partialNameResolution) {
            throw new errors.NameError(
                "",
                new NameErrorData(
                    NameProblem_noSuchObject,
                    {
                        rdnSequence: needleDN,
                    },
                    [],
                    undefined,
                    undefined,
                    aliasDereferenced,
                    undefined,
                ),
            )
        } else {
            partialNameResolved = true;
            nameResolutionPhase = OperationProgress_nameResolutionPhase_completed;
            return true;
        }
    };

    const candidateRefsEmpty1_Branch = async (): Promise<boolean> => {
        if (candidateRefs.length) {
            // Add CR from candidateRefs to NRContinuationList
            NRcontinuationList.push(...candidateRefs);
            return false; // entry unsuitable
        } else {
            return candidateRefsEmpty_yes_branch();
        }
    };

    const targetNotFoundSubprocedure_notStarted_branch = async (): Promise<boolean> => {
        if (lastEntryFound === 0) {
            if (ctx.database.data.dit.dseType.supr) {
                // Make continuation reference
                const { operationalAttributes } = await readEntryAttributes(ctx, ctx.database.data.dit, {
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
                                    rdnSequence: [], // FIXME:
                                },
                                [],
                                undefined,
                                undefined,
                                aliasDereferenced,
                                undefined,
                            ),
                        );
                    }
                } else if (!ctx.database.data.dit.dseType.nssr) { // It seems to be assumed by the spec that the root DSE is of type nssr at this point.
                    throw new Error(); // FIXME:
                } else { // m !== 0
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
                            i,
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
            return true; // FIXME:
        }
    };

    const targetNotFoundSubprocedure = async () => {
        switch (nameResolutionPhase) {
            case (OperationProgress_nameResolutionPhase_notStarted): {
                return targetNotFoundSubprocedure_notStarted_branch();
            }
            case (OperationProgress_nameResolutionPhase_proceeding): {
                return true; // FIXME:
            }
            case (OperationProgress_nameResolutionPhase_completed): {
                return true; // FIXME:
            }
            default: {
                throw new Error(); // FIXME:
            }
        }
    };

    let iterations: number = 0;
    while (iterations < MAX_DEPTH) {
        iterations++;
        const children = await readChildren(ctx, dse_i);
        if (i === m) {
            // I pretty much don't understand this entire section.
            if (nameResolutionPhase === OperationProgress_nameResolutionPhase_completed) {
                return false; // TODO: Continue at Target Not Found
            }
            if (operation.serviceControls?.manageDSAITPlaneRef || manageDSAIT) {
                return true;
            }
            if (
                (args.referenceType === ReferenceType_supplier)
                || (args.referenceType === ReferenceType_master)
            ) {
                return false; // TODO: Continue at Target Not Found.
            }
            // I don't understand why we do this.
            return (children.some((child) => child.dseType.cp));
        }
        const needleRDN = needleDN[i];
        for (const child of children) {
            const rdnMatched: boolean = compareRDN(
                needleRDN,
                child.rdn,
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
        if (dse_i.dseType.nssr) {
            nssrEncountered = true;
        }
        if (
            (i === args.operationProgress?.nextRDNToBeResolved)
            // Is checking for shadow enough to determine if !master?
            || (args.nameResolveOnMaster && dse_i.dseType.shadow)
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
        if (dse_i.dseType.alias) {
            if (dontDereferenceAliases) {
                if (i === m) {
                    return true; // TODO: Target Found
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
                    ...(dse_i.aliasedEntry ? getDistinguishedName(dse_i.aliasedEntry) : []),
                    ...needleDN.slice(i), // RDNs N(i + 1) to N(m)
                ];
                aliasedRDNs = 1;
                return findDSE(
                    ctx,
                    haystackVertex,
                    newN,
                    args,
                    operation,
                    operationType,
                );
            }
        }
        if (dse_i.dseType.subentry) {
            if (i === m) {
                return true; // TODO: TargetFound
            } else {
                return false; // TODO: Throw NameError.noSuchObject
            }
        }
        if (dse_i.dseType.entry) {
            if (i === m) {
                if (nameResolutionPhase !== OperationProgress_nameResolutionPhase_completed) {
                    return true; // TargetFound
                }
                if (operation.serviceControls?.manageDSAITPlaneRef || manageDSAIT) {
                    return true; // TargetFound
                }
                if (
                    (args.referenceType === ReferenceType_supplier)
                    || (args.referenceType === ReferenceType_master)
                ) {
                    return true;
                }
                const someSubordinatesAreCP = children.some((child) => child.dseType.cp);
                if (!someSubordinatesAreCP) {
                    return false; // TODO: throw ServiceError.invalidReference
                }
                return true; // Entry suitable
            } else {
                lastEntryFound = i;
            }
        }
        if (
            dse_i.dseType.subr
            || dse_i.dseType.xr
            || dse_i.dseType.immSupr
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
                        if (dse_i.dseType.subr) {
                            return ReferenceType_subordinate;
                        }
                        if (dse_i.dseType.immSupr) {
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
        if (dse_i.dseType.admPoint) {
            admPoints.push(dse_i);
        }
        if (dse_i.dseType.cp && dse_i.dseType.shadow) {
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
    )
}

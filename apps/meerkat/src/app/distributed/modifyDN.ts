import { Context, Vertex, Value } from "../types";
import { TRUE_BIT, BERElement } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import * as errors from "../errors";
import {
    _decode_ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import {
    ModifyDNResult,
    _encode_ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
    _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as _encode_ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import getRDN from "../x500/getRDN";
import findEntry from "../x500/findEntry";
import rdnToJson from "../x500/rdnToJson";
import { strict as assert } from "assert";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import connect from "../net/connect";
import type Connection from "../net/Connection";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import {
    ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_proceeding,
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ReferenceType_nonSpecificSubordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import isPrefix from "../x500/isPrefix";
import updateSubordinate from "../dop/updateSubordinate";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import removeValues from "../database/entry/removeValues";

function withinThisDSA (vertex: Vertex) {
    return (
        !vertex.dse.shadow
        && !vertex.dse.immSupr
        // && !vertex.dse.supr // Goes in the root
        && !vertex.dse.subr
        && !vertex.dse.rhob
        && !vertex.dse.nssr
        && !vertex.dse.sa
        && !vertex.dse.xr
        && !vertex.dse.glue
    );
}

async function allSubordinatesWithinThisDSA (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> {
    const externalDSEs = await ctx.db.entry.findMany({
        where: {
            OR: [
                {
                    subr: true,
                },
                {
                    nssr: true,
                },
                {
                    immSupr: true,
                },
                {
                    rhob: true,
                },
                {
                    shadow: true,
                },
                {
                    sa: true,
                },
                {
                    xr: true,
                },
                {
                    glue: true,
                },
            ],
        },
        select: {
            immediate_superior_id: true,
        },
    });
    for (const xdse of externalDSEs) {
        if (xdse.immediate_superior_id === vertex.dse.id) {
            return false;
        }
    }
    let superiorsToQuery: Set<number> = new Set(
        externalDSEs
            .map((row) => row.immediate_superior_id)
            .filter((id): id is number => (typeof id === "number")),
    );
    while (superiorsToQuery.size) {
        const superiorRows = await ctx.db.entry.findMany({
            where: {
                id: {
                    in: Array.from(superiorsToQuery),
                },
            },
            select: {
                immediate_superior_id: true,
            },
        });
        for (const row of superiorRows) {
            if (row.immediate_superior_id === vertex.dse.id) {
                return false;
            }
        }
        superiorsToQuery = new Set(
            superiorRows
                .map((row) => row.immediate_superior_id)
                .filter((id): id is number => (typeof id === "number")),
        );
    }
    return true;
}

export
async function modifyDN (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    if (!withinThisDSA(target)) {
        throw new errors.UpdateError(
            "Target not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    if (!target.immediateSuperior || !withinThisDSA(target.immediateSuperior)) {
        throw new errors.UpdateError(
            "Target's immediate superior not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const argument = _decode_ModifyDNArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const newPrefixDN = (data.newSuperior ?? targetDN.slice(0, -1));
    const oldRDN = target.dse.rdn;
    const newRDN = data.newRDN ?? getRDN(targetDN);
    const destinationDN = [
        ...newPrefixDN,
        newRDN,
    ];
    // TODO: Access Control
    if ((data.object.length === 0) || (destinationDN.length === 0)) {
        throw new errors.UpdateError(
            "The zero-RDN entry is the automatically-managed root DSE and may not be edited.",
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const newSuperior = data.newSuperior
        ? await findEntry(ctx, ctx.dit.root, data.newSuperior)
        : null; // `null` means we did not try.
    if (newSuperior === undefined) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            "New superior not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const superior = newSuperior ?? target.immediateSuperior;
    assert(superior);
    if (!withinThisDSA(superior)) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            "New superior not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    if (data.newSuperior) { // Step 3.
        if (!allSubordinatesWithinThisDSA(ctx, target)) {
            throw new errors.UpdateError(
                "Entry to move has subordinates external to this DSA.",
                new UpdateErrorData(
                    UpdateProblem_affectsMultipleDSAs,
                    undefined,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    // This is, at least implicitly, a part of steps 5, 6, and 7.
    if (await findEntry(ctx, superior, [ newRDN ])) {
        throw new errors.UpdateError(
            "Entry already exists.",
            new UpdateErrorData(
                UpdateProblem_entryAlreadyExists,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    if (target.dse.subentry) { // Continue at step 7.
        // TODO: I believe the code in this section could be deduplicated.
        const admPoint = target.immediateSuperior;
        assert(admPoint);
        if (!admPoint.dse.admPoint) {
            throw new Error(); // FIXME:
        }
        const admPointDN = getDistinguishedName(admPoint);
        const now = new Date();
        const relevantOperationalBindings = await ctx.db.operationalBinding.findMany({
            where: {
                binding_type: id_op_binding_hierarchical.toString(),
                validity_start: {
                    gte: now,
                },
                validity_end: {
                    lte: now,
                },
                // accepted: true, // FIXME: Is this always set?
                OR: [
                    { // Local DSA initiated role A (meaning local DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: true,
                    },
                    { // Remote DSA initiated role B (meaning local DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: false,
                    },
                ],
            },
            select: {
                binding_identifier: true,
                binding_version: true,
                access_point: true,
                agreement_ber: true,
            },
        });
        for (const ob of relevantOperationalBindings) {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            if (!isPrefix(ctx, admPointDN, agreement.immediateSuperior)) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            try {
                const subrDN: DistinguishedName = [
                    ...agreement.immediateSuperior,
                    agreement.rdn,
                ];
                const subr = await findEntry(ctx, ctx.dit.root, subrDN);
                if (!subr) {
                    ctx.log.warn(`Subordinate entry for agreement ${bindingID.identifier} (version ${bindingID.version}) not found.`);
                    continue;
                }
                assert(subr.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                updateSubordinate(
                    ctx,
                    bindingID,
                    subr.immediateSuperior,
                    undefined,
                    subr.dse.rdn,
                    accessPoint,
                )
                    .catch((e) => {
                        ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}). ${e}`);
                    });
            } catch (e) {
                ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}).`);
                continue;
            }
        }
    } else if (target.dse.cp) { // Continue at step 6.
        // Notify the superior DSA.
        const now = new Date();
        const relevantOperationalBindings = await ctx.db.operationalBinding.findMany({
            where: {
                binding_type: id_op_binding_hierarchical.toString(),
                validity_start: {
                    gte: now,
                },
                validity_end: {
                    lte: now,
                },
                // accepted: true, // FIXME: Is this always set?
                OR: [
                    { // Local DSA initiated role B (meaning local DSA is subordinate.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: true,
                    },
                    { // Remote DSA initiated role A (meaning remote DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: false,
                    },
                ],
            },
            select: {
                uuid: true,
                binding_identifier: true,
                binding_version: true,
                access_point: true,
                agreement_ber: true,
            },
        });
        for (const ob of relevantOperationalBindings) {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            const agreementDN: DistinguishedName = [
                ...agreement.immediateSuperior,
                agreement.rdn,
            ];
            const EQUALITY_MATCHER = (type_: AttributeType) => ctx.attributes.get(type_.toString())?.namingMatcher;
            const match = compareDistinguishedName(targetDN, agreementDN, EQUALITY_MATCHER);
            if (!match) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            try {
                assert(target.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                updateSubordinate(
                    ctx,
                    bindingID,
                    superior,
                    undefined,
                    newRDN,
                    accessPoint,
                )
                    .catch((e) => {
                        ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}). ${e}`);
                    });
            } catch (e) {
                ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}).`);
                continue;
            }
        }
    } else if (
        (target.dse.entry || target.dse.alias)
        && superior.dse.nssr
    ) { // Continue at step 5.
        // Follow instructions in 19.1.5. These are the only steps unique to this DSE type.
        for (const nsk of superior.dse.nssr?.nonSpecificKnowledge ?? []) {
            const [ masters ] = splitIntoMastersAndShadows(nsk);
            // TODO: Use only IDM endpoints.
            for (const accessPoint of masters) {
                const conn: Connection | undefined = await connect(ctx, accessPoint, dsp_ip["&id"]!, undefined);
                if (!conn) {
                    continue;
                }
                const serviceControlOptions: Uint8ClampedArray = new Uint8ClampedArray(5);
                serviceControlOptions[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
                const readArg: ReadArgument = {
                    unsigned: new ReadArgumentData(
                        {
                            rdnSequence: destinationDN,
                        },
                        new EntryInformationSelection(
                            {
                                select: [ objectClass["&id"] ],
                            },
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                        undefined,
                        [],
                        new ServiceControls(
                            serviceControlOptions,
                            undefined,
                            undefined, // TODO:
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                        undefined,
                        undefined, // TODO:
                        new OperationProgress(
                            OperationProgress_nameResolutionPhase_completed,
                            undefined,
                        ),
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                };
                const chained: ChainedArgument = new ChainedArgument(
                    new ChainingArguments(
                        undefined, // TODO:
                        undefined,
                        new OperationProgress(
                            OperationProgress_nameResolutionPhase_proceeding,
                            undefined,
                        ),
                        [],
                        undefined,
                        undefined,
                        undefined,
                        ReferenceType_nonSpecificSubordinate,
                        undefined,
                        undefined, // TODO:
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                    _encode_ReadArgument(readArg, DER),
                );
                try {
                    const response = await conn.writeOperation({
                        opCode: chainedRead["&operationCode"]!,
                        argument: _encode_ChainedArgument(chained, DER),
                    });
                    if ("result" in response) {
                        throw new errors.UpdateError(
                            "Entry already exists (among an NSSR).",
                            new UpdateErrorData(
                                UpdateProblem_entryAlreadyExists,
                                undefined,
                                [],
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                            ),
                        );
                    } else {
                        break; // Breaks the inner for loop.
                    }
                } catch (e) {
                    ctx.log.warn(`Failed to access master access point: ${e}`);
                    continue;
                }
            }
        }
        // If we made it out of this for loop, that means we found no already existing entry among the other DSAs.
    }

    // TODO: Name schema validation.
    if (target.immediateSuperior?.subordinates?.length && (target.immediateSuperior !== superior)) {
        const entryIndex = target.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === target.dse.uuid));
        target.immediateSuperior.subordinates.splice(entryIndex, 1); // Remove from the current parent.
        superior?.subordinates?.push(target); // Move to the new parent.
    }
    await ctx.db.entry.update({
        where: {
            id: target.dse.id,
        },
        data: {
            immediate_superior_id: superior.dse.id,
            rdn: rdnToJson(newRDN),
        },
    });
    target.dse.rdn = data.newRDN; // Update the RDN.
    if (data.deleteOldRDN) {
        for (const oldATAV of oldRDN) {
            const valueInNewRDN = newRDN
                .find((newATAV) => newATAV.type_.isEqualTo(oldATAV.type_));
            if (valueInNewRDN) {
                const spec = ctx.attributes.get(oldATAV.type_.toString());
                if (spec?.namingMatcher && spec.namingMatcher(oldATAV.value, valueInNewRDN.value)) {
                    continue;
                }
            }
            const valueToDelete: Value = {
                id: oldATAV.type_,
                value: oldATAV.value,
                contexts: new Map(),
            };
            await removeValues(ctx, target, [valueToDelete], []);
        }
    }

    // TODO: Update shadows
    const result: ModifyDNResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ModifyDNResult(result, DER),
    );
}

export default modifyDN;

import { Context, Vertex, Value, ClientConnection, OperationReturn } from "../types";
import { BERElement, OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
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
import { strict as assert } from "assert";
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
import removeValues from "../database/entry/removeValues";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
    PERMISSION_CATEGORY_IMPORT,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import getAdministrativePoints from "../dit/getAdministrativePoints";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_modifyDN,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyDN.va";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

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
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    if (!withinThisDSA(target)) {
        throw new errors.UpdateError(
            "Target not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
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
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    const argument = _decode_ModifyDNArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                "Could not complete operation in time.",
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
                    undefined,
                    undefined,
                ),
            );
        }
    };
    const targetDN = getDistinguishedName(target);
    const objectClasses: OBJECT_IDENTIFIER[] = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const relevantACIItems = [ // FIXME: subentries
        ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? (target.dse.entryACI ?? [])
            : []),
    ];
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
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
        if (data.newRDN) {
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    entry: objectClasses,
                },
                [
                    PERMISSION_CATEGORY_RENAME,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    "Not permitted to modify entry RDN.",
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
            }
        }
        if (data.newSuperior) {
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    entry: objectClasses,
                },
                [
                    PERMISSION_CATEGORY_EXPORT,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    "Not permitted to export entry.",
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
            }
        }
    }
    const newPrefixDN = (data.newSuperior ?? targetDN.slice(0, -1));
    const oldRDN = target.dse.rdn;
    const newRDN = data.newRDN ?? getRDN(targetDN);
    const destinationDN = [
        ...newPrefixDN,
        newRDN,
    ];
    if ((data.object.length === 0) || (destinationDN.length === 0)) {
        throw new errors.UpdateError(
            "The zero-RDN entry is the automatically-managed root DSE and may not be edited.",
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
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
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    const superior = newSuperior ?? target.immediateSuperior;
    assert(superior);

    // Access control for the new location.
    if (data.newSuperior) {
        const newAdmPoints = getAdministrativePoints(superior);
        const relevantSubentries: Vertex[] = (await Promise.all(
            newAdmPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, destinationDN, ap)),
        )).flat();
        const newAccessControlScheme = newAdmPoints
            .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        if (newAccessControlScheme) {
            const AC_SCHEME: string = newAccessControlScheme?.toString() ?? "";
            const relevantACIItems = [ // FIXME: subentries
                // NOTE: ITU X.511 says that the IMPORT permission MUST come only from prescriptiveACI.
                ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
                    ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                    : []),
            ];
            const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
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
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    entry: objectClasses,
                },
                [
                    PERMISSION_CATEGORY_IMPORT,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    "Not permitted to import entry.",
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
            }
        }
    }

    if (!withinThisDSA(superior)) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            "New superior not within this DSA.",
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
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
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    // TODO: Check if new superior provides IMPORT permission via a prescriptiveACI or subentryACI

    // This is, at least implicitly, a part of steps 5, 6, and 7.
    if (await findEntry(ctx, superior, [ newRDN ])) {
        throw new errors.UpdateError(
            "Entry already exists.",
            new UpdateErrorData(
                UpdateProblem_entryAlreadyExists,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    checkTimeLimit();
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
            const match = compareDistinguishedName(targetDN, agreementDN, NAMING_MATCHER);
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
        await checkIfNameIsAlreadyTakenInNSSR(ctx, superior.dse.nssr.nonSpecificKnowledge ?? [], destinationDN);
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
            // rdn: rdnToJson(newRDN),
        },
    });
    await ctx.db.$transaction([
        ctx.db.entry.update({
            where: {
                id: target.dse.id,
            },
            data: {
                immediate_superior_id: superior.dse.id,
            },
        }),
        ctx.db.rDN.deleteMany({
            where: {
                entry_id: target.dse.id,
            },
        }),
        ctx.db.rDN.createMany({
            data: newRDN.map((atav) => ({
                entry_id: target.dse.id,
                type: atav.type_.toString(),
                value: Buffer.from(atav.value.toBytes()),
            })),
        }),
    ]);
    target.dse.rdn = data.newRDN; // Update the RDN.
    if (data.deleteOldRDN) {
        for (const oldATAV of oldRDN) {
            const valueInNewRDN = newRDN
                .find((newATAV) => newATAV.type_.isEqualTo(oldATAV.type_));
            if (valueInNewRDN) {
                const namingMatcher = NAMING_MATCHER(oldATAV.type_);
                if (namingMatcher?.(oldATAV.value, valueInNewRDN.value)) {
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
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        id_opcode_modifyDN,
                    ),
                    undefined,
                ),
                _encode_ModifyDNResult(result, DER),
            ),
        },
        stats: {
            request: {
                operationCode: codeToString(id_opcode_modifyDN),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                newRDNLength: data.newRDN.length,
                newSuperiorNameLength: data.newSuperior?.length,
                deleteOldRDN: data.deleteOldRDN,
            },
        },
    };
}

export default modifyDN;

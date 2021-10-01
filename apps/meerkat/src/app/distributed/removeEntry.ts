import { Context, Vertex, ClientConnection, OperationReturn } from "../types";
import { ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import {
    _decode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import {
    _encode_RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import deleteEntry from "../database/deleteEntry";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import { BERElement } from "asn1-ts";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
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
import getDistinguishedName from "../x500/getDistinguishedName";
import updateSubordinate from "../dop/updateSubordinate";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import findEntry from "../x500/findEntry";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import terminateByTypeAndBindingID from "../dop/terminateByTypeAndBindingID";
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
    PERMISSION_CATEGORY_REMOVE,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_removeEntry,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-removeEntry.va";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER } from "asn1-ts/dist/node/functional";
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

// TODO: subentries

export
async function removeEntry (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const target = state.foundDSE;
    const argument = _decode_RemoveEntryArgument(state.operationArgument);
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
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    if (accessControlScheme) {
        const AC_SCHEME: string = accessControlScheme.toString();
        const relevantACIItems = [
            ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
                ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                : []),
            ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                ? (target.dse.entryACI ?? [])
                : []),
        ];
        const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
        const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
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
        const {
            authorized: authorizedToRemoveEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_REMOVE,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorizedToRemoveEntry) {
            throw new errors.SecurityError(
                "Not permitted to remove entry.",
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

    checkTimeLimit();
    if (target.dse.subentry) { // Go to step 5.
        // 1. Remove the subentry.
        // 2. Modify the operational bindings of all relevant subordinate DSAs.
        // - a. Get the DN administrative point
        // - b. Query the database for all active HOBs where local DSA is superior
        //      and admin point is a prefix of immediate_superior. Include the access point (ber).
        // - c. Issue a modify OB operation to all relevant access points.
        // 3. Continue at step 7.
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
    } else if (target.dse.cp) { // Go to step 6.
        // 1. Remove the naming context.
        // 2. Terminate the HOB, if applicable.
        // - a. Query the database for all active HOBs where local DSA is subordinate
        //      and immediate_superior + rdn === this entry. Include the access point (ber).
        // - c. Issue a terminate OB operation to all relevant access points.
        const targetDN = getDistinguishedName(target);
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
                terminateByTypeAndBindingID(
                    ctx,
                    accessPoint,
                    id_op_binding_hierarchical,
                    bindingID,
                )
                    .catch((e) => {
                        ctx.log.warn(`Failed to terminate HOB for agreement ${bindingID.identifier} (version ${bindingID.version}). ${e}`);
                    });
            } catch (e) {
                ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}).`);
                continue;
            }
        }
    } else if (target.dse.entry || target.dse.alias) { // Go to step 4.
        // 1. Remove the entry or alias entry.
        // 2. Continue at step 7.
    } else { // See Section 6.
        // TODO: It is not clear what "Section 6" refers to.
    }
    // TODO: Step 7: Update shadows.
    await deleteEntry(ctx, target);

    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        id_opcode_removeEntry,
                    ),
                    undefined,
                ),
                _encode_RemoveEntryResult({
                    null_: null,
                }, DER),
            ),
        },
        stats: {
            request: {
                operationCode: codeToString(id_opcode_removeEntry),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
            },
        },
    };
}

export default removeEntry;

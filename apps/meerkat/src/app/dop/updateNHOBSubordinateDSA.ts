import { Vertex } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { bindForOBM } from "../net/bindToOtherDSA";
import {
    modifyOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/modifyOperationalBinding.oa";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    SuperiorToSubordinate as SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    MasterAndShadowAccessPoints,
    Vertex as X500Vertex,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubentryInfo.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import readSubordinates from "../dit/readSubordinates";
import readAttributes from "../database/entry/readAttributes";
import admPointEIS from "./admPointEIS";
import subentryEIS from "./subentryEIS";
import createSecurityParameters from "../x500/createSecurityParameters";
import { BER, DER } from "asn1-ts/dist/node/functional";
import {
    NonSpecificHierarchicalAgreement,
    _encode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import { getEntryAttributesToShareInOpBinding } from "../dit/getEntryAttributesToShareInOpBinding";
import stringifyDN from "../x500/stringifyDN";
import { Prisma, OperationalBindingInitiator } from "@prisma/client";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import { _encode_SuperiorToSubordinateModification } from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import { compareCode, getOptionallyProtectedValue } from "@wildboar/x500";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { operationalBindingError } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import printCode from "../utils/printCode";
import { verifySIGNED } from "../pki/verifySIGNED";
import {
    _encode_ModifyOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResultData.ta";
import { _encode_SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import printInvokeId from "../utils/printInvokeId";

/**
 * @summary Updates a subordinate DSA of changes that may affect an NHOB
 * @description
 *
 * This function sends an update to a subordinate DSA whose agreement with this
 * DSA may be impacted by recent changes to a local DSE.
 *
 * @param ctx The context object
 * @param nhob_id The internal database ID of the NHOB
 * @param currentBindingID The most binding ID whereby the subordinate is updated
 * @param immediateSuperior The immediate superior vertex
 * @param immediateSuperiorInfo Attributes of the immediate superior that are to
 *  be disclosed to the subordinate
 * @param targetSystem The remote DSA that is being updated
 * @param aliasDereferenced Whether an alias was dereferenced leading up to this
 * @returns A tuple with the first element being the
 *
 * @function
 * @async
 */
export
async function updateNHOBSubordinateDSA (
    ctx: MeerkatContext,
    nhob_id: number,
    currentBindingID: OperationalBindingID,
    immediateSuperior: Vertex,
    targetSystem: AccessPoint,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<void> {
    const immediateSuperiorDN = getDistinguishedName(immediateSuperior);
    const cp = immediateSuperiorDN;
    const ap = stringifyDN(ctx, targetSystem.ae_title.rdnSequence);
    const logInfo = {
        obid: nhob_id,
        ob_identifier: Number(currentBindingID.identifier),
        ob_version: Number(currentBindingID.version),
        ob_type: id_op_binding_non_specific_hierarchical.toString(),
        cp,
        ap,
        aliasDereferenced,
        signErrors,
    };
    ctx.log.info(ctx.i18n.t("log:updating_subordinate", {
        context: "nssr",
        ae_title: stringifyDN(ctx, targetSystem.ae_title.rdnSequence),
        obid: currentBindingID.identifier.toString(),
    }), logInfo);
    const assn = await bindForOBM(ctx, undefined, undefined, targetSystem, aliasDereferenced, signErrors);
    if (!assn) {
        ctx.log.error(ctx.i18n.t("err:could_not_connect"), logInfo);
        return;
    }
    const ditContext: X500Vertex[] = []; // To be reversed.
    let cpEncountered: boolean = false;
    let current: Vertex | undefined = immediateSuperior;
    while (current && current.immediateSuperior) {
        const admPointAttributes: Attribute[] = [];
        const subentryInfos: SubentryInfo[] = [];
        const accessPoints: MasterAndShadowAccessPoints = [];
        if (!cpEncountered && current.dse.cp) {
            cpEncountered = true;
        }

        if (current.dse.admPoint) {
            const {
                userAttributes,
                operationalAttributes,
            } = await readAttributes(ctx, current, {
                selection: admPointEIS,
            });
            admPointAttributes.push(
                ...userAttributes,
                ...operationalAttributes,
            );

            const subordinates = await readSubordinates(ctx, current, undefined, undefined, undefined, {
                subentry: true,
            });
            subentryInfos.push(
                ...await Promise.all(
                    subordinates
                        .filter((sub) => sub.dse.subentry)
                        .map(async (sub): Promise<SubentryInfo> => {
                            const {
                                userAttributes,
                                operationalAttributes,
                            } = await readAttributes(ctx, sub, {
                                selection: subentryEIS,
                            });
                            return new SubentryInfo(
                                sub.dse.rdn,
                                [
                                    ...userAttributes,
                                    ...operationalAttributes,
                                ],
                            );
                        }),
                ),
            );
        }

        ditContext.push(new X500Vertex(
            current.dse.rdn,
            (admPointAttributes.length > 0)
                ? admPointAttributes
                : undefined,
            (subentryInfos.length > 0)
                ? subentryInfos
                : undefined,
            (accessPoints.length > 0)
                ? accessPoints
                : undefined,
        ));
        current = current.immediateSuperior;
    }
    const sup2sub = new SuperiorToSubordinateModification(
        ditContext.reverse(),
        undefined, // entryInfo is ABSENT in SuperiorToSubordinateModification
        await getEntryAttributesToShareInOpBinding(ctx, immediateSuperior),
    );
    const agreement = new NonSpecificHierarchicalAgreement(
        getDistinguishedName(immediateSuperior),
    );
    const agr_element = _encode_NonSpecificHierarchicalAgreement(agreement, DER);

    const previous_ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id: nhob_id,
        },
        select: {
            terminated_time: true,
            access_point_id: true,
        },
    });
    if (!previous_ob) {
        // This should basically never happen.
        throw new Error("f7d19fdf-0eb2-44f9-bf7d-0e170c36c0dd");
    }
    if (!previous_ob.access_point_id) {
        // This is more plausible, but it is still a bug if it happens.
        throw new Error("f323a12d-92e6-49e3-9e10-50302c58639e");
    }
    const ob_db_data: Prisma.OperationalBindingCreateInput = {
        // previous: {
        //     connect: {
        //         id: nhob_id,
        //     },
        // },
        outbound: true,
        binding_type: id_op_binding_non_specific_hierarchical.toString(),
        binding_identifier: Number(currentBindingID.identifier),
        binding_version: Number(currentBindingID.version) + 1,
        agreement_ber: Buffer.from(agr_element.toBytes().buffer),
        initiator: OperationalBindingInitiator.ROLE_A,
        initiator_ber: Buffer.from(_encode_SuperiorToSubordinateModification(sup2sub, BER).toBytes()),
        access_point: {
            connect: {
                id: previous_ob.access_point_id,
            },
        },
        validity_start: new Date(),
        validity_end: previous_ob.terminated_time,
        supply_contexts: null,
        requested_time: new Date(),
    };
    const new_ob = await ctx.db.operationalBinding.create({
        data: ob_db_data,
        select: {
            id: true,
            uuid: true,
            binding_identifier: true,
        },
    });

    const response = await assn.modifyNHOBWithSubordinate({
        bindingID: currentBindingID,
        accessPoint: ctx.dsa.accessPoint,
        initiator: sup2sub,
        securityParameters: createSecurityParameters(
            ctx,
            true,
            targetSystem.ae_title.rdnSequence,
            modifyOperationalBinding["&operationCode"],
        ),
        newAgreement: agreement,
        cert_path: ctx.config.signing.certPath,
        key: ctx.config.signing.key,
    });

    if (!("result" in response)) {
        await ctx.db.operationalBinding.update({
            where: {
                id: new_ob.id,
            },
            data: {
                accepted: false,
            },
            select: {
                id: true,
            },
        });
        ctx.log.warn(ctx.i18n.t("log:failed_to_update_nhob", {
            obid: currentBindingID.identifier.toString(),
            version: currentBindingID.version.toString(),
            e: JSON.stringify(response),
        }), logInfo);
    }

    if ("result" in response) {
        let newBindingID = new OperationalBindingID(
            currentBindingID.identifier,
            Number(currentBindingID.version) + 1,
        )
        if ("protected_" in response.result.parameter) {
            const param = response.result.parameter.protected_;
            const resultData = getOptionallyProtectedValue(param);
            if (!resultData.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
                ctx.log.error(ctx.i18n.t("log:ob_result_mismatch_type", {
                    iid: printInvokeId(response.result.invoke_id),
                    requested: id_op_binding_non_specific_hierarchical.toString(),
                    returned: resultData.bindingType.toString(),
                }), logInfo);
                return;
            }
            if (Number(resultData.newBindingID.identifier) === Number(currentBindingID.identifier)) {
                ctx.log.error(ctx.i18n.t("log:ob_result_mismatch_id", {
                    iid: printInvokeId(response.result.invoke_id),
                    requested: currentBindingID.identifier.toString(),
                    returned: resultData.newBindingID.identifier.toString(),
                }), logInfo);
                return;
            }
            if (Number(resultData.newBindingID.version) < Number(currentBindingID.version)) {
                ctx.log.error(ctx.i18n.t("log:ob_result_lesser_version", {
                    iid: printInvokeId(response.result.invoke_id),
                    requested: currentBindingID.version.toString(),
                    returned: resultData.newBindingID.version.toString(),
                }), logInfo);
                return;
            }
            const sp = resultData.securityParameters;
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        sp?.certification_path,
                        {
                            absent: null,
                        },
                        false,
                        param.signed,
                        _encode_ModifyOperationalBindingResultData,
                        signErrors,
                    );
                } catch (e) {
                    ctx.log.error(ctx.i18n.t("log:invalid_signature", {
                        context: "result",
                        iid: response.result.invoke_id.toString().slice(0, 32),
                        ap: stringifyDN(ctx, targetSystem.ae_title.rdnSequence),
                    }), logInfo);
                    return;
                }
            }
            newBindingID = resultData.newBindingID;
        }
        await ctx.db.operationalBinding.update({
            where: {
                id: new_ob.id,
            },
            data: {
                accepted: true,
                binding_version: Number(newBindingID.version),
                /**
                 * Previous is not set until the update succeeds,
                 * because `getRelevantOperationalBindings`
                 * determines which is the latest of all versions of
                 * a given operational binding based on which
                 * operational binding has no "previous"es that
                 * point to it.
                 */
                previous: {
                    connect: {
                        id: nhob_id,
                    },
                },
            },
            select: {
                id: true,
            },
        });
    }
    else if ("error" in response) {
        if (compareCode(response.error.code, securityError["&errorCode"]!)) {
            const param = securityError.decoderFor["&ParameterType"]!(response.error.parameter);
            const data = getOptionallyProtectedValue(param);
            ctx.log.error(ctx.i18n.t("log:received_securityError", {
                iid: printInvokeId(response.error.invoke_id),
                problem: data.problem.toString(),
            }), logInfo);
            const sp = data.securityParameters;
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        sp?.certification_path,
                        {
                            absent: null,
                        },
                        false,
                        param.signed,
                        _encode_SecurityErrorData,
                        signErrors,
                    );
                } catch (e) {
                    ctx.log.error(ctx.i18n.t("log:invalid_signature", {
                        context: "result",
                        iid: response.error.invoke_id.toString().slice(0, 32),
                        ap: stringifyDN(ctx, targetSystem.ae_title.rdnSequence),
                    }));
                }
            }
        }
        else if (compareCode(response.error.code, operationalBindingError["&errorCode"]!)) {
            const param = operationalBindingError.decoderFor["&ParameterType"]!(response.error.parameter);
            const data = getOptionallyProtectedValue(param);
            ctx.log.error(ctx.i18n.t("log:received_operationalBindingError", {
                iid: printInvokeId(response.error.invoke_id),
                problem: data.problem.toString(),
            }), logInfo);
        }
        else {
            ctx.log.error(ctx.i18n.t("log:received_other_error", {
                iid: printInvokeId(response.error.invoke_id),
                code: printCode(response.error.code),
                param: Buffer.from(response.error.parameter.toBytes()).subarray(0, 4096).toString("hex"),
            }), logInfo);
        }
    }
    else if ("reject" in response) {
        ctx.log.error(ctx.i18n.t("log:received_reject", {
            iid: printInvokeId(response.reject.invoke_id),
            reason: response.reject.problem.toString(),
        }), logInfo);
    }
    else if ("abort" in response) {
        ctx.log.error(ctx.i18n.t("log:received_abort", {
            reason: response.abort.toString(),
        }), logInfo);
    }
    else {
        ctx.log.error(ctx.i18n.t("log:received_other_problem", {
            problem: response,
        }), logInfo);
    }
    assn.unbind().catch(); // INTENTIONAL NO AWAIT
}

export default updateNHOBSubordinateDSA;

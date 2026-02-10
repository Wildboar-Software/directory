import { Buffer } from "node:buffer";
import { Vertex } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import type {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import { bindForOBM } from "../net/bindToOtherDSA.js";
import {
    modifyOperationalBinding,
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    SuperiorToSubordinate as SuperiorToSubordinateModification,
    Vertex as X500Vertex,
    SubentryInfo,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/DistributedOperations";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import readSubordinates from "../dit/readSubordinates.js";
import readAttributes from "../database/entry/readAttributes.js";
import admPointEIS from "./admPointEIS.js";
import subentryEIS from "./subentryEIS.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import { BER, DER } from "@wildboar/asn1/functional";
import { getEntryAttributesToShareInOpBinding } from "../dit/getEntryAttributesToShareInOpBinding.js";
import stringifyDN from "../x500/stringifyDN.js";
import { OperationalBindingInitiator } from "../generated/client.js";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { _encode_SuperiorToSubordinateModification } from "@wildboar/x500/HierarchicalOperationalBindings";
import { compareCode, getOptionallyProtectedValue } from "@wildboar/x500";
import { securityError } from "@wildboar/x500/DirectoryAbstractService";
import { operationalBindingError } from "@wildboar/x500/OperationalBindingManagement";
import printCode from "../utils/printCode.js";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import {
    _encode_ModifyOperationalBindingResultData,
} from "@wildboar/x500/OperationalBindingManagement";
import { _encode_SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/InformationFramework";
import printInvokeId from "../utils/printInvokeId.js";

/**
 * @summary Updates a subordinate DSA of changes that may affect a hierarchical operational binding
 * @description
 *
 * This function sends an update to a subordinate DSA whose agreement with this
 * DSA may be impacted by recent changes to a local DSE.
 *
 * @param ctx The context object
 * @param hob_id The internal database ID of the HOB
 * @param currentBindingID The most binding ID whereby the subordinate is updated
 * @param immediateSuperior The immediate superior vertex
 * @param subordinateRDN The RDN of the subordinate entry in the HOB
 * @param targetSystem The remote DSA that is being updated
 * @param aliasDereferenced Whether an alias was dereferenced leading up to this
 * @returns A tuple with the first element being the
 *
 * @function
 * @async
 */
export
async function updateHOBSubordinateDSA (
    ctx: MeerkatContext,
    hob_id: number,
    currentBindingID: OperationalBindingID,
    immediateSuperior: Vertex,
    subordinateRDN: RDN,
    targetSystem: AccessPoint,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<void> {
    const immediateSuperiorDN = getDistinguishedName(immediateSuperior);
    const cp = [ ...immediateSuperiorDN, subordinateRDN ];
    const ap = stringifyDN(ctx, targetSystem.ae_title.rdnSequence);
    const logInfo = {
        obid: hob_id,
        ob_identifier: Number(currentBindingID.identifier),
        ob_version: Number(currentBindingID.version),
        ob_type: id_op_binding_hierarchical.toString(),
        cp,
        ap,
        aliasDereferenced,
        signErrors,
    };
    ctx.log.info(ctx.i18n.t("log:updating_subordinate", {
        context: "hob",
        ae_title: ap,
        obid: currentBindingID.identifier.toString(),
    }), logInfo);
    const assn = await bindForOBM(ctx, undefined, undefined, targetSystem, aliasDereferenced, signErrors);
    if (!assn) {
        ctx.log.error(ctx.i18n.t("err:could_not_connect"));
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
    const agreement = new HierarchicalAgreement(
        subordinateRDN,
        immediateSuperiorDN,
    );
    const agr_element = _encode_HierarchicalAgreement(agreement, DER);

    const previous_ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id: hob_id,
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
    const ob_db_data = {
        previous: {
            connect: {
                id: hob_id,
            },
        },
        outbound: true,
        binding_type: id_op_binding_hierarchical.toString(),
        binding_identifier: Number(currentBindingID.identifier),
        binding_version: Number(currentBindingID.version) + 1,
        agreement_ber: agr_element.toBytes(),
        initiator: OperationalBindingInitiator.ROLE_A,
        initiator_ber: _encode_SuperiorToSubordinateModification(sup2sub, BER).toBytes(),
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

    const response = await assn.modifyHOBWithSubordinate({
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
        ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
            obid: currentBindingID.identifier.toString(),
            version: currentBindingID.version.toString(),
            e: JSON.stringify(response),
        }), logInfo);
    }

    if ("result" in response) {
        let newBindingID = new OperationalBindingID(
            currentBindingID.identifier,
            Number(currentBindingID.version) + 1,
        );
        if ("protected_" in response.result.parameter) {
            const param = response.result.parameter.protected_;
            const resultData = getOptionallyProtectedValue(param);
            if (!resultData.bindingType.isEqualTo(id_op_binding_hierarchical)) {
                ctx.log.error(ctx.i18n.t("log:ob_result_mismatch_type", {
                    iid: printInvokeId(response.result.invoke_id),
                    requested: id_op_binding_hierarchical.toString(),
                    returned: resultData.bindingType.toString(),
                }), logInfo);
                return;
            }
            if (Number(resultData.newBindingID.identifier) !== Number(currentBindingID.identifier)) {
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
                        id: hob_id,
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
                    }), logInfo);
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
    assn
        .unbind() // INTENTIONAL NO AWAIT
        .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_unbind"), e));
}

export default updateHOBSubordinateDSA;

import type { MeerkatContext } from "../../ctx";
import * as errors from "@wildboar/meerkat-types";
import DOPAssociation from "../DOPConnection";
import { INTEGER, FALSE, unpackBits } from "asn1-ts";
import type {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import type {
    EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import type {
    EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import {
    EstablishOperationalBindingResultData,
    _encode_EstablishOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResultData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidAgreement,
    OpBindingErrorParam_problem_invalidStartTime,
    OpBindingErrorParam_problem_invalidEndTime,
    OpBindingErrorParam_problem_duplicateID,
    OpBindingErrorParam_problem_currentlyNotDecidable,
    OpBindingErrorParam_problem_parametersMissing,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinate,
    _decode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import { ASN1Element, packBits } from "asn1-ts";
import becomeSubordinate from "../establish/becomeSubordinate";
import { OperationalBindingInitiator, Knowledge } from "@prisma/client";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import rdnToJson from "../../x500/rdnToJson";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { DER } from "asn1-ts/dist/node/functional";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import {
    id_op_establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-op-establishOperationalBinding.va";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import saveAccessPoint from "../../database/saveAccessPoint";
import {
    _encode_AttributeCertificationPath as _encode_ACP,
} from "@wildboar/x500/src/lib/modules/AttributeCertificateDefinitions/AttributeCertificationPath.ta";
import {
    _encode_Token,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Token.ta";
import { getDateFromOBTime } from "../getDateFromOBTime";
import { printInvokeId } from "../../utils/printInvokeId";
import { validateEntry, ValidateEntryReturn } from "../../x500/validateNewEntry";
import { randomInt } from "crypto";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import { generateSignature } from "../../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";

// TODO: Use printCode()
function codeToString (code?: Code): string | undefined {
    return (code
        ? ("global" in code)
            ? code.global.toString()
            : ("local" in code)
                ? code.local.toString()
                : undefined
        : undefined);
}

/**
 * @summary Establishes an operational binding, as described in ITU Recommendation X.501.
 * @description
 *
 * This function implements the `establishOperationalBinding` operation
 * described in ITU Recommendation X.501 (2016), Section 28.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the operation
 * @param arg The `EstablishOperationalBindingArgument` argument
 * @returns The `EstablishOperationalBindingResult` result
 *
 * @function
 * @async
 */
export
async function establishOperationalBinding (
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: INTEGER,
    arg: EstablishOperationalBindingArgument,
): Promise<EstablishOperationalBindingResult> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const data: EstablishOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // DOP associations are ALWAYS authorized to receive signed responses.
    const signResult: boolean = (data.securityParameters?.target === ProtectionRequest_signed);
    const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId({ present: invokeId }),
    };
    ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
        context: "started",
        type: data.bindingType.toString(),
        bid: data.bindingID?.identifier.toString(),
        aid: assn.id,
    }), logInfo);
    /**
     * @summary Wait for approval of a proposed operational binding
     * @description
     *
     * This function waits for the manual or automated approval of a proposed
     * operational binding. It also times out if no decision is made within a
     * defined time limit.
     *
     * @param uuid The UUID of the operation binding whose approval is sought.
     * @returns A promise resolving a boolean indicating whether the operational
     *  binding was accepted or rejected, or `undefined` if the decision timed
     *  out.
     *
     * @function
     */
    const getApproval = (uuid: string): Promise<boolean | undefined> => Promise.race<boolean | undefined>([
        new Promise<boolean>((resolve) => {
            ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                resolve(approved);
            });
        }),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 300_000)),
        new Promise<boolean>((resolve) => {
            if (ctx.config.ob.autoAccept) {
                ctx.log.info(ctx.i18n.t("log:auto_accepted_ob", {
                    type: data.bindingType.toString(),
                    obid: data.bindingID?.identifier.toString(),
                    uuid,
                }), {
                    type: data.bindingType.toString(),
                    obid: data.bindingID?.identifier.toString(),
                    uuid,
                });
                resolve(true);
            }
        }),
    ]);

    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        ctx.i18n.t("err:ob_type_unrecognized", {
            obtype: data.bindingType.toString(),
        }),
        new OpBindingErrorParam(
            OpBindingErrorParam_problem_unsupportedBindingType,
            data.bindingType,
            undefined,
            undefined,
            [],
            createSecurityParameters(
                ctx,
                signErrors,
                assn.boundNameAndUID?.dn,
                undefined,
                id_err_operationalBindingError,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            undefined,
            undefined,
        ),
        signErrors,
    );

    if (data.valid?.validFrom instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_start_time_syntax"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidStartTime,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    if (data.valid?.validUntil instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_end_time_syntax"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidEndTime,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    const now = new Date();
    const validFrom = (data.valid?.validFrom && ("time" in data.valid.validFrom))
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil = (data.valid?.validUntil && ("time" in data.valid.validUntil))
        ? getDateFromOBTime(data.valid.validUntil.time)
        : undefined;

    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinate = _decode_SuperiorToSubordinate(data.initiator.roleA_initiates);
            if (!init.entryInfo?.length) {
                /**
                 * Technically, a HOB allows the subordinate DSA to establish
                 * at creation time what the new context prefix DSE will be
                 * entirely. This makes logical sense, since the subordinate DSA
                 * "owns" this entry. However, it is not a good idea to do this
                 * because the subordinate DSA basically has no information as
                 * to what is to be created! So Meerkat DSA will simply reject
                 * all "blank checks" received to create a new context prefix.
                 */
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:superior_must_specify_entryInfo"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_parametersMissing,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                init.contextPrefixInfo.map((rdn) => rdn.rdn),
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }

            let structuralObjectClass!: ValidateEntryReturn["structuralObjectClass"];
            let governingStructureRule: ValidateEntryReturn["governingStructureRule"] | undefined;
            try {
                const {
                    structuralObjectClass: soc,
                    governingStructureRule: gsr,
                } = await validateEntry(
                    ctx,
                    assn,
                    undefined,
                    [ ...agreement.immediateSuperior, agreement.rdn ],
                    agreement.rdn,
                    init.entryInfo,
                    FALSE,
                    FALSE,
                    {
                        present: invokeId,
                    },
                    false,
                    signErrors,
                );
                structuralObjectClass = soc;
                governingStructureRule = gsr;
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:hob_invalid_entryInfo", { e }), logInfo);
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_invalid_entryInfo", { e }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }

            const sp = data.securityParameters;
            let newBindingIdentifier!: number;
            if (
                typeof data.bindingID?.identifier === "number"
                || (typeof data.bindingID?.identifier === "bigint")
            ) {
                const now = new Date();
                const alreadyTakenBindingID = await ctx.db.operationalBinding.findFirst({
                    where: {
                        /**
                         * This is a hack for getting the latest version: we are selecting
                         * operational bindings that have no next version.
                         */
                        next_version: {
                            none: {},
                        },
                        binding_type: id_op_binding_hierarchical.toString(),
                        binding_identifier: Number(data.bindingID.identifier),
                        accepted: true,
                        terminated_time: null,
                        validity_start: {
                            lte: now,
                        },
                        OR: [
                            {
                                validity_end: null,
                            },
                            {
                                validity_end: {
                                    gte: now,
                                },
                            },
                        ],
                    },
                    select: {
                        uuid: true,
                    },
                });
                if (alreadyTakenBindingID) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:ob_duplicate_identifier", {
                            id: data.bindingID.identifier,
                        }),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_duplicateID,
                            id_op_binding_hierarchical,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                        signErrors,
                    );
                } else {
                    newBindingIdentifier = Number(data.bindingID.identifier);
                }
            } else if (typeof data.bindingID?.identifier === "undefined") {
                newBindingIdentifier = randomInt(2147483648);
                // TODO: Loop until you find an available ID.
            }

            const access_point_id = await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST);
            const bindingID = new OperationalBindingID(
                newBindingIdentifier,
                0,
            );
            const created = await ctx.db.operationalBinding.create({
                data: {
                    outbound: false,
                    binding_type: data.bindingType.toString(),
                    binding_identifier: Number(bindingID.identifier),
                    binding_version: Number(bindingID.version),
                    agreement_ber: Buffer.from(data.agreement.toBytes().buffer),
                    access_point: {
                        connect: {
                            id: access_point_id,
                        },
                    },
                    initiator: OperationalBindingInitiator.ROLE_A,
                    initiator_ber: Buffer.from(data.initiator.roleA_initiates.toBytes()),
                    validity_start: validFrom,
                    validity_end: validUntil,
                    security_certification_path: sp?.certification_path
                        ? Buffer.from(_encode_CertificationPath(sp.certification_path, DER).toBytes().buffer)
                        : undefined,
                    security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
                    security_time: sp?.time
                        ? getDateFromTime(sp.time)
                        : undefined,
                    security_random: sp?.random
                        ? Buffer.from(packBits(sp.random).buffer)
                        : undefined,
                    security_target: (sp?.target !== undefined)
                        ? Number(sp.target)
                        : undefined,
                    security_operationCode: codeToString(sp?.operationCode),
                    security_errorProtection: (sp?.errorProtection !== undefined)
                        ? Number(sp.errorProtection)
                        : undefined,
                    security_errorCode: codeToString(sp?.errorCode),
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                    source_ip: assn.socket.remoteAddress,
                    source_tcp_port: assn.socket.remotePort,
                    source_credentials_type: ((): number | null => {
                        if (!assn.bind) {
                            return null;
                        }
                        if (!assn.bind.credentials) {
                            return null;
                        }
                        if ("simple" in assn.bind.credentials) {
                            return 0;
                        }
                        if ("strong" in assn.bind.credentials) {
                            return 1;
                        }
                        if ("external" in assn.bind.credentials) {
                            return 2;
                        }
                        if ("spkm" in assn.bind.credentials) {
                            return 3;
                        }
                        return 4;
                    })(),
                    source_certificate_path: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                        && assn.bind.credentials.strong.certification_path
                    )
                        ? Buffer.from(_encode_CertificationPath(assn.bind.credentials.strong.certification_path, DER).toBytes().buffer)
                        : undefined,
                    source_attr_cert_path: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                        && assn.bind.credentials.strong.attributeCertificationPath
                    )
                        ? Buffer.from(_encode_ACP(assn.bind.credentials.strong.attributeCertificationPath, DER).toBytes().buffer)
                        : undefined,
                    source_bind_token: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                    )
                        ? Buffer.from(_encode_Token(assn.bind.credentials.strong.bind_token, DER).toBytes().buffer)
                        : undefined,
                    source_strong_name: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                        && assn.bind.credentials.strong.name
                    )
                        ? assn.bind.credentials.strong.name.map(rdnToJson)
                        : undefined,
                    supply_contexts: null,
                    requested_time: new Date(),
                },
                select: {
                    uuid: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved,
                },
                select: null,
            });
            if (approved === undefined) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        context: "timeout",
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_currentlyNotDecidable,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            } else if (approved === false) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected", {
                        uuid: created.uuid,
                    }),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                const reply = await becomeSubordinate(
                    ctx,
                    data.accessPoint,
                    agreement,
                    init,
                    structuralObjectClass,
                    governingStructureRule,
                    signErrors,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: data.bindingID?.identifier.toString(),
                    aid: assn.id,
                }), {
                    remoteFamily: assn.socket.remoteFamily,
                    remoteAddress: assn.socket.remoteAddress,
                    remotePort: assn.socket.remotePort,
                    association_id: assn.id,
                    invokeID: printInvokeId({ present: invokeId }),
                });
                const resultData = new EstablishOperationalBindingResultData(
                    data.bindingType,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SubordinateToSuperior(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        signResult,
                        assn.boundNameAndUID?.dn,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                );
                if (!signResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const resultDataBytes = _encode_EstablishOperationalBindingResultData(resultData, DER).toBytes();
                const key = ctx.config.signing?.key;
                if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                    return {
                        unsigned: resultData,
                    };
                }
                const signingResult = generateSignature(key, resultDataBytes);
                if (!signingResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const [ sigAlg, sigValue ] = signingResult;
                return {
                    signed: new SIGNED(
                        resultData,
                        sigAlg,
                        unpackBits(sigValue),
                        undefined,
                        undefined,
                    ),
                };
            } catch (e) {
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: null,
                    }).then().catch();
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: null,
                    }).then().catch();
                }
                throw e;
            }
        } else if ("roleB_initiates" in data.initiator) {
            throw NOT_SUPPORTED_ERROR;
            // TODO: Get approval.
            // const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            // const reply = await becomeSuperior(ctx, assn, invokeId, agreement, init);
            // return {
            //     unsigned: new EstablishOperationalBindingResultData(
            //         data.bindingType,
            //         data.bindingID,
            //         ctx.dsa.accessPoint,
            //         {
            //             roleA_replies: _encode_SuperiorToSubordinate(reply, DER),
            //         },
            //         [],
            //         createSecurityParameters(
            //             ctx,
            //             undefined,
            //             id_op_establishOperationalBinding,
            //         ),
            //         ctx.dsa.accessPoint.ae_title.rdnSequence,
            //         undefined,
            //         undefined,
            //     ),
            // };
        } else {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:unrecognized_ob_initiator_syntax"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidAgreement,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        throw NOT_SUPPORTED_ERROR;
    } else if (data.bindingType.isEqualTo(id_op_binding_shadow)) {
        throw NOT_SUPPORTED_ERROR;
    } else {
        throw NOT_SUPPORTED_ERROR;
    }
}

export default establishOperationalBinding;

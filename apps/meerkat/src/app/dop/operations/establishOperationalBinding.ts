import type { MeerkatContext } from "../../ctx";
import * as errors from "@wildboar/meerkat-types";
import DOPAssociation from "../DOPConnection";
import type { INTEGER } from "asn1-ts";
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
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinate,
    _decode_SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
    _decode_SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import { ASN1Element, packBits } from "asn1-ts";
import becomeSubordinate from "../establish/becomeSubordinate";
import becomeSuperior from "../establish/becomeSuperior";
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

function getDateFromOBTime (time: Time): Date {
    if ("utcTime" in time) {
        return time.utcTime;
    } else {
        return time.generalizedTime;
    }
}

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
    const getApproval = (uuid: string): Promise<boolean> => Promise.race<boolean>([
        new Promise<boolean>((resolve) => {
            ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                resolve(approved);
            });
        }),
        new Promise<boolean>(resolve => setTimeout(() => resolve(false), 300000)),
    ]);

    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        `Operational binding type ${data.bindingType.toString()} not understood.`,
        {
            unsigned: new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        },
    );

    if (data.valid?.validFrom instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_start_time_syntax"),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidStartTime,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }
    if (data.valid?.validUntil instanceof ASN1Element) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:unrecognized_ob_end_time_syntax"),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidEndTime,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
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
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                init.contextPrefixInfo.map((rdn) => rdn.rdn),
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match"),
                    {
                        unsigned: new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                undefined,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            const reply = await becomeSubordinate(ctx, data.accessPoint, agreement, init);
            const sp = data.securityParameters;
            const now = new Date();
            const alreadyTakenBindingIDs = new Set(
                (await ctx.db.operationalBinding.findMany({
                    where: {
                        binding_type: id_op_binding_hierarchical.toString(),
                        validity_start: {
                            gte: now,
                        },
                        validity_end: {
                            lte: now,
                        },
                    },
                    select: {
                        binding_identifier: true,
                    },
                }))
                    .map((ob) => ob.binding_identifier),
            );
            let newBindingIdentifier!: number;
            if (
                typeof data.bindingID?.identifier === "number"
                || (typeof data.bindingID?.identifier === "bigint")
            ) {
                if (alreadyTakenBindingIDs.has(Number(data.bindingID.identifier))) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:ob_duplicate_identifier", {
                            id: data.bindingID.identifier,
                        }),
                        {
                            unsigned: new OpBindingErrorParam(
                                OpBindingErrorParam_problem_duplicateID,
                                id_op_binding_hierarchical,
                                undefined,
                                undefined,
                                [],
                                createSecurityParameters(
                                    ctx,
                                    assn.boundNameAndUID?.dn,
                                    undefined,
                                    id_err_operationalBindingError,
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                false,
                                undefined,
                            ),
                        },
                    );
                } else {
                    newBindingIdentifier = Number(data.bindingID.identifier);
                }
            } else if (typeof data.bindingID?.identifier === "undefined") {
                let attemptedID: number = 0;
                while (alreadyTakenBindingIDs.has(attemptedID)) {
                    attemptedID++;
                }
                newBindingIdentifier = attemptedID;
            }

            const access_point_id = await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST);
            const created = await ctx.db.operationalBinding.create({
                data: {
                    outbound: false,
                    binding_type: data.bindingType.toString(),
                    binding_identifier: newBindingIdentifier,
                    binding_version: (data.bindingID?.version !== undefined)
                        ? Number(data.bindingID.version)
                        : 0,
                    agreement_ber: Buffer.from(data.agreement.toBytes()),
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
                        ? Buffer.from(_encode_CertificationPath(sp.certification_path, DER).toBytes())
                        : undefined,
                    security_name: sp?.name?.map((rdn) => rdnToJson(rdn)),
                    security_time: sp?.time
                        ? getDateFromTime(sp.time)
                        : undefined,
                    security_random: sp?.random
                        ? Buffer.from(packBits(sp.random))
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
                        ? Buffer.from(_encode_CertificationPath(assn.bind.credentials.strong.certification_path, DER).toBytes())
                        : undefined,
                    source_attr_cert_path: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                        && assn.bind.credentials.strong.attributeCertificationPath
                    )
                        ? Buffer.from(_encode_ACP(assn.bind.credentials.strong.attributeCertificationPath, DER).toBytes())
                        : undefined,
                    source_bind_token: (
                        assn.bind?.credentials
                        && ("strong" in assn.bind.credentials)
                    )
                        ? Buffer.from(_encode_Token(assn.bind.credentials.strong.bind_token, DER).toBytes())
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
            });
            const approved: boolean = await getApproval(created.uuid);
            if (!approved) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:ob_rejected"),
                    {
                        unsigned: new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            data.bindingType,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                undefined,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                    },
                );
            }
            return {
                unsigned: new EstablishOperationalBindingResultData(
                    data.bindingType,
                    data.bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_replies: _encode_SubordinateToSuperior(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            };
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            const reply = await becomeSuperior(ctx, assn, invokeId, agreement, init);
            return {
                unsigned: new EstablishOperationalBindingResultData(
                    data.bindingType,
                    data.bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleA_replies: _encode_SuperiorToSubordinate(reply, DER),
                    },
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        id_op_establishOperationalBinding,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            };
        } else {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:unrecognized_ob_initiator_syntax"),
                {
                    unsigned: new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        data.bindingType,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            undefined,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                },
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

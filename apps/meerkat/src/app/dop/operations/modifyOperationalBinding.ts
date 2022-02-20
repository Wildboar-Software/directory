import { Context, OperationalBindingError } from "@wildboar/meerkat-types";
import type DOPAssociation from "../DOPConnection";
import * as errors from "@wildboar/meerkat-types";
import type {
    ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
import type {
    ModifyOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
import type {
    ModifyOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResult.ta";
import type {
    ModifyOperationalBindingArgumentData_initiator as Initiator,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData-initiator.ta";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidID,
    OpBindingErrorParam_problem_invalidAgreement,
    OpBindingErrorParam_problem_roleAssignment,
    OpBindingErrorParam_problem_duplicateID,
    OpBindingErrorParam_problem_invalidNewID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    _decode_PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { ASN1Element, BERElement, packBits } from "asn1-ts";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import compareSocketToNSAP from "@wildboar/x500/src/lib/distributed/compareSocketToNSAP";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    _encode_CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import rdnToJson from "../../x500/rdnToJson";
import saveAccessPoint from "../../database/saveAccessPoint";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SuperiorToSubordinateModification,
    _decode_SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    SubordinateToSuperior,
    _decode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { DER } from "asn1-ts/dist/node/functional";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import updateContextPrefix from "../modify/updateContextPrefix";
import updateLocalSubr from "../modify/updateLocalSubr";
import {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
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

function getInitiator (init: Initiator): OperationalBindingInitiator {
    // NOTE: Initiator is not extensible, so this is an exhaustive list.
    if ("symmetric" in init) {
        return OperationalBindingInitiator.SYMMETRIC;
    } else if ("roleA_initiates" in init) {
        return OperationalBindingInitiator.ROLE_A;
    } else  {
        return OperationalBindingInitiator.ROLE_B;
    }
}

function getInitiatorParam (init: Initiator): ASN1Element {
    // NOTE: Initiator is not extensible, so this is an exhaustive list.
    if ("symmetric" in init) {
        return init.symmetric;
    } else if ("roleA_initiates" in init) {
        return init.roleA_initiates;
    } else  {
        return init.roleB_initiates;
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
 * @summary Modifies an operational binding, as described in ITU Recommendation X.501.
 * @description
 *
 * This function implements the `modifyOperationalBinding` operation
 * described in ITU Recommendation X.501 (2016), Section 28.3.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the operation
 * @param arg The `ModifyOperationalBindingArgument` argument
 * @returns The `ModifyOperationalBindingResult` result
 *
 * @function
 * @async
 */
export
async function modifyOperationalBinding (
    ctx: Context,
    assn: DOPAssociation,
    invokeId: InvokeId,
    arg: ModifyOperationalBindingArgument,
): Promise<ModifyOperationalBindingResult> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const data: ModifyOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // const getApproval = (uuid: string): Promise<boolean> => Promise.race<boolean>([
    //     new Promise<boolean>((resolve) => {
    //         ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
    //             resolve(approved);
    //         });
    //     }),
    //     new Promise<boolean>(resolve => setTimeout(() => resolve(false), 30000)),
    // ]);

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

    /**
     * We first identify all of the access points that correspond to the socket
     * that originated this request. These access points are used to filter out
     * the operational bindings that the remote DSA may modify, terminate, or
     * even know about. (Otherwise, a rogue DSA would be able to modify the
     * operational bindings of other DSAs.)
     */
    const permittedAPs = (await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.OB_REQUEST,
            active: true,
        },
    }))
        .filter((ap) => {
            const el = new BERElement();
            el.fromBytes(ap.ber);
            // This is a simpler way to get the address out of the AP type.
            const address = el.set.find((component) => (component.tagNumber === 1));
            if (!address) {
                return false;
            }
            const pa = _decode_PresentationAddress(address);
            return pa.nAddresses.some((naddr) => compareSocketToNSAP(assn.idm.s, naddr));
        })
        .map((ap) => ap.id);

    if (permittedAPs.length === 0) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
                    data.bindingType,
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
                    undefined,
                    undefined,
                ),
            },
        );
    }

    const opBinding = await ctx.db.operationalBinding.findFirst({
        where: {
            binding_identifier: Number(data.bindingID.identifier),
            binding_type: {
                equals: data.bindingType.toString(),
            },
            access_point_id: {
                in: permittedAPs,
            },
        },
    });

    if (!opBinding) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
                    data.bindingType,
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
                    undefined,
                    undefined,
                ),
            },
        );
    }

    const now = new Date();
    const alreadyTakenBindingID = !!(await ctx.db.operationalBinding.findFirst({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            binding_identifier: Number(data.newBindingID.identifier),
        },
        select: {
            binding_identifier: true,
        },
    }));
    if (alreadyTakenBindingID) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:ob_duplicate_identifier", {
                id: data.newBindingID.identifier,
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
    }

    if ((opBinding.binding_version ?? 1) >= data.newBindingID.version) {
        throw new OperationalBindingError(
            ctx.i18n.t("err:ob_invalid_version"),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidNewID,
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
            }
        )
    }

    const validFrom: Date = (
        data.valid?.validFrom
        && ("time" in data.valid.validFrom)
        && !(data.valid.validFrom instanceof ASN1Element)
    )
        ? getDateFromOBTime(data.valid.validFrom.time)
        : now;
    const validUntil: Date | null | undefined = (
        data.valid?.validUntil
        && ("time" in data.valid.validUntil)
        && !(data.valid.validUntil instanceof ASN1Element)
    )
        ? getDateFromOBTime(data.valid.validUntil.time)
        : ((
            data.valid?.validUntil
            && ("unchanged" in data.valid.validUntil)
        )
            ? opBinding.terminated_time
            : undefined);

    const createdAccessPoint = data.accessPoint
        ? await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST)
        : undefined;

    const sp = data.securityParameters;
    const created = await ctx.db.operationalBinding.create({
        data: {
            accepted: true, // REVIEW: Automatically-accepted.
            previous: {
                connect: {
                    id: opBinding.id,
                },
            },
            outbound: false,
            binding_type: data.bindingType.toString(),
            binding_identifier: Number(data.newBindingID.identifier),
            binding_version: Number(data.newBindingID.version),
            agreement_ber: data.newAgreement
                ? Buffer.from(data.newAgreement.toBytes())
                : opBinding.agreement_ber,
            access_point: {
                connect: {
                    id: createdAccessPoint ?? opBinding.id,
                },
            },
            initiator: data.initiator
                ? getInitiator(data.initiator)
                : opBinding.initiator,
            initiator_ber: data.initiator
                ? Buffer.from(getInitiatorParam(data.initiator).toBytes())
                : opBinding.initiator_ber,
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
                ? Number (sp.target)
                : undefined,
            security_operationCode: codeToString(sp?.operationCode),
            security_errorProtection: (sp?.errorProtection !== undefined)
                ? Number(sp.errorProtection)
                : undefined,
            security_errorCode: codeToString(sp?.errorCode),
            // new_context_prefix_rdn: set below.
            // immediate_superior: set below.
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
            requested_time: new Date(),
        },
    });

    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const oldAgreement: HierarchicalAgreement = (() => {
            const el = new BERElement();
            el.fromBytes(opBinding.agreement_ber);
            return _decode_HierarchicalAgreement(el);
        })();
        const newAgreement: HierarchicalAgreement = data.newAgreement
            ? _decode_HierarchicalAgreement(data.newAgreement)
            : oldAgreement;

        await ctx.db.operationalBinding.update({
            where: {
                id: created.id,
            },
            data: {
                new_context_prefix_rdn: rdnToJson(newAgreement.rdn),
                immediate_superior: newAgreement.immediateSuperior.map(rdnToJson),
            },
        });

        if (!data.initiator) {
            throw new OperationalBindingError(
                ctx.i18n.t("err:cannot_reverse_roles_in_hob"),
                {
                    unsigned: new OpBindingErrorParam(
                        OpBindingErrorParam_problem_roleAssignment,
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
        }

        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinateModification = _decode_SuperiorToSubordinateModification(data.initiator.roleA_initiates);
            if (!compareDistinguishedName(
                newAgreement.immediateSuperior,
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
                                assn.boundNameAndUID?.dn,
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
            await updateContextPrefix(ctx, created.uuid, newAgreement, init);
            return {
                null_: null,
            };
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            await updateLocalSubr(ctx, assn, invokeId, oldAgreement, newAgreement, init);
            return {
                null_: null,
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
                            assn.boundNameAndUID?.dn,
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
    } else {
        throw NOT_SUPPORTED_ERROR;
    }
}

export default modifyOperationalBinding;

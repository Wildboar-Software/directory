import type { MeerkatContext } from "../../ctx";
import * as errors from "@wildboar/meerkat-types";
import { Vertex } from "@wildboar/meerkat-types";
import DOPAssociation from "../DOPConnection";
import { INTEGER, FALSE, unpackBits, ASN1TagClass, ASN1Construction, OBJECT_IDENTIFIER, TRUE } from "asn1-ts";
import type {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    EstablishOperationalBindingArgumentData, Validity,
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
// import {
//     id_op_binding_shadow,
// } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
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
    OpBindingErrorParam_problem_roleAssignment,
    OpBindingErrorParam_problem_invalidID,
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
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubentryInfo.ta";
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
import { randomInt, timingSafeEqual } from "crypto";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import { generateSignature } from "../../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    EstablishOperationalBindingArgumentData_initiator,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData-initiator.ta";
// import { _decode_AgreementID } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/AgreementID.ta";
import {
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
// import {
//     _decode_ShadowingAgreementInfo,
// } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import dnToVertex from "../../dit/dnToVertex";
import getContextPrefixInfo from "../../hob/getContextPrefixInfo";
import { getEntryAttributesToShareInOpBinding } from "../../dit/getEntryAttributesToShareInOpBinding";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import rdnToID from "../../dit/rdnToID";
import getVertexById from "../../database/getVertexById";
import createEntry from "../../database/createEntry";
import getAttributesFromSubentry from "../../dit/getAttributesFromSubentry";
import { bindForOBM } from "../../net/bindToOtherDSA";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { becomeNonSpecificSubordinate } from "../establish/becomeNonSpecificSubordinate";
import {
    _decode_NHOBSubordinateToSuperior,
    _encode_NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    _decode_NHOBSuperiorToSubordinate,
    _encode_NHOBSuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";
import becomeNonSpecificSuperior from "../establish/becomeNonSpecificSuperior";
import becomeSuperior from "../establish/becomeSuperior";
import { Prisma } from "@prisma/client";
import stringifyDN from "../../x500/stringifyDN";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { top } from "@wildboar/x500/src/lib/collections/objectClasses";
import terminateByTypeAndBindingID from "../terminateByTypeAndBindingID";

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

async function relayedEstablishOperationalBinding (
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: INTEGER,
    bindingType: OBJECT_IDENTIFIER,
    agreement: ASN1Element,
    initiator: EstablishOperationalBindingArgumentData_initiator,
    validFrom: Date,
    validUntil: Date | undefined,
    relayTo: AccessPoint,
    signErrors: boolean,
): Promise<EstablishOperationalBindingResult> {
    let relay_agreement: ASN1Element | undefined;
    let relay_init: EstablishOperationalBindingArgumentData_initiator | undefined;
    let cp: Vertex | undefined;
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    if (bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agr = _decode_HierarchicalAgreement(agreement);
        if ("roleA_initiates" in initiator) {
            const init = _decode_SuperiorToSubordinate(initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            bindingType,
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
            }
            // This is only checked for Role A, because Role B (subordinate)
            // won't have this entry locally.
            const supr_entry = await dnToVertex(ctx, ctx.dit.root, agr.immediateSuperior);
            if (!supr_entry) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:agreement_entry_not_found"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        bindingType,
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
            const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, supr_entry);
            const new_sup2sub = new SuperiorToSubordinate(
                await getContextPrefixInfo(ctx, supr_entry),
                init.entryInfo,
                immediateSuperiorInfo,
            );
            relay_agreement = agreement;
            relay_init = {
                roleA_initiates: _encode_SuperiorToSubordinate(new_sup2sub, DER),
            };
        } else if ("roleB_initiates"  in initiator) {
            const init = _decode_SubordinateToSuperior(initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
                            bindingType,
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
            }
            let current: Vertex = ctx.dit.root;
            for (const rdn of agr.immediateSuperior) {
                const sub_id = await rdnToID(ctx, current.dse.id, rdn);
                // Create the missing glue DSEs from the root DSE downward
                if (sub_id) { // Entry already exists. Just read it.
                    const existing_vertex = await getVertexById(ctx, current, sub_id);
                    if (existing_vertex) {
                        current = existing_vertex;
                    } else {
                        current = await createEntry(ctx, current, rdn, {
                            glue: true,
                        }, [], undefined, signErrors);
                    }
                } else { // Entry does not exist. Create glue DSE.
                    current = await createEntry(ctx, current, rdn, {
                        glue: true,
                    }, [], undefined, signErrors);
                }
            }
            if (!init.entryInfo) {
                throw new Error(ctx.i18n.t("err:entry_info_reqd_for_relayed_hob"));
            }
            await validateEntry(
                ctx,
                assn,
                current,
                agr.immediateSuperior,
                agr.rdn,
                init.entryInfo,
                FALSE,
                TRUE,
                {
                    present: invokeId,
                },
                false,
                signErrors,
            );

            // Create the subordinate with all attributes in `entryInfo`.
            const entry = await createEntry(ctx, current, agr.rdn, {
                entry: !init.alias,
                alias: init.alias,
                cp: true,
            }, init.entryInfo ?? [], undefined, signErrors);
            cp = entry;
            const subentryInfos: SubentryInfo[] = [];
            for (const subentry of init.subentries ?? []) {
                // TODO: This does not validate that the entry is actually a subentry...
                await validateEntry(
                    ctx,
                    assn,
                    entry,
                    [ ...agr.immediateSuperior, entry.dse.rdn ],
                    subentry.rdn,
                    subentry.info,
                    FALSE,
                    TRUE,
                    {
                        present: invokeId,
                    },
                    false,
                    signErrors,
                );
                const sub = await createEntry(ctx, entry, subentry.rdn, {
                    subentry: true,
                }, subentry.info, undefined, signErrors);
                const info = new SubentryInfo(
                    sub.dse.rdn,
                    await getAttributesFromSubentry(ctx, sub),
                );
                subentryInfos.push(info);
            }
            const sub2sup = new SubordinateToSuperior(
                [
                    ctx.dsa.accessPoint,
                ],
                !!entry.dse.alias,
                await getEntryAttributesToShareInOpBinding(ctx, entry),
                subentryInfos,
            );
            relay_agreement = agreement;
            relay_init = {
                roleB_initiates: _encode_SubordinateToSuperior(sub2sup, DER),
            };
            // TODO: Upon receiving a result, replace the glue entries.
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
        }
    }
    else if (bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        const agr = _decode_NonSpecificHierarchicalAgreement(agreement);
        if ("roleA_initiates" in initiator) {
            // This is only checked for Role A, because Role B (subordinate)
            // won't have this entry locally.
            const supr_entry = await dnToVertex(ctx, ctx.dit.root, agr.immediateSuperior);
            if (!supr_entry) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:agreement_entry_not_found"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        bindingType,
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
            const immediateSuperiorInfo: Attribute[] = await getEntryAttributesToShareInOpBinding(ctx, supr_entry);
            const new_sup2sub = new SuperiorToSubordinate(
                await getContextPrefixInfo(ctx, supr_entry),
                undefined,
                immediateSuperiorInfo,
            );
            relay_agreement = agreement;
            relay_init = {
                roleA_initiates: _encode_SuperiorToSubordinate(new_sup2sub, DER),
            };
        } else if ("roleB_initiates" in initiator) {
            relay_agreement = agreement;
            relay_init = initiator;
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
        }
    }
    // else if (bindingType.isEqualTo(id_op_binding_shadow)) {
    //     if (!("roleA_initiates" in initiator) && !("roleB_initiates" in initiator)) {
    //         throw new errors.MistypedArgumentError(ctx.i18n.t("err:invalid_initiator"));
    //     }
    //     const agr = _decode_ShadowingAgreementInfo(agreement);
    // }
    else {
        // If bindingType is not understood, just submit the agreement and initiator unchanged.
        relay_agreement = agreement;
        relay_init = initiator;
    }
    // dop?.establishOperationalBinding()
    const dop = await bindForOBM(ctx, assn, undefined, relayTo, undefined, signErrors);
    if (!dop) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:failed_to_bind_to_other_dsa_for_dop"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_currentlyNotDecidable,
                bindingType,
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
    const sp = createSecurityParameters(
        ctx,
        true,
        relayTo.ae_title.rdnSequence,
        id_op_establishOperationalBinding,
    );
    const outcome = await dop.establishOperationalBinding({
        accessPoint: ctx.dsa.accessPoint,
        agreement: relay_agreement,
        initiator: relay_init,
        bindingType,
        cert_path: ctx.config.signing.certPath,
        key: ctx.config.signing.key,
        valid: new Validity(
            {
                time: {
                    generalizedTime: validFrom,
                },
            },
            validUntil
                ? {
                    time: {
                        generalizedTime: validUntil,
                    },
                }
                : {
                    explicitTermination: null,
                },
        ),
        bindingID: undefined,
        securityParameters: sp,
        _unrecognizedExtensionsList: [],
    });
    let err_message: string = "";
    if ("result" in outcome) {
        const result = outcome.result.parameter;
        const data = getOptionallyProtectedValue(result);
        if (!data.bindingID) {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:other_dsa_did_not_choose_binding_id"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
                    bindingType,
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
                ),
            );
        }
        if (!data.bindingType.isEqualTo(bindingType)) {
            throw new errors.OperationalBindingError(
                ctx.i18n.t("err:other_dsa_changed_ob_type"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_unsupportedBindingType,
                    bindingType,
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
                ),
            );
        }
        const access_point_id = await saveAccessPoint(ctx, relayTo, Knowledge.OB_REQUEST);
        const ob_db_data: Prisma.OperationalBindingCreateInput = {
            outbound: true,
            binding_type: bindingType.toString(),
            binding_identifier: Number(data.bindingID.identifier),
            binding_version: Number(data.bindingID.version),
            agreement_ber: Buffer.from(agreement.toBytes().buffer),
            initiator: (() => {
                if ("roleA_initiates" in relay_init) {
                    return OperationalBindingInitiator.ROLE_A;
                }
                else if ("roleB_initiates" in relay_init) {
                    return OperationalBindingInitiator.ROLE_B;
                }
                else {
                    return OperationalBindingInitiator.SYMMETRIC;
                }
            })(),
            initiator_ber: (() => {
                if ("roleA_initiates" in relay_init) {
                    return Buffer.from(relay_init.roleA_initiates.toBytes());
                }
                else if ("roleB_initiates" in relay_init) {
                    return Buffer.from(relay_init.roleB_initiates.toBytes());
                }
                else {
                    return Buffer.from(relay_init.symmetric.toBytes());
                }
            })(),
            access_point: {
                connect: {
                    id: access_point_id,
                },
            },
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
            source_ip: assn.socket.remoteAddress,
            source_tcp_port: assn.socket.remotePort,
            source_credentials_type: 1,
            source_certificate_path: sp?.certification_path
                ? Buffer.from(_encode_CertificationPath(sp.certification_path, DER).toBytes().buffer)
                : undefined,
            source_strong_name: ctx.dsa.accessPoint.ae_title.rdnSequence.map(rdnToJson),
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
        const ROLE_REVERSAL_ERROR = new errors.OperationalBindingError(
            ctx.i18n.t("err:other_dsa_reversed_ob_role", { uuid: new_ob.uuid }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_roleAssignment,
                bindingType,
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
            ),
        );
        const INVALID_INIT_SYNTAX_ERROR = new errors.OperationalBindingError(
            ctx.i18n.t("err:invalid_initiator", {
                context: "other_dsa",
                uuid: new_ob.uuid,
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_roleAssignment,
                bindingType,
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
            ),
        );
        const bindingID = data.bindingID;
        const revert_operational_binding = () => {
            terminateByTypeAndBindingID(
                ctx,
                assn,
                relayTo,
                bindingType,
                bindingID,
                false,
                signErrors,
            )
                .then(() => {
                    ctx.log.info(ctx.i18n.t("log:terminated_ob", {
                        context: "reversed",
                        uuid: new_ob.uuid,
                    }));
                })
                .catch((e) => {
                    ctx.telemetry.trackException({
                        exception: e,
                        properties: {
                            obUUID: new_ob.uuid,
                            obType: id_op_binding_hierarchical.toString(),
                            obid: bindingID.identifier,
                            obver: bindingID.version,
                            administratorEmail: ctx.config.administratorEmail,
                            invokeID: invokeId.toString(),
                        },
                        measurements: {
                            bytesRead: assn.socket.bytesRead,
                            bytesWritten: assn.socket.bytesWritten,
                        },
                    });
                    ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                        obid: bindingID.identifier.toString(),
                        obver: bindingID.version.toString(),
                        e: e.message,
                    }), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: invokeId.toString(),
                    });
                });
        };
        if (bindingType.isEqualTo(id_op_binding_hierarchical)) {
            if ("roleA_replies" in data.initiator) {
                if (!("roleB_initiates" in initiator)) {
                    revert_operational_binding();
                    throw ROLE_REVERSAL_ERROR;
                }
                if (!cp) {
                    revert_operational_binding();
                    throw new errors.UnknownError("2b97303d-c535-4771-be8d-aa49f2bd5970");
                }
                const sup2sub = _decode_SuperiorToSubordinate(data.initiator.roleA_replies);
                const agr = _decode_HierarchicalAgreement(agreement);
                await becomeSubordinate(
                    ctx,
                    relayTo,
                    agr,
                    sup2sub,
                    cp.dse.structuralObjectClass ?? top["&id"],
                    cp.dse.governingStructureRule,
                    signErrors,
                );
            }
            else if ("roleB_replies" in data.initiator) {
                if (!("roleA_initiates" in initiator)) {
                    revert_operational_binding();
                    throw ROLE_REVERSAL_ERROR;
                }
                const sub2sup = _decode_SubordinateToSuperior(data.initiator.roleB_replies);
                const agr = _decode_HierarchicalAgreement(agreement);
                await becomeSuperior(
                    ctx,
                    assn,
                    { present: invokeId },
                    agr,
                    sub2sup,
                    signErrors,
                );
            }
            else {
                revert_operational_binding();
                throw INVALID_INIT_SYNTAX_ERROR;
            }
        }
        else if (bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
            if ("roleA_replies" in data.initiator) {
                if (!("roleB_initiates" in initiator)) {
                    revert_operational_binding();
                    throw ROLE_REVERSAL_ERROR;
                }
                const sup2sub = _decode_NHOBSuperiorToSubordinate(data.initiator.roleA_replies);
                _decode_NonSpecificHierarchicalAgreement(agreement); // Just for validation.
                await becomeNonSpecificSubordinate(
                    ctx,
                    relayTo,
                    sup2sub,
                    signErrors,
                );
            }
            else if ("roleB_replies" in data.initiator) {
                if (!("roleA_initiates" in initiator)) {
                    revert_operational_binding();
                    throw ROLE_REVERSAL_ERROR;
                }
                const sub2sup = _decode_NHOBSubordinateToSuperior(data.initiator.roleB_replies);
                const agr = _decode_NonSpecificHierarchicalAgreement(agreement);
                await becomeNonSpecificSuperior(
                    ctx,
                    assn,
                    agr,
                    sub2sup,
                    signErrors,
                    new_ob.binding_identifier,
                );
            }
            else {
                revert_operational_binding();
                throw INVALID_INIT_SYNTAX_ERROR;
            }
        }
        else {
            revert_operational_binding();
            new errors.OperationalBindingError(
                ctx.i18n.t("err:ob_type_unrecognized", { obtype: bindingType.toString() }),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_unsupportedBindingType,
                    bindingType,
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
                ),
            );
        }
        await ctx.db.operationalBinding.update({
            where: {
                id: new_ob.id,
            },
            data: {
                accepted: true,
            },
        });
        return result;
    }
    else if ("error" in outcome) {
        throw new errors.ChainedError(
            ctx.i18n.t("err:chained_error"),
            outcome.error.parameter,
            outcome.error.code,
            signErrors,
        );
    }
    else if ("reject" in outcome) {
        throw new errors.ChainedReject(
            invokeId,
            outcome.reject.problem,
        );
    }
    else if ("abort" in outcome) {
        throw new errors.ChainedAbort(outcome.abort);
    }
    else if ("timeout" in outcome) {
        err_message = ctx.i18n.t("err:relayed_dop_timeout");
    }
    else {
        err_message = ctx.i18n.t("err:relayed_dop_other_error");
    }
    throw new errors.OperationalBindingError(
        err_message,
        new OpBindingErrorParam(
            OpBindingErrorParam_problem_currentlyNotDecidable,
            bindingType,
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

    if (validUntil && (validUntil < validFrom)) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:validity_end_before_start"),
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

    const relayToElement = data._unrecognizedExtensionsList.find((ext) => (
        (ext.tagClass === ASN1TagClass.private)
        && (ext.tagNumber === 0)
        && (ext.construction === ASN1Construction.constructed)
    ))?.inner;
    if (relayToElement) {
        const user_cert = data.securityParameters?.certification_path?.userCertificate;
        const dsa_cert = [ ...ctx.config.signing.certPath ?? [] ].pop();
        const user_sig = packBits(user_cert?.signature ?? new Uint8ClampedArray());
        const dsa_sig = packBits(dsa_cert?.signature ?? new Uint8ClampedArray());
        /* We check if the request was signed with the exact same certificate
        that the DSA is using for signatures. If they match, the user is
        authorized on behalf of the DSA itself to establish a new operational
        binding. We do not need to check the signatures or certification path
        here, because it was already done before this function was invoked. */
        if (
            !("signed" in arg)
            || !user_cert
            || !dsa_cert
            || (user_cert.toBeSigned.serialNumber.toString() !== dsa_cert.toBeSigned.serialNumber.toString())
            || (user_sig.length !== dsa_sig.length)
            || !timingSafeEqual(user_sig, dsa_sig)
        ) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:must_have_dsa_keys_for_relayed_dop"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
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
        const relayToAccessPoint = _decode_AccessPoint(relayToElement);
        return relayedEstablishOperationalBinding(
            ctx,
            assn,
            invokeId,
            data.bindingType,
            data.agreement,
            data.initiator,
            validFrom,
            validUntil,
            relayToAccessPoint,
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

    const bindingID = new OperationalBindingID(
        newBindingIdentifier,
        0,
    );
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId({ present: invokeId }),
        binding_id: bindingID.identifier.toString(),
    };
    ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
        context: "started",
        type: data.bindingType.toString(),
        bid: bindingID.identifier.toString(),
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
    const getApproval = (uuid: string): Promise<boolean | undefined> => {
        const logInfo = {
            type: data.bindingType.toString(),
            obid: bindingID.identifier.toString(),
            uuid,
        };
        if (ctx.config.ob.autoAccept) {
            ctx.log.info(ctx.i18n.t("log:auto_accepted_ob", {
                type: data.bindingType.toString(),
                obid: bindingID.identifier.toString(),
                uuid,
            }), logInfo);
            return Promise.resolve(true);
        }
        ctx.log.warn(ctx.i18n.t("log:awaiting_ob_approval", { uuid }));
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.log.warn(ctx.i18n.t("log:ob_proposal_timed_out"), { uuid }, logInfo);
                resolve(undefined);
            }, 300_000);
            new Promise<boolean>((resolve2) => {
                ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                    resolve2(approved);
                });
            }).then(resolve, reject);
        });
    };

    const access_point_id = await saveAccessPoint(ctx, data.accessPoint, Knowledge.OB_REQUEST);

    const ob_db_data: Omit<Omit<Prisma.OperationalBindingCreateInput, "initiator_ber">, "initiator"> = {
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
    };
    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinate = _decode_SuperiorToSubordinate(data.initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
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
            }
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
            const cp_info_dn = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, agreement.immediateSuperior),
                        cp_info_dn: stringifyDN(ctx, cp_info_dn),
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

            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    initiator: OperationalBindingInitiator.ROLE_A,
                    initiator_ber: Buffer.from(data.initiator.roleA_initiates.toBytes()),
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
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
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
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
                    bid: bindingID.identifier.toString(),
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
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                }
                throw e;
            }
        } else if ("roleB_initiates" in data.initiator) {
            const init: SubordinateToSuperior = _decode_SubordinateToSuperior(data.initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
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
            }
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    initiator: OperationalBindingInitiator.ROLE_B,
                    initiator_ber: Buffer.from(data.initiator.roleB_initiates.toBytes()),
                    new_context_prefix_rdn: rdnToJson(agreement.rdn),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
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
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
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
                const reply = await becomeSuperior(ctx, assn, { present: invokeId }, agreement, init, signErrors);
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
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
                        roleB_replies: _encode_SuperiorToSubordinate(reply, DER),
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
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                }
                throw e;
            }
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        const agreement = _decode_NonSpecificHierarchicalAgreement(data.agreement);
        if ("roleA_initiates" in data.initiator) {
            const init = _decode_NHOBSuperiorToSubordinate(data.initiator.roleA_initiates);
            const last_vertex = init.contextPrefixInfo[init.contextPrefixInfo.length - 1];
            for (const ap of last_vertex?.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
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
            }
            const cp_info_dn: DistinguishedName = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                agreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, agreement.immediateSuperior),
                        cp_info_dn: stringifyDN(ctx, cp_info_dn),
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
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    initiator: OperationalBindingInitiator.ROLE_A,
                    initiator_ber: Buffer.from(data.initiator.roleA_initiates.toBytes()),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
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
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
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
                const reply = await becomeNonSpecificSubordinate(
                    ctx,
                    data.accessPoint,
                    init,
                    signErrors,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
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
                        roleB_replies: _encode_NHOBSubordinateToSuperior(reply, DER),
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
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                }
                throw e;
            }
        }
        else if ("roleB_initiates" in data.initiator) {
            const init = _decode_NHOBSubordinateToSuperior(data.initiator.roleB_initiates);
            for (const ap of init.accessPoints ?? []) {
                if (compareDistinguishedName(
                    ap.ae_title.rdnSequence,
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    NAMING_MATCHER,
                )) {
                    throw new errors.OperationalBindingError(
                        ctx.i18n.t("err:cannot_establish_ob_with_self"),
                        new OpBindingErrorParam(
                            OpBindingErrorParam_problem_roleAssignment,
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
            }
            const created = await ctx.db.operationalBinding.create({
                data: {
                    ...ob_db_data,
                    initiator: OperationalBindingInitiator.ROLE_B,
                    initiator_ber: Buffer.from(data.initiator.roleB_initiates.toBytes()),
                    immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                },
                select: {
                    id: true,
                    uuid: true,
                    binding_identifier: true,
                },
            });
            const approved: boolean | undefined = await getApproval(created.uuid);
            await ctx.db.operationalBinding.update({
                where: {
                    uuid: created.uuid,
                },
                data: {
                    accepted: approved ?? null,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
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
                const reply = await becomeNonSpecificSuperior(
                    ctx,
                    assn,
                    agreement,
                    init,
                    signErrors,
                    created.binding_identifier,
                );
                ctx.log.info(ctx.i18n.t("log:establishOperationalBinding", {
                    context: "succeeded",
                    type: data.bindingType.toString(),
                    bid: bindingID.identifier.toString(),
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
                        roleA_replies: _encode_NHOBSuperiorToSubordinate(reply, DER),
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
                ctx.log.error(ctx.i18n.t("log:err_establishing_ob", {
                    uuid: created.uuid,
                    e,
                }));
                if (e instanceof errors.OperationalBindingError) {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                            last_ob_problem: e.data.problem,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                } else {
                    ctx.db.operationalBinding.update({
                        where: {
                            uuid: created.uuid,
                        },
                        data: {
                            accepted: false,
                        },
                        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
                    }).then().catch();
                }
                throw e;
            }
        }
        else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    // } else if (data.bindingType.isEqualTo(id_op_binding_shadow)) {
    //     throw NOT_SUPPORTED_ERROR;
    } else {
        throw new errors.OperationalBindingError(
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
    }
}

export default establishOperationalBinding;

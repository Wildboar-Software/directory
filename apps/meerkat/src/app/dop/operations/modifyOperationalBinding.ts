import { OperationalBindingError } from "@wildboar/meerkat-types";
import type DOPAssociation from "../DOPConnection";
import type { MeerkatContext } from "../../ctx";
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
import {
    ModifyOperationalBindingResultData,
    _encode_ModifyOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResultData.ta";
import {
    Validity,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Validity.ta";
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
    OpBindingErrorParam_problem_currentlyNotDecidable,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { ASN1Element, BERElement, FALSE, packBits, unpackBits } from "asn1-ts";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
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
import { getDateFromOBTime } from "../getDateFromOBTime";
import { printInvokeId } from "../../utils/printInvokeId";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { generateSignature } from "../../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    id_op_modifyOperationalBinding
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-op-modifyOperationalBinding.va";
import { rdnFromJson } from "../../x500/rdnFromJson";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    compareDistinguishedName,
} from "@wildboar/x500";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import stringifyDN from "../../x500/stringifyDN";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import {
    NHOBSuperiorToSubordinate,
    _decode_NHOBSuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";
import {
    NHOBSubordinateToSuperior,
    _decode_NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import dnToID from "../../dit/dnToID";
import { randomInt } from "crypto";

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
 * Note that some operational binding modifications do not require manual
 * approval, because some operational binding modifications merely inform the
 * other cooperating DSA about changes to information within the other DSA,
 * rather than mutating information that the cooperating DSA "owns."
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
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: InvokeId,
    arg: ModifyOperationalBindingArgument,
): Promise<ModifyOperationalBindingResult> {
    const data: ModifyOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // DOP associations are ALWAYS authorized to receive signed responses.
    const signResult: boolean = (data.securityParameters?.target === ProtectionRequest_signed);
    const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
    if (!assn.boundNameAndUID?.dn) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:anon_dop"),
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    ctx.log.info(ctx.i18n.t("log:modifyOperationalBinding", {
        context: "started",
        type: data.bindingType.toString(),
        bid: data.bindingID?.identifier.toString(),
        aid: assn.id,
    }), {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId(invokeId),
    });

    if (data.bindingID.identifier != data.newBindingID.identifier) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:ob_binding_id_identifier_changed", {
                uuid: data.bindingType.toString(),
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidNewID,
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
    const opBinding = (await ctx.db.operationalBinding.findMany({
        // We only want the most recent operational binding.
        // This should be taken care of by the `where.next_version` below, but
        // this is extra assurance that we get the right one.
        orderBy: {
            requested_time: "desc",
        },
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             *
             * See: https://github.com/prisma/prisma/discussions/2772#discussioncomment-1712222
             */
            next_version: {
                none: {},
            },
            accepted: true,
            binding_type: data.bindingType.toString(),
            binding_identifier: Number(data.bindingID.identifier),
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
            id: true,
            uuid: true,
            binding_version: true,
            terminated_time: true,
            initiator: true,
            initiator_ber: true,
            agreement_ber: true,
            access_point: {
                select: {
                    id: true,
                    ae_title: true,
                },
            },
        },
    }))
        .find((ob) => {
            if (!ob.access_point) {
                return false;
            }
            const authorized_ae_title: DistinguishedName | undefined = Array.isArray(ob.access_point.ae_title)
                ? ob.access_point.ae_title.map((rdn: Record<string, string>) => rdnFromJson(rdn))
                : undefined;
            if (!authorized_ae_title) {
                ctx.log.warn(ctx.i18n.t("log:ap_missing_ae_title", { id: ob.access_point.id }));
                return false;
            }
            const modifier_is_originator: boolean = compareDistinguishedName(
                authorized_ae_title,
                assn.boundNameAndUID!.dn,
                NAMING_MATCHER,
            );
            if (!modifier_is_originator) {
                const logInfo = {
                    type: data.bindingType.toString(),
                    obid: data.bindingID?.identifier.toString(),
                    uuid: ob.uuid,
                    owner: stringifyDN(ctx, authorized_ae_title),
                    impostor: stringifyDN(ctx, assn.boundNameAndUID!.dn),
                };
                ctx.log.warn(ctx.i18n.t("log:ob_modify_attempt_by_other_ae", logInfo), logInfo);
            }
            return modifier_is_originator;
        });

    if (!opBinding) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidID,
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
    }

    const currentVersion = (opBinding.binding_version ?? -Infinity);
    const proposedVersion = data.newBindingID.version;
    if (currentVersion >= proposedVersion) {
        throw new OperationalBindingError(
            ctx.i18n.t("err:ob_invalid_version", {
                proposed: proposedVersion,
                current: currentVersion,
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidNewID,
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
    const access_point_id: number | undefined = createdAccessPoint ?? opBinding.access_point?.id;
    const created = await ctx.db.operationalBinding.create({
        data: {
            accepted: undefined,
            // previous: {
            //     connect: {
            //         id: opBinding.id,
            //     },
            // },
            outbound: false,
            binding_type: data.bindingType.toString(),
            binding_identifier: Number(data.newBindingID.identifier),
            binding_version: Number(data.newBindingID.version),
            agreement_ber: data.newAgreement
                ? Buffer.from(data.newAgreement.toBytes().buffer)
                : opBinding.agreement_ber,
            ...(access_point_id
                ? {
                    access_point: {
                        connect: {
                            id: access_point_id,
                        },
                    },
                }
                : {}),
            initiator: data.initiator
                ? getInitiator(data.initiator)
                : opBinding.initiator,
            initiator_ber: data.initiator
                ? Buffer.from(getInitiatorParam(data.initiator).toBytes().buffer)
                : opBinding.initiator_ber,
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
            requested_time: new Date(),
        },
        select: {
            id: true,
            uuid: true,
            binding_type: true,
            binding_identifier: true,
        },
    });

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
        if (ctx.config.ob.autoAccept) {
            ctx.log.info(ctx.i18n.t("log:auto_accepted_ob", {
                type: data.bindingType.toString(),
                obid: data.bindingID.identifier.toString(),
                uuid,
            }), {
                type: data.bindingType.toString(),
                obid: data.bindingID.identifier.toString(),
                uuid,
            });
            return Promise.resolve(true);
        }
        ctx.log.warn(ctx.i18n.t("log:awaiting_ob_approval", { uuid }));
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300_000);
            new Promise<boolean>((resolve2) => {
                ctx.operationalBindingControlEvents.once(uuid, (approved: boolean) => {
                    resolve2(approved);
                });
            }).then(resolve, reject);
        });
    };

    const oldAgreementElement = (() => {
        const el = new BERElement();
        el.fromBytes(opBinding.agreement_ber);
        return el;
    })();

    const getResult = () => {
        const resultData = new ModifyOperationalBindingResultData(
            data.newBindingID,
            data.bindingType,
            data.newAgreement ?? oldAgreementElement,
            new Validity(
                validFrom
                    ? {
                        time: {
                            generalizedTime: validFrom,
                        },
                    }
                    : {
                        now: null,
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
            [],
            createSecurityParameters(
                ctx,
                signErrors,
                assn.boundNameAndUID?.dn,
                id_op_modifyOperationalBinding,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            false,
            undefined,
        );
        const result: ModifyOperationalBindingResult = signResult
            ? (() => {
                const resultDataBytes = _encode_ModifyOperationalBindingResultData(resultData, DER).toBytes();
                const key = ctx.config.signing?.key;
                if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                    return {
                        protected_: {
                            unsigned: resultData,
                        },
                    };
                }
                const signingResult = generateSignature(key, resultDataBytes);
                if (!signingResult) {
                    return {
                        protected_: {
                            unsigned: resultData,
                        },
                    };
                }
                const [ sigAlg, sigValue ] = signingResult;
                return {
                    protected_: {
                        signed: new SIGNED(
                            resultData,
                            sigAlg,
                            unpackBits(sigValue),
                            undefined,
                            undefined,
                        ),
                    },
                };
            })()
            : {
                protected_: {
                    unsigned: resultData,
                },
            };
        return result;
    };

    if (data.bindingType.isEqualTo(id_op_binding_hierarchical)) {
        const oldAgreement: HierarchicalAgreement = _decode_HierarchicalAgreement(oldAgreementElement);
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
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        });

        if (!data.initiator) {
            throw new OperationalBindingError(
                // REVIEW: How does this error message make sense?
                ctx.i18n.t("err:cannot_reverse_roles_in_hob"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
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
        }
        if ("roleA_initiates" in data.initiator) {
            const init: SuperiorToSubordinateModification = _decode_SuperiorToSubordinateModification(data.initiator.roleA_initiates);
            const cp_info_dn = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                newAgreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, newAgreement.immediateSuperior),
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
            const agreement_dn_changed: boolean = !compareDistinguishedName(
                [ ...oldAgreement.immediateSuperior, oldAgreement.rdn ],
                [ ...newAgreement.immediateSuperior, newAgreement.rdn ],
                NAMING_MATCHER,
            );
            if (agreement_dn_changed) { // If the agreement DN changes, we need to request DSA admin approval.
                const approved: boolean | undefined = await getApproval(created.uuid);
                await ctx.db.operationalBinding.update({
                    where: {
                        id: created.id,
                    },
                    data: {
                        accepted: approved ?? null,
                        /**
                         * Previous is not set until the update succeeds,
                         * because `getRelevantOperationalBindings`
                         * determines which is the latest of all versions of
                         * a given operational binding based on which
                         * operational binding has no "previous"es that
                         * point to it.
                         */
                        previous_id: approved
                            ? opBinding.id
                            : undefined,
                    },
                    select: {
                        id: true,
                    },
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
            } else { // If the agreement DN does not change, the modification is auto-accepted.
                await ctx.db.operationalBinding.update({
                    where: {
                        id: created.id,
                    },
                    data: {
                        accepted: true,
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
                                id: opBinding.id,
                            },
                        },
                    },
                });
            }
            await updateContextPrefix(ctx, created.uuid, oldAgreement.immediateSuperior, init, signErrors);
            ctx.log.info(ctx.i18n.t("log:modifyOperationalBinding", {
                context: "succeeded",
                type: data.bindingType.toString(),
                bid: data.bindingID?.identifier.toString(),
                aid: assn.id,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            return getResult();
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
            await updateLocalSubr(ctx, assn, invokeId, oldAgreement, newAgreement, init, signErrors);
            ctx.log.info(ctx.i18n.t("log:modifyOperationalBinding", {
                context: "succeeded",
                type: data.bindingType.toString(),
                bid: data.bindingID?.identifier.toString(),
                aid: assn.id,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            return getResult();
        } else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    } else if (data.bindingType.isEqualTo(id_op_binding_non_specific_hierarchical)) {
        if (!data.initiator) {
            throw new OperationalBindingError(
                // FIXME: How does this error message make sense?
                ctx.i18n.t("err:cannot_reverse_roles_in_hob"),
                new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
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
        }
        const oldAgreement = _decode_NonSpecificHierarchicalAgreement(oldAgreementElement);
        const newAgreement = data.newAgreement
            ? _decode_NonSpecificHierarchicalAgreement(data.newAgreement)
            : oldAgreement;
        if ("roleA_initiates" in data.initiator) {
            const init: NHOBSuperiorToSubordinate = _decode_NHOBSuperiorToSubordinate(data.initiator.roleA_initiates);
            const cp_info_dn = init.contextPrefixInfo.map((rdn) => rdn.rdn);
            if (!compareDistinguishedName(
                newAgreement.immediateSuperior,
                cp_info_dn,
                NAMING_MATCHER,
            )) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:hob_contextprefixinfo_did_not_match", {
                        agreement_dn: stringifyDN(ctx, newAgreement.immediateSuperior),
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
            const agreement_dn_changed: boolean = !compareDistinguishedName(
                oldAgreement.immediateSuperior,
                newAgreement.immediateSuperior,
                NAMING_MATCHER,
            );
            if (agreement_dn_changed) { // If the agreement DN changes, we need to request DSA admin approval.
                const approved: boolean | undefined = await getApproval(created.uuid);
                await ctx.db.operationalBinding.update({
                    where: {
                        id: created.id,
                    },
                    data: {
                        accepted: approved ?? null,
                        previous_id: approved
                            ? opBinding.id
                            : undefined,
                    },
                    select: {
                        id: true,
                    },
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
            } else { // If the agreement DN does not change, the modification is auto-accepted.
                await ctx.db.operationalBinding.update({
                    where: {
                        id: created.id,
                    },
                    data: {
                        accepted: true,
                    }
                });
            }
            await updateContextPrefix(ctx, created.uuid, oldAgreement.immediateSuperior, init, signErrors);
            ctx.log.info(ctx.i18n.t("log:modifyOperationalBinding", {
                context: "succeeded",
                type: data.bindingType.toString(),
                bid: data.bindingID?.identifier.toString(),
                aid: assn.id,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            return getResult();
        }
        else if ("roleB_initiates" in data.initiator) {
            const agreement_dn_changed: boolean = !compareDistinguishedName(
                oldAgreement.immediateSuperior,
                newAgreement.immediateSuperior,
                NAMING_MATCHER,
            );
            /**
             * The subordinate DSA does not determine the distinguished name of
             * the agreement at all, so if the subordinate submits a changed DN,
             * it can only be a mistake or malicious activity, so it is
             * automatically rejected.
             */
            if (agreement_dn_changed) {
                throw new errors.OperationalBindingError(
                    ctx.i18n.t("err:nhob_subordinate_changed_agreement", {
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
            const init: NHOBSubordinateToSuperior = _decode_NHOBSubordinateToSuperior(data.initiator.roleB_initiates);
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
            // Just update the access points.
            // init.accessPoints
            const nssr_id = await dnToID(ctx, ctx.dit.root.dse.id, oldAgreement.immediateSuperior);
            await ctx.db.accessPoint.deleteMany({
                where: {
                    entry_id: nssr_id,
                    knowledge_type: Knowledge.NON_SPECIFIC,
                    nssr_binding_identifier: created.binding_identifier,
                },
            });
            const nsk_group = BigInt(randomInt(1_000_000_000));
            await Promise.all(
                init.accessPoints
                    ?.map((ap) => saveAccessPoint(
                        ctx,
                        ap,
                        Knowledge.NON_SPECIFIC,
                        nssr_id,
                        undefined,
                        nsk_group,
                        created.binding_identifier,
                    )) ?? [],
            );
            ctx.log.info(ctx.i18n.t("log:modifyOperationalBinding", {
                context: "succeeded",
                type: data.bindingType.toString(),
                bid: data.bindingID?.identifier.toString(),
                aid: assn.id,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            return getResult();
        }
        else {
            throw new errors.MistypedArgumentError(ctx.i18n.t("err:unrecognized_ob_initiator_syntax"));
        }
    }
    else {
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

export default modifyOperationalBinding;

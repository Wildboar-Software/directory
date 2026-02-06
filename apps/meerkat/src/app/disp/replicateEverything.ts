import {
    _decode_ShadowingAgreementInfo,
    _encode_ModificationParameter,
    AreaSpecification,
    ClassAttributeSelection,
    Knowledge,
    Knowledge_knowledgeType_both,
    ModificationParameter,
    PeriodicStrategy,
    SchedulingParameters,
    ShadowingAgreementInfo,
    shadowOperationalBinding,
    UnitOfReplication,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { BERElement, packBits } from "@wildboar/asn1";
import { _decode_AccessPoint, AccessPoint, DSABindArgument } from "@wildboar/x500/DistributedOperations";
import { becomeShadowConsumer } from "../dop/establish/becomeShadowConsumer.js";
import { establishOperationalBinding, modifyOperationalBinding, operationalBindingError, OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import { SubtreeSpecification } from "@wildboar/x500/InformationFramework";
import { bindForOBM } from "../net/bindToOtherDSA.js";
import { PresentationAddress } from "@wildboar/x500/SelectedAttributeTypes";
import { MeerkatContext } from "../ctx.js";
import { _encode_CertificationPath } from "@wildboar/x500/AuthenticationFramework";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import { id_op_binding_shadow } from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { codeToString, compareCode, getDateFromTime, getOptionallyProtectedValue, uriToNSAP } from "@wildboar/x500";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import { DER } from "@wildboar/asn1/functional";
import { OperationalBindingInitiator, Knowledge as PrismaKnowledge } from "../generated/client.js";
import saveAccessPoint from "../database/saveAccessPoint.js";
import rdnToJson from "../x500/rdnToJson.js";
import { Buffer } from "node:buffer";
import { randomBytes, randomInt } from "node:crypto";
import { clearSafeTimeout } from "@wildboar/safe-timers";
import { abortReasonToString, rejectReasonToString } from "@wildboar/rose-transport";
import { securityError, SimpleCredentials } from "@wildboar/x500/DirectoryAbstractService";
import printCode from "../utils/printCode.js";
import _ from "lodash";
import { DOPClient } from "@wildboar/x500-client-ts";
import { id_ac_directoryOperationalBindingManagementAC } from "@wildboar/x500/DirectoryOSIProtocols";

const enum ReplicateEverythingSOBStatus {
    Good,
    Establish,
    Modify,
};

function createReplicateEverythingAgreement(): ShadowingAgreementInfo {
    return new ShadowingAgreementInfo(
        new UnitOfReplication(
            new AreaSpecification(
                [],
                new SubtreeSpecification(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            ),
            [
                // This means "replicate all attributes from all classes"
                new ClassAttributeSelection(
                    undefined,
                    undefined,
                ),
            ],
            new Knowledge(
                Knowledge_knowledgeType_both,
                true,
            ),
            true,
            undefined, // No context selection: replicate everything
            {
                allContexts: null,
            },
        ),
        {
            supplierInitiated: {
                scheduled: new SchedulingParameters(
                    new PeriodicStrategy(
                        undefined,
                        120, // FIXME: Change these back before commit
                        300,
                        undefined,
                    ),
                    true,
                    [],
                ),
            }
        },
        undefined,
        undefined,
    );
}

function doesReplicateEverythingSOBNeedReEstablishment(
    access_point_ber: Uint8Array | undefined,
    replicateEverythingTo: Uint8Array,
    next_version: number | undefined,
    current_id: number | undefined,
): ReplicateEverythingSOBStatus {
    if (current_id && access_point_ber && typeof next_version === "number") {
        try {
            const el = new BERElement();
            el.fromBytes(access_point_ber);
            const ap = _decode_AccessPoint(el);
            const naddr = ap.address.nAddresses[0];
            if (!naddr) {
                return ReplicateEverythingSOBStatus.Establish; // No NSAPs in the access point
            }
            return Buffer.compare(naddr, replicateEverythingTo)
                ? ReplicateEverythingSOBStatus.Good // NSAPs match perfectly: keep the OB as is
                : ReplicateEverythingSOBStatus.Modify; // NSAPs differ: update the SOB
        } catch {
            return ReplicateEverythingSOBStatus.Establish; // Malformed access point
        }
    } else {
        return ReplicateEverythingSOBStatus.Establish; // No such agreement: create a new one
    }
}

async function establishReplicateEverythingAgreement(
    ctx: MeerkatContext,
    assn: DOPClient,
    myAccessPoint: AccessPoint,
    yourAccessPoint: AccessPoint,
    agreement: ShadowingAgreementInfo,
    now: Date,
): Promise<void> {
    try {
        // Just hard-delete them entirely, if any.
        await ctx.db.operationalBinding.deleteMany({
            where: {
                is_the_replicate_everything_ob: true,
            },
        });
    } catch (e) {
        // If there is an error, just fall back on soft-deletion.
        ctx.log.warn(ctx.i18n.t("log:failed_to_delete_prev_replicate_everything", { e }));
        try {
            await ctx.db.operationalBinding.updateMany({
                where: {
                    is_the_replicate_everything_ob: true,
                },
                data: {
                    terminated_time: now,
                },
            });
        } catch (e) {
            ctx.log.warn(ctx.i18n.t("log:failed_to_soft_delete_prev_replicate_everything", { e }));
            return;
        }
    }
    const mySecurityParameters = createSecurityParameters(
        ctx,
        true,
        undefined,
        establishOperationalBinding["&operationCode"],
        undefined,
        true,
    );
    const bindingID = new OperationalBindingID(
        randomInt(0x0_FFFF_FFFF),
        0,
    );
    const outcome = await assn.establishSOBWithSupplier(
        {
            accessPoint: myAccessPoint,
            agreement,
            initiator: undefined,
            securityParameters: mySecurityParameters,
            /* TODO: Elsewhere, do not let the other DSA choose the OB ID.
            There is no way for the initiator to signal back that the ID is
            unavailable if it chooses one already taken. */
            bindingID,
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
        },
    );
    let err_message;
    if ("result" in outcome) {
        const result = outcome.result;
        const data = getOptionallyProtectedValue(result.parameter);
        if ("signed" in result.parameter) {
            try {
                await verifySIGNED(
                    ctx,
                    undefined,
                    data.securityParameters?.certification_path,
                    result.invoke_id,
                    false,
                    result.parameter.signed,
                    DER,
                    true,
                    "result",
                    undefined,
                );
            } catch (e) {
                /* We intentionally do nothing if we receive an invalid
                signature. If we refuse to act on receipt, this could
                result in this DSA spamming the master with one new shadow
                operational binding requests each time it boots up. By the
                time the response comes back, the master DSA has already
                committed to shadowing. Unfortunately, the best we can do
                is merely log that the signature was invalid. */
            }
        }
        if (!data.bindingID) {
            ctx.log.error(ctx.i18n.t("err:other_dsa_did_not_choose_binding_id"));
            return;
        }
        if (!data.bindingType.isEqualTo(shadowOperationalBinding["&id"]!)) {
            ctx.log.error(ctx.i18n.t("err:other_dsa_changed_ob_type"));
            return;
        }
        const accessPointId = await saveAccessPoint(ctx, yourAccessPoint, PrismaKnowledge.OB_REQUEST);
        const createdOB = await ctx.db.operationalBinding.create({
            data: {
                accepted: true,
                outbound: true,
                binding_type: shadowOperationalBinding["&id"]!.toString(),
                binding_identifier: Number(data.bindingID.identifier),
                binding_version: (data.bindingID.version !== undefined)
                    ? Number(data.bindingID.version)
                    : 0,
                agreement_ber: Buffer.from(
                    shadowOperationalBinding.encoderFor["&Agreement"]!(agreement, DER).toBytes()
                ),
                access_point: {
                    connect: {
                        id: accessPointId,
                    },
                },
                initiator: OperationalBindingInitiator.ROLE_B,
                initiator_ber: Buffer.from([ 5, 0 ]), // NULL
                validity_start: now,
                requested_time: now,
                security_certification_path: mySecurityParameters?.certification_path
                    ? _encode_CertificationPath(mySecurityParameters.certification_path, DER).toBytes()
                    : undefined,
                security_name: mySecurityParameters?.name?.map((rdn) => rdnToJson(rdn)),
                security_time: mySecurityParameters?.time
                    ? getDateFromTime(mySecurityParameters.time)
                    : undefined,
                security_random: mySecurityParameters?.random
                    ? Buffer.from(packBits(mySecurityParameters.random))
                    : undefined,
                security_target: (mySecurityParameters?.target !== undefined)
                    ? Number(mySecurityParameters.target)
                    : undefined,
                security_operationCode: mySecurityParameters?.operationCode && codeToString(mySecurityParameters.operationCode),
                security_errorProtection: (mySecurityParameters?.errorProtection !== undefined)
                    ? Number(mySecurityParameters.errorProtection)
                    : undefined,
                security_errorCode: mySecurityParameters?.errorCode && codeToString(mySecurityParameters.errorCode),
                source_credentials_type: 1,
                source_certificate_path: mySecurityParameters?.certification_path
                    ? _encode_CertificationPath(mySecurityParameters.certification_path, DER).toBytes()
                    : undefined,
                source_strong_name: ctx.dsa.accessPoint.ae_title.rdnSequence.map(rdnToJson),
                supply_contexts: null,
            },
            select: {
                id: true,
                uuid: true,
            },
        });
        const _ = await becomeShadowConsumer(
            ctx,
            agreement,
            myAccessPoint,
            bindingID,
            createdOB.id,
            now,
        );
        return;
    } else if ("error" in outcome) {
        const error = outcome.error;
        if (compareCode(error.code, operationalBindingError["&errorCode"]!)) {
            const param = operationalBindingError.decoderFor["&ParameterType"]!(error.parameter);
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        param.signed.toBeSigned.securityParameters?.certification_path,
                        error.invoke_id,
                        false,
                        param.signed,
                        DER,
                        true,
                        "result",
                        undefined,
                    );
                } catch {}
            }
            const data = getOptionallyProtectedValue(param);
            const logInfo = _.pick(data, ["problem", "bindingType", "retryAt"]);
            ctx.log.error(ctx.i18n.t("log:repl_everything_establish_ob_error", { code: data.problem }), logInfo);
        } else if (compareCode(error.code, securityError["&errorCode"]!)) {
            const param = securityError.decoderFor["&ParameterType"]!(error.parameter);
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        param.signed.toBeSigned.securityParameters?.certification_path,
                        error.invoke_id,
                        false,
                        param.signed,
                        DER,
                        true,
                        "result",
                        undefined,
                    );
                } catch {}
            }
            const data = getOptionallyProtectedValue(param);
            const logInfo = _.pick(data, ["problem"]);
            ctx.log.error(ctx.i18n.t("log:repl_everything_establish_abort", { code: data.problem }), logInfo);
        } else {
            ctx.log.error(ctx.i18n.t("log:repl_everything_establish_sec_error", { code: printCode(error.code) }));
        }
        return;
    } else if ("reject" in outcome) {
        const reject = outcome.reject;
        err_message = ctx.i18n.t("log:repl_everything_establish_reject", { code: rejectReasonToString(reject.problem) });
    } else if ("abort" in outcome) {
        const abort = outcome.abort;
        err_message = ctx.i18n.t("log:repl_everything_establish_abort", { code: abortReasonToString(abort) });
    } else if ("timeout" in outcome) {
        err_message = ctx.i18n.t("log:repl_everything_establish_timeout");
    } else if ("other" in outcome) {
        const other = outcome.other;
        err_message = ctx.i18n.t("log:repl_everything_establish_timeout", { e: other });
    } else {
        err_message = "?";
    }
    ctx.log.error(err_message);
    return;
}

async function modifyReplicateEverythingAgreement(
    ctx: MeerkatContext,
    assn: DOPClient,
    binding_identifier: number,
    binding_version: number,
    myAccessPoint: AccessPoint,
    yourAccessPoint: AccessPoint,
    agreement: ShadowingAgreementInfo,
    validity_start: Date,
    validity_end: Date | null | undefined,
    now: Date,
): Promise<void> {
    const mySecurityParameters = createSecurityParameters(
        ctx,
        true,
        undefined,
        modifyOperationalBinding["&operationCode"],
        undefined,
        true,
    );
    const bindingID = new OperationalBindingID(
        // Code in doesReplicateEverythingSOBNeedReEstablishment ensures sob is not null
        binding_identifier,
        binding_version + 1,
    );
    const modificationParameter = new ModificationParameter([]);
    const outcome = await assn.modifySOBWithSupplier(
        {
            accessPoint: myAccessPoint,
            initiator: modificationParameter,
            securityParameters: mySecurityParameters,
            /* TODO: Elsewhere, do not let the other DSA choose the OB ID.
            There is no way for the initiator to signal back that the ID is
            unavailable if it chooses one already taken. */
            bindingID,
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
        },
    );
    let err_message;
    if ("result" in outcome) {
        const result = outcome.result;
        const data = ("protected_" in result.parameter)
            ? getOptionallyProtectedValue(result.parameter.protected_)
            : undefined;
        if (data && ("protected_" in result.parameter) && ("signed" in result.parameter.protected_)) {
            try {
                await verifySIGNED(
                    ctx,
                    undefined,
                    data.securityParameters?.certification_path,
                    result.invoke_id,
                    false,
                    result.parameter.protected_.signed,
                    DER,
                    true,
                    "result",
                    undefined,
                );
            } catch (e) {
                /* We intentionally do nothing if we receive an invalid
                signature. If we refuse to act on receipt, this could
                result in this DSA spamming the master with one new shadow
                operational binding requests each time it boots up. By the
                time the response comes back, the master DSA has already
                committed to shadowing. Unfortunately, the best we can do
                is merely log that the signature was invalid. */
            }
        }
        if (
            data?.newBindingID.identifier !== bindingID.identifier
            || data.newBindingID.version !== bindingID.version
        ) {
            ctx.log.error(ctx.i18n.t("new_binding_id_changed"));
        }
        if (data && !data.bindingType.isEqualTo(shadowOperationalBinding["&id"]!)) {
            ctx.log.error(ctx.i18n.t("err:other_dsa_changed_ob_type"));
        }
        const accessPointId = await saveAccessPoint(ctx, yourAccessPoint, PrismaKnowledge.OB_REQUEST);
        const createdOB = await ctx.db.operationalBinding.create({
            data: {
                accepted: true,
                outbound: true,
                binding_type: shadowOperationalBinding["&id"]!.toString(),
                binding_identifier: Number(bindingID.identifier),
                binding_version: (bindingID.version !== undefined)
                    ? Number(bindingID.version)
                    : 0,
                agreement_ber: Buffer.from(
                    shadowOperationalBinding.encoderFor["&Agreement"]!(agreement, DER).toBytes()
                ),
                access_point: {
                    connect: {
                        id: accessPointId,
                    },
                },
                validity_start,
                validity_end,
                initiator: OperationalBindingInitiator.ROLE_B,
                initiator_ber: _encode_ModificationParameter(modificationParameter, DER).toBytes(),
                requested_time: now,
                security_certification_path: mySecurityParameters?.certification_path
                    ? _encode_CertificationPath(mySecurityParameters.certification_path, DER).toBytes()
                    : undefined,
                security_name: mySecurityParameters?.name?.map((rdn) => rdnToJson(rdn)),
                security_time: mySecurityParameters?.time
                    ? getDateFromTime(mySecurityParameters.time)
                    : undefined,
                security_random: mySecurityParameters?.random
                    ? Buffer.from(packBits(mySecurityParameters.random))
                    : undefined,
                security_target: (mySecurityParameters?.target !== undefined)
                    ? Number(mySecurityParameters.target)
                    : undefined,
                security_operationCode: mySecurityParameters?.operationCode && codeToString(mySecurityParameters.operationCode),
                security_errorProtection: (mySecurityParameters?.errorProtection !== undefined)
                    ? Number(mySecurityParameters.errorProtection)
                    : undefined,
                security_errorCode: mySecurityParameters?.errorCode && codeToString(mySecurityParameters.errorCode),
                source_credentials_type: 1,
                source_certificate_path: mySecurityParameters?.certification_path
                    ? _encode_CertificationPath(mySecurityParameters.certification_path, DER).toBytes()
                    : undefined,
                source_strong_name: ctx.dsa.accessPoint.ae_title.rdnSequence.map(rdnToJson),
                supply_contexts: null,
            },
            select: {
                id: true,
                binding_identifier: true,
            },
        });
        // We can delete these, supplier or not, since OBs are supposed to
        // be unique across (type, id).
        const t1 = ctx.pendingShadowingUpdateCycles.get(createdOB.binding_identifier);
        const t2 = ctx.shadowUpdateCycles.get(createdOB.binding_identifier);
        if (t1) {
            clearSafeTimeout(t1);
        }
        if (t2) {
            clearTimeout(t2);
        }
        ctx.pendingShadowingUpdateCycles.delete(createdOB.binding_identifier);
        ctx.shadowUpdateCycles.delete(createdOB.binding_identifier);
        // NOTE: Using becomeShadowConsumer is the correct function, even for a modification.
        const _ = await becomeShadowConsumer(
            ctx,
            agreement,
            myAccessPoint,
            bindingID,
            createdOB.id,
            now,
        );
        return;
    } else if ("error" in outcome) {
        const error = outcome.error;
        if (compareCode(error.code, operationalBindingError["&errorCode"]!)) {
            const param = operationalBindingError.decoderFor["&ParameterType"]!(error.parameter);
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        param.signed.toBeSigned.securityParameters?.certification_path,
                        error.invoke_id,
                        false,
                        param.signed,
                        DER,
                        true,
                        "result",
                        undefined,
                    );
                } catch {}
            }
            const data = getOptionallyProtectedValue(param);
            const logInfo = _.pick(data, ["problem", "bindingType", "retryAt"]);
            ctx.log.error(ctx.i18n.t("log:repl_everything_modify_ob_error", { code: data.problem }), logInfo);
        } else if (compareCode(error.code, securityError["&errorCode"]!)) {
            const param = securityError.decoderFor["&ParameterType"]!(error.parameter);
            if ("signed" in param) {
                try {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        param.signed.toBeSigned.securityParameters?.certification_path,
                        error.invoke_id,
                        false,
                        param.signed,
                        DER,
                        true,
                        "result",
                        undefined,
                    );
                } catch {}
            }
            const data = getOptionallyProtectedValue(param);
            const logInfo = _.pick(data, ["problem"]);
            ctx.log.error(ctx.i18n.t("log:repl_everything_modify_abort", { code: data.problem }), logInfo);
        } else {
            ctx.log.error(ctx.i18n.t("log:repl_everything_modify_sec_error", { code: printCode(error.code) }));
        }
        return;
    } else if ("reject" in outcome) {
        const reject = outcome.reject;
        err_message = ctx.i18n.t("log:repl_everything_modify_reject", { code: rejectReasonToString(reject.problem) });
    } else if ("abort" in outcome) {
        const abort = outcome.abort;
        err_message = ctx.i18n.t("log:repl_everything_modify_abort", { code: abortReasonToString(abort) });
    } else if ("timeout" in outcome) {
        err_message = ctx.i18n.t("log:repl_everything_modify_timeout");
    } else if ("other" in outcome) {
        const other = outcome.other;
        err_message = ctx.i18n.t("log:repl_everything_modify_timeout", { e: other });
    } else {
        err_message = "?";
    }
    ctx.log.error(err_message);
    return;
}

export
async function replicateEverythingFrom(
    ctx: MeerkatContext,
): Promise<void> {
    if (!ctx.config.shadowing.replicateEverythingFrom) {
        return; // This was not supposed to be called if this was the case.
    }
    let url = ctx.config.shadowing.replicateEverythingFrom;
    const ss: boolean = ctx
        .config
        .shadowing
        .replicateEverythingFrom
        .protocol
        .startsWith("statefulset+");
    let myAccessPointNSAPs = ctx.config.myAccessPointNSAPs;
    if (ss) {
        if (!process.env.HOSTNAME) {
            ctx.log.error(ctx.i18n.t("log:repl_everything_within_ss_but_no_hostname_ev"));
            return;
        }
        const lioh = process.env.HOSTNAME.lastIndexOf("-");
        if (process.env.HOSTNAME.lastIndexOf("-") === -1) {
            ctx.log.error(ctx.i18n.t("log:repl_everything_within_ss_but_no_ss"));
            return;
        }
        if (process.env.HOSTNAME.endsWith("-0")) {
            ctx.log.info(ctx.i18n.t("log:repl_everything_within_ss_i_am_master"));
            return;
        }
        const baseHostname = process.env.HOSTNAME.slice(0, lioh);
        const dnsSuffix = url.hostname;
        const masterHost = `${baseHostname}-0.${dnsSuffix}`;
        const masterScheme = url.protocol.slice("statefulset+".length);
        let masterUrl = `${masterScheme}//${masterHost}`;
        if (url.port.length > 0) {
            masterUrl += ":";
            masterUrl += url.port;
        }
        // Everything else is ignored.
        url = URL.parse(masterUrl)!;

        /* If we are in a statefulset, we have to use our private hostname:
        the ctx.config.myAccessPointNSAPs will not be accurate for every
        pod in the statefulset. */
        const myfqdn = process.env.HOSTNAME + "." + dnsSuffix;
        let myurl = `${masterScheme}//${myfqdn}`;
        if (url.port.length > 0) {
            myurl += ":";
            myurl += url.port;
        }
        myAccessPointNSAPs = [
            uriToNSAP(
                myurl,
                masterScheme.toLowerCase() === "itot:",
            ),
        ];
    }
    const replicateFromNSAP = uriToNSAP(url.toString(), url.protocol === "itot:");
    const now = new Date();
    const sob = await ctx.db.operationalBinding.findFirst({
        where: {
            is_the_replicate_everything_ob: true,
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
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
            id: true,
            access_point: {
                select: {
                    ber: true,
                },
            },
            binding_identifier: true,
            binding_version: true,
            validity_start: true,
            validity_end: true,
        },
    });
    const status = doesReplicateEverythingSOBNeedReEstablishment(
        sob?.access_point?.ber,
        replicateFromNSAP,
        sob?.binding_version,
        sob?.id,
    );
    if (status == ReplicateEverythingSOBStatus.Good) {
        ctx.log.debug(ctx.i18n.t("log:repl_everything_url_unchanged"));
        return;
    }
    ctx.log.info(ctx.i18n.t("log:repl_everything_url_changed"));
    let yourAccessPoint = new AccessPoint(
        ctx.config.shadowing.replicateEverythingFromAETitle ?? {
            rdnSequence: [],
        },
        new PresentationAddress(
            undefined,
            undefined,
            undefined,
            [replicateFromNSAP],
        ),
    );
    const myAccessPoint = new AccessPoint(
        {
            rdnSequence: ctx.config.signing.certPath
                ?.[ctx.config.signing.certPath.length - 1]
                ?.toBeSigned.subject.rdnSequence ?? [],
        },
        new PresentationAddress(
            undefined,
            undefined,
            undefined,
            myAccessPointNSAPs,
        ),
    );
    const assn = await bindForOBM(ctx, undefined, undefined, yourAccessPoint, false, true);
    if (!assn) {
        ctx.log.error(ctx.i18n.t("log:failed_to_bind_replicate_everything"));
        return;
    }

    if (assn.peer_ae_title) {
        yourAccessPoint = new AccessPoint(
            assn.peer_ae_title,
            yourAccessPoint.address,
            yourAccessPoint.protocolInformation,
            yourAccessPoint._unrecognizedExtensionsList,
        );
    }

    // Copied from elsewhere. Search for b6c76b30-80d6-4925-a50d-07553ac49b6e.
    // Determine the shadow supplier's AE-title if it is not known.
    // if (yourAccessPoint.ae_title.rdnSequence.length === 0) {
    //     const bind_outcome = await assn.bind({
    //         protocol_id: id_ac_directoryOperationalBindingManagementAC,
    //         parameter: new DSABindArgument(
    //             { // Intentional random password so auth fails.
    //                 simple: new SimpleCredentials(
    //                     [],
    //                     undefined,
    //                     {
    //                         unprotected: randomBytes(16),
    //                     },
    //                 ),
    //             },
    //         ),
    //         calling_ae_title: {
    //             directoryName: ctx.dsa.accessPoint.ae_title,
    //         },
    //         calling_ap_invocation_identifier: process.pid,
    //         implementation_information: "Meerkat DSA",
    //         timeout: 15000,
    //     });
    //     if ("result" in bind_outcome) {
    //         const result = bind_outcome.result;
    //         if (result.responding_ae_title && "directoryName" in result.responding_ae_title) {
    //             yourAccessPoint = new AccessPoint(
    //                 result.responding_ae_title.directoryName,
    //                 yourAccessPoint.address,
    //                 yourAccessPoint.protocolInformation,
    //                 yourAccessPoint._unrecognizedExtensionsList,
    //             );
    //         }
    //         const _ = await assn.unbind();
    //     } else if ("error" in bind_outcome) {
    //         const error = bind_outcome.error;
    //         if (error.responding_ae_title && "directoryName" in error.responding_ae_title) {
    //             yourAccessPoint = new AccessPoint(
    //                 error.responding_ae_title.directoryName,
    //                 yourAccessPoint.address,
    //                 yourAccessPoint.protocolInformation,
    //                 yourAccessPoint._unrecognizedExtensionsList,
    //             );
    //         }
    //     }
    // }

    const agreement = createReplicateEverythingAgreement();
    if (status === ReplicateEverythingSOBStatus.Establish) {
        return establishReplicateEverythingAgreement(
            ctx,
            assn,
            myAccessPoint,
            yourAccessPoint,
            agreement,
            now,
        );
    } else {
        return modifyReplicateEverythingAgreement(
            ctx,
            assn,
            sob!.binding_identifier,
            sob!.binding_version,
            myAccessPoint,
            yourAccessPoint,
            agreement,
            sob!.validity_start,
            sob?.validity_end,
            now,
        );
    }
}

export default replicateEverythingFrom;

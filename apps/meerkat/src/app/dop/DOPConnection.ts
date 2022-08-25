import {
    ClientAssociation,
    OperationStatistics,
    SecurityError,
    UnknownOperationError,
    MistypedPDUError,
    DSABindError,
    BindReturn,
    MistypedArgumentError,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { ASN1Element, ASN1TagClass, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
    IDMStatus,
} from "@wildboar/idm";
import {
    DSABindArgument,
    _decode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    _encode_DSABindResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindResult.ta";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import {
    _encode_Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    SecurityErrorData,
    _encode_SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import {
    _encode_OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    _decode_SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import {
    _decode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    IdmReject_reason_duplicateInvokeIDRequest,
    IdmReject_reason_unsupportedOperationRequest,
    IdmReject_reason_unknownOperationRequest,
    IdmReject_reason_mistypedPDU,
    IdmReject_reason_mistypedArgumentRequest,
    IdmReject_reason_resourceLimitationRequest,
    IdmReject_reason_unknownError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import {
    Abort_unboundRequest,
    Abort_invalidProtocol,
    Abort_reasonNotSpecified,
    Abort_invalidPDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import establishOperationalBinding from "./operations/establishOperationalBinding";
import modifyOperationalBinding from "./operations/modifyOperationalBinding";
import terminateOperationalBinding from "./operations/terminateOperationalBinding";
import {
    _decode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    _encode_EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import {
    _decode_ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
import {
    _encode_ModifyOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResult.ta";
import {
    _decode_TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import {
    _encode_TerminateOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";
import versions from "./versions";
import { bind as doBind } from "../authn/dsaBind";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";
import {
    SecurityProblem_inappropriateAuthentication,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import getServerStatistics from "../telemetry/getServerStatistics";
import getConnectionStatistics from "../telemetry/getConnectionStatistics";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import isDebugging from "is-debugging";
import { strict as assert } from "assert";
import { flatten } from "flat";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import { printInvokeId } from "../utils/printInvokeId";
import {
    getStatisticsFromSecurityParameters,
} from "../telemetry/getStatisticsFromSecurityParameters";
import { signDirectoryError } from "../pki/signDirectoryError";
import {
    compareAuthenticationLevel,
} from "@wildboar/x500/src/lib/comparators/compareAuthenticationLevel";
import {
    _encode_DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as _encode_DBE_Param,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import stringifyDN from "../x500/stringifyDN";
import { AuthenticationLevel_basicLevels } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import { isArgumentSigned } from "../x500/isArgumentSigned";
import { verifySIGNED } from "../pki/verifySIGNED";
import {
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import printCode from "../utils/printCode";

const securityParametersTagByOpCode: Map<number, number> = new Map([
    [100, 8], // establishOperationalBinding
    [102, 9], // modifyOperationalBinding
    [101, 6], // terminateOperationalBinding
]);

/**
 * @summary The handles a request, but not errors
 * @description
 *
 * This function handles a request, but allows the errors to be thrown.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The request
 *
 * @function
 * @async
 */
async function handleRequest (
    ctx: MeerkatContext,
    assn: DOPAssociation, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new MistypedPDUError();
    }
    switch (request.opcode.local) {
    case (100): { // establish
        const arg = _decode_EstablishOperationalBindingArgument(request.argument);
        const result = await establishOperationalBinding(ctx, assn, request.invokeID, arg);
        assn.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_EstablishOperationalBindingResult(result, DER),
        );
        break;
    }
    case (102): { // modify
        const arg = _decode_ModifyOperationalBindingArgument(request.argument);
        const result = await modifyOperationalBinding(ctx, assn, {
            present: request.invokeID,
        }, arg);
        assn.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ModifyOperationalBindingResult(result, DER),
        );
        break;
    }
    case (101): { // terminate
        const arg = _decode_TerminateOperationalBindingArgument(request.argument);
        const result = await terminateOperationalBinding(ctx, assn, {
            present: request.invokeID,
        }, arg);
        assn.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_TerminateOperationalBindingResult(result, DER),
        );
        break;
    }
    default: {
        throw new UnknownOperationError();
    }
    }
}

/**
 * @summary Process a request
 * @description
 *
 * Handles a request as well as any errors that might be thrown in the process.
 *
 * You will notice that this implementation does not keep track of invocations,
 * because there is no abandon operation defined for the DOP.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The request
 *
 * @function
 * @async
 */
async function handleRequestAndErrors (
    ctx: MeerkatContext,
    assn: DOPAssociation, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        assn.idm.writeReject(request.invokeID, IdmReject_reason_mistypedPDU);
        return;
    }
    const opcode = Number(request.opcode.local);
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId({ present: request.invokeID }),
    };
    if ((request.invokeID < 0) || (request.invokeID > Number.MAX_SAFE_INTEGER)) {
        ctx.log.warn(ctx.i18n.t("log:unusual_invoke_id", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
        }), logInfo);
        assn.idm.writeAbort(Abort_invalidPDU);
        return;
    }
    if (assn.invocations.has(Number(request.invokeID))) {
        ctx.log.warn(ctx.i18n.t("log:dup_invoke_id", {
            host: assn.socket.remoteAddress,
            iid: request.invokeID.toString(),
            cid: assn.id,
        }), logInfo);
        assn.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        return;
    }
    if (assn.invocations.size >= ctx.config.maxConcurrentOperationsPerConnection) {
        ctx.log.warn(ctx.i18n.t("log:max_concurrent_op", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
            iid: request.invokeID.toString(),
        }), logInfo);
        assn.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        return;
    }
    ctx.log.debug(ctx.i18n.t("log:received_request", {
        protocol: "DOP",
        iid: request.invokeID.toString(),
        op: printCode(request.opcode),
        cid: assn.id,
    }), logInfo);
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(ctx),
        connection: getConnectionStatistics(assn),
        bind: {
            protocol: dop_ip["&id"]!.toString(),
        },
        request: {
            invokeId: Number(request.invokeID),
            operationCode: codeToString(request.opcode),
        },
    };
    const startTime = Date.now();
    try {
        /**
         * We block DOP requests that do not meet some configured minimum of
         * authentication, because requests--accepted or not--take up database
         * storage, so we need to enforce a modicum of authentication so
         * nefarious users cannot initiate a storage-exhaustion-based denial of
         * service attack.
         */
        if (
            !("basicLevels" in assn.authLevel)
            || compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.ob.minAuthRequired,
                new AuthenticationLevel_basicLevels(
                    assn.authLevel.basicLevels.level,
                    assn.authLevel.basicLevels.localQualifier,
                    isArgumentSigned(request.opcode, request.argument),
                ),
            )
        ) {
            throw new SecurityError(
                ctx.i18n.t("err:not_authorized_ob"),
                new SecurityErrorData(
                    SecurityProblem_inappropriateAuthentication,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        true,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    false,
                    undefined,
                ),
                /**
                 * It is difficult to extract the errorProtection from DOP
                 * arguments, because security parameters has a different tag
                 * based on the arguments.
                 */
                false,
            );
        }
        if (isArgumentSigned(request.opcode, request.argument)) {
            const signedArgElements = request.argument.sequence;
            const tbsElement = signedArgElements[0];
            const securityParametersTagNumber: number | undefined = securityParametersTagByOpCode.get(opcode);
            if (securityParametersTagNumber === undefined) {
                throw new MistypedArgumentError("d9375ea1-43b1-498e-9a3f-ff8b2da033c2");
            }
            const spElement = tbsElement.sequence.find((el) => (
                (el.tagClass === ASN1TagClass.context)
                && (el.tagNumber === securityParametersTagNumber)
            ));
            if (!spElement) {
                throw new MistypedArgumentError("0bac794f-6962-4115-8f49-0345591a4a98");
            }
            const securityParameters = _decode_SecurityParameters(spElement.inner);
            const sigAlgElement = signedArgElements[1];
            const sigValueElement = signedArgElements[2];
            if (
                !tbsElement
                || !sigAlgElement
                || !sigValueElement
                || !securityParameters.certification_path
            ) {
                throw new MistypedArgumentError("0d5a1692-0c8a-4b7e-bd8d-9590e056b907");
            }
            const certPath = securityParameters.certification_path;
            const sigAlg = _decode_AlgorithmIdentifier(sigAlgElement);
            await verifySIGNED(
                ctx,
                assn,
                certPath,
                {
                    present: Number(request.invokeID),
                },
                false,
                new SIGNED(
                    tbsElement,
                    sigAlg,
                    sigValueElement.bitString,
                    undefined,
                    undefined,
                ),
                () => tbsElement,
                (assn.bind?.versions?.[Versions_v2] === TRUE_BIT),
            );
        }
        await handleRequest(ctx, assn, request);
        ctx.telemetry.trackRequest({
            name: codeToString(request.opcode),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: 200,
            success: true,
            properties: {
                ...flatten(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } catch (e) {
        ctx.telemetry.trackRequest({
            name: codeToString(request.opcode),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: (e instanceof errors.DirectoryError || e instanceof errors.TransportError)
                ? 400
                : 500,
            success: false,
            properties: {
                ...flatten(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
        ctx.log.info(`${assn.id}#${request.invokeID}: ${e?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
        if (isDebugging) {
            console.error(e);
        }
        if (!stats.outcome) {
            stats.outcome = {};
        }
        if (!stats.outcome.error) {
            stats.outcome.error = {};
        }
        if (e instanceof Error) {
            stats.outcome.error.stack = e.stack;
        }
        if (e instanceof errors.OperationalBindingError) {
            const code = _encode_Code(SecurityError.errcode, DER);
            // DOP associations are ALWAYS authorized to receive signed responses.
            const signError: boolean = e.shouldBeSigned;
            const param: typeof operationalBindingError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_OpBindingErrorParam)
                : {
                    unsigned: e.data,
                };
            const payload = operationalBindingError.encoderFor["&ParameterType"]!(param, DER);
            assn.idm.writeError(request.invokeID, code, payload);
            stats.outcome.error.problem = e.data.problem;
            stats.outcome.error.bindingType = e.data.bindingType?.toString();
            stats.outcome.error.retryAt = e.data.retryAt?.toString();
            stats.outcome.error.newAgreementProposed = Boolean(e.data.agreementProposal);
        } else if (e instanceof SecurityError) {
            const code = _encode_Code(errors.SecurityError.errcode, DER);
            // DOP associations are ALWAYS authorized to receive signed responses.
            const signError: boolean = e.shouldBeSigned;
            const param: typeof securityError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_SecurityErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = securityError.encoderFor["&ParameterType"]!(param, DER);
            assn.idm.writeError(request.invokeID, code, payload);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof UnknownOperationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else if (e instanceof errors.DuplicateInvokeIdError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        } else if (e instanceof errors.UnsupportedOperationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unsupportedOperationRequest);
        } else if (e instanceof errors.UnknownOperationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else if (e instanceof errors.MistypedPDUError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_mistypedPDU);
        } else if (e instanceof errors.MistypedArgumentError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_mistypedArgumentRequest);
        } else if (e instanceof errors.ResourceLimitationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        } else if (e instanceof errors.UnknownError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownError);
        } else if (e instanceof errors.UnboundRequestError) {
            assn.idm.writeAbort(Abort_unboundRequest);
        } else if (e instanceof errors.InvalidProtocolError) {
            assn.idm.writeAbort(Abort_invalidProtocol);
        } else if (e instanceof errors.ReasonNotSpecifiedError) {
            assn.idm.writeAbort(Abort_reasonNotSpecified);
        } else {
            assn.idm.writeAbort(Abort_reasonNotSpecified);
        }
        ctx.telemetry.trackException({
            exception: e,
            properties: {
                ...flatten(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    }
}

/**
 * @summary A Directory Operational Binding Management Protocol (DOP) association.
 * @description
 *
 * A Directory Operational Binding Management Protocol (DOP) association.
 *
 * @kind class
 */
export default
class DOPAssociation extends ClientAssociation {

    /**
     * This exists because ITU Recommendation X.519 states that requests may
     * be sent before the bind is complete, as long as they are sent after the
     * bind request. This means that we need to enqueue requests, then execute
     * them once the bind is complete, if it completes. This array stores the
     * requests that have come in before the association was bound.
     */
    public readonly prebindRequests: Request[] = [];
    public bind: DSABindArgument | undefined;

    /**
     * @summary Attempt a bind
     * @description
     *
     * Attempt a bind
     *
     * @param arg The encoded bind argument
     * @public
     * @function
     * @async
     */
    public async attemptBind (arg: ASN1Element): Promise<void> {
        const arg_ = _decode_DSABindArgument(arg);
        const ctx = this.ctx;
        const idm = this.idm;
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
        const telemetryProperties = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            protocol: dop_ip["&id"]!.toString(),
            administratorEmail: ctx.config.administratorEmail,
        };
        const extraLogData = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        };
        /**
         * ITU Recommendation X.518 (2019), Section 11.1.4 states that:
         *
         * > If the Bind request was using strong authentication or if SPKM
         * > credentials were supplied, then the Bind responder may sign the
         * > error parameters.
         */
        const signErrors: boolean = !!(
            this.authorizedForSignedErrors
            && arg_.credentials
            && (
                ("strong" in arg_.credentials)
                || ("spkm" in arg_.credentials)
            )
        );
        const startBindTime = new Date();
        let outcome!: BindReturn;
        try {
            outcome = await doBind(ctx, this.idm.socket, arg_, signErrors);
        } catch (e) {
            const logInfo = {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                association_id: this.id,
            };
            if (e instanceof DSABindError) {
                ctx.log.warn(e.message, logInfo);
                const endBindTime = new Date();
                const bindTime: number = Math.abs(differenceInMilliseconds(startBindTime, endBindTime));
                const totalTimeInMilliseconds: number = this.ctx.config.bindMinSleepInMilliseconds
                    + crypto.randomInt(ctx.config.bindSleepRangeInMilliseconds);
                const sleepTime: number = Math.abs(totalTimeInMilliseconds - bindTime);
                await sleep(sleepTime);
                const err: typeof directoryBindError["&ParameterType"] = {
                    unsigned: e.data,
                };
                const payload = signErrors
                    ? signDirectoryError(ctx, e.data, _encode_DBE_Param)
                    : err;
                const error = directoryBindError.encoderFor["&ParameterType"]!(payload, DER);
                idm.writeBindError(dop_ip["&id"]!, error);
                const serviceProblem = ("serviceError" in e.data.error)
                    ? e.data.error.serviceError
                    : undefined;
                const securityProblem = ("serviceError" in e.data.error)
                    ? e.data.error.serviceError
                    : undefined;
                ctx.telemetry.trackException({
                    exception: e,
                    properties: {
                        ...telemetryProperties,
                        serviceProblem,
                        securityProblem,
                        ...(e.data.securityParameters
                            ? getStatisticsFromSecurityParameters(e.data.securityParameters)
                            : {}),
                    },
                    measurements: {
                        bytesRead: this.socket.bytesRead,
                        bytesWritten: this.socket.bytesWritten,
                        idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            } else {
                ctx.log.warn(`${this.id}: ${e.constructor?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
                if (isDebugging) {
                    console.error(e);
                }
                idm.writeAbort(Abort_reasonNotSpecified);
                ctx.telemetry.trackException({
                    exception: e,
                    properties: telemetryProperties,
                    measurements: {
                        bytesRead: this.socket.bytesRead,
                        bytesWritten: this.socket.bytesWritten,
                        idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            }
            return;
        }
        this.reset();
        this.bind = arg_;
        this.boundEntry = outcome.boundVertex;
        this.boundNameAndUID = outcome.boundNameAndUID;
        this.authLevel = outcome.authLevel;
        if (
            ("basicLevels" in outcome.authLevel)
            && (outcome.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
        ) {
            assert(!ctx.config.forbidAnonymousBind, "Somehow a DSA bound anonymously when anonymous binds are forbidden.");
            ctx.log.info(ctx.i18n.t("log:connection_bound_anon", {
                source: remoteHostIdentifier,
                protocol: "DOP",
                aid: this.id,
            }), extraLogData);
        } else {
            ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                source: remoteHostIdentifier,
                protocol: "DOP",
                aid: this.id,
                dn: this.boundNameAndUID?.dn
                    ? stringifyDN(ctx, this.boundNameAndUID.dn)
                    : "",
            }), extraLogData);
        }
        if (
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.minAuthRequired,
                this.authLevel.basicLevels,
            )
        ) {
            this.authorizedForSignedResults = true;
        }
        if (
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.signedErrorsMinAuthRequired,
                this.authLevel.basicLevels,
            )
        ) {
            this.authorizedForSignedErrors = true;
        }
        const bindResult = new DSABindArgument(
            undefined, // TODO: Supply return credentials. NOTE that the specification says that this must be the same CHOICE that the user supplied.
            versions,
        );
        idm.writeBindResult(dop_ip["&id"]!, _encode_DSABindResult(bindResult, DER));
        idm.events.removeAllListeners("request");
        idm.events.on("request", this.handleRequest.bind(this));
        for (const req of this.prebindRequests) {
            // We process these requests serially, just because there could be
            // many of them backed up prior to binding.
            await handleRequestAndErrors(this.ctx, this, req).catch();
        }
    }

    /**
     * @summary Handle a request
     * @description
     *
     * Handle a request
     *
     * @param request The request
     * @private
     * @function
     */
    private handleRequest (request: Request): void {
        handleRequestAndErrors(this.ctx, this, request); // INTENTIONAL_NO_AWAIT
    }

    private reset (): void {
        for (const invocation of this.invocations.values()) {
            invocation.abandonTime = new Date();
            this.invocations.clear();
        }
        this.ctx.db.enqueuedListResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        }).then().catch();
        this.ctx.db.enqueuedSearchResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        }).then().catch();
    }

    /**
     * @summary Handle the unbind notification
     * @description
     *
     * This function handles the unbind notification from a client.
     *
     * @private
     * @function
     * @async
     */
    private async handleUnbind (): Promise<void> {
        if (this.idm.remoteStatus !== IDMStatus.BOUND) {
            return; // We don't want users to be able to spam unbinds.
        }
        this.reset();
        this.ctx.telemetry.trackRequest({
            name: "UNBIND",
            url: this.ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${this.ctx.config.idm.port}`,
            duration: 1,
            resultCode: 200,
            success: true,
            properties: {
                remoteFamily: this.idm.s.remoteFamily,
                remoteAddress: this.idm.s.remoteAddress,
                remotePort: this.idm.s.remotePort,
                administratorEmail: this.ctx.config.administratorEmail,
                association_id: this.id,
            },
            measurements: {
                bytesRead: this.idm.socket.bytesRead,
                bytesWritten: this.idm.socket.bytesWritten,
                idmFramesReceived: this.idm.getFramesReceived(),
            },
        });
        this.ctx.log.warn(this.ctx.i18n.t("log:connection_unbound", {
            ctype: DOPAssociation.name,
            cid: this.id,
            protocol: "DOP",
        }), {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        });
    }

    /**
     * @constructor
     * @param ctx The context object
     * @param idm The underlying IDM transport socket
     */
    constructor (
        readonly ctx: MeerkatContext,
        readonly idm: IDMConnection,
    ) {
        super();
        this.socket = idm.s;
        assert(ctx.config.dop.enabled, "User somehow bound via DOP when it was disabled.");
        const logInfo = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        };
        idm.events.on("unbind", this.handleUnbind.bind(this));
        idm.events.removeAllListeners("request");
        idm.events.on("request", (request: Request) => {
            if (this.prebindRequests.length >= ctx.config.maxPreBindRequests) {
                ctx.log.warn(ctx.i18n.t("log:too_many_prebind_requests", {
                    host: this.socket.remoteAddress,
                    cid: this.id,
                }), logInfo);
                idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
                return;
            }
            this.prebindRequests.push(request);
        });
        if ( // This allows bind errors to be signed.
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.signedErrorsMinAuthRequired,
                this.authLevel.basicLevels,
            )
        ) {
            this.authorizedForSignedErrors = true;
        }
    }
}

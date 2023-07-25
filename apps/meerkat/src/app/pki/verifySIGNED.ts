import { ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    MistypedArgumentError,
    SecurityError,
} from "@wildboar/meerkat-types";
import {
    DERElement,
    BOOLEAN,
    OPTIONAL,
    packBits,
    TRUE_BIT,
} from "asn1-ts";
import { ASN1Encoder, DER } from "asn1-ts/dist/node/functional";
import type {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import {
    SecurityProblem_invalidSignature,
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { printInvokeId } from "../utils/printInvokeId";
import { verifyAnyCertPath } from "./verifyAnyCertPath";
import { verifySignature, VCP_RETURN_OK } from "./verifyCertPath";
import type {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import { RDNSequence } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RDNSequence.ta";
import { INTERNAL_ASSOCIATON_ID } from "../constants";
import {
    KeyUsage_digitalSignature,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/KeyUsage.ta";
import { id_anyExtendedKeyUsage, id_kp_clientAuth } from "../constants";
import { stringifyDN } from "../x500/stringifyDN";

/**
 * @summary Verify something that is cryptographically signed with X.509 SIGNED{}
 * @description
 *
 * Verify the digital signatures on `param`, and validate the certification path
 * that asserts the trustworthiness of the signer according to the procedures
 * defined in
 * [ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509/en).
 *
 * @param ctx The context object
 * @param assn The client association, if there is one.
 * @param certPath The `CertificationPath` of the argument or result
 * @param invokeId The InvokeId of the current operation
 * @param aliasDereferenced A boolean indicating whether an alias has been dereferenced
 * @param param The thing to be signed
 * @param paramDataEncoder A function that encodes `param` into an ASN.1 element
 * @param signErrors Whether to cryptographically sign errors
 * @param argOrResult Whether what is being signed is an argument or a result
 * @param ae_title_rdnSequence If applicable, the AE-Title of the application
 *  that signed the `param`.
 *
 * @async
 * @function
 */
export
async function verifySIGNED <T> (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    certPath: OPTIONAL<CertificationPath>,
    invokeId: InvokeId,
    aliasDereferenced: OPTIONAL<BOOLEAN>,
    param: SIGNED<T>,
    paramDataEncoder: ASN1Encoder<T>,
    signErrors: boolean,
    argOrResult: "arg" | "result" = "arg",
    ae_title_rdnSequence?: RDNSequence,
): Promise<void> {
    // I don't think ignoring this when in bulk-insert mode should be a problem,
    // because verifyToken() is a separate function used for strong auth.
    if (ctx.config.signing.disableAllSignatureVerification || ctx.config.bulkInsertMode) {
        return;
    }
    const remoteHostIdentifier = assn
        ? `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`
        : "";
    const logInfo = {
        context: argOrResult,
        host: remoteHostIdentifier,
        aid: assn?.id ?? INTERNAL_ASSOCIATON_ID,
        iid: printInvokeId(invokeId),
        ap: stringifyDN(ctx, ae_title_rdnSequence ?? []),
        remoteFamily: assn?.socket.remoteFamily,
        remoteAddress: assn?.socket.remoteAddress,
        remotePort: assn?.socket.remotePort,
        association_id: assn?.id,
        invokeID: printInvokeId(invokeId),
    };
    if (!certPath) {
        ctx.log.warn(ctx.i18n.t("log:cert_path_required_signed", logInfo), logInfo);
        throw new MistypedArgumentError(
            ctx.i18n.t("err:cert_path_required_signed", logInfo),
        );
    }
    for (const pair of certPath.theCACertificates ?? []) {
        if (!pair.issuedToThisCA) {
            ctx.log.warn(ctx.i18n.t("log:cert_path_issuedToThisCA", logInfo), logInfo);
            throw new MistypedArgumentError(
                ctx.i18n.t("err:cert_path_issuedToThisCA", logInfo),
            );
        }
    }
    const vacpResult = await verifyAnyCertPath(
        ctx,
        certPath,
        ctx.config.signing.acceptableCertificatePolicies,
    );
    if (vacpResult.returnCode !== VCP_RETURN_OK) {
        ctx.log.warn(ctx.i18n.t("log:cert_path_invalid", logInfo), logInfo);
        throw new SecurityError(
            ctx.i18n.t("err:cert_path_invalid", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (
        vacpResult.endEntityKeyUsage
        && (vacpResult.endEntityKeyUsage[KeyUsage_digitalSignature] !== TRUE_BIT)
    ) {
        throw new SecurityError(
            ctx.i18n.t("err:invalid_key_usage"),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (
        vacpResult.endEntityExtKeyUsage
        && !vacpResult.endEntityExtKeyUsage
            .some((eku) => (
                eku.isEqualTo(id_anyExtendedKeyUsage)
                || eku.isEqualTo(id_kp_clientAuth)
            ))
    ) {
        throw new SecurityError(
            ctx.i18n.t("err:invalid_key_usage"),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const now = new Date();
    if (
        (
            vacpResult.endEntityPrivateKeyNotBefore
            && (now < vacpResult.endEntityPrivateKeyNotBefore)
        )
        || (
            vacpResult.endEntityPrivateKeyNotAfter
            && (now > vacpResult.endEntityPrivateKeyNotAfter)
        )
    ) {
        throw new SecurityError(
            ctx.i18n.t("err:invalid_pkup"),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const signedData = param.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(param.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : paramDataEncoder(param.toBeSigned, DER).toBytes();
    const signatureAlg = param.algorithmIdentifier;
    const signatureValue = packBits(param.signature);
    const signatureIsValid: boolean | undefined = verifySignature(
        signedData,
        signatureAlg,
        signatureValue,
        certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
    );
    if (!signatureIsValid) {
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
}

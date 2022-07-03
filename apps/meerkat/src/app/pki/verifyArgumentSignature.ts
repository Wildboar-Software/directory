import { Context, ClientAssociation } from "@wildboar/meerkat-types";
import {
    MistypedArgumentError,
    SecurityError,
} from "@wildboar/meerkat-types";
import {
    DERElement,
    BOOLEAN,
    OPTIONAL,
    packBits,
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
import { verifyAnyCertPath } from "../pki/verifyAnyCertPath";
import { verifySignature, VCP_RETURN_CODE_OK } from "../pki/verifyCertPath";
import type {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import { securityError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";

export
function verifyArgumentSignature <T> (
    ctx: Context,
    assn: ClientAssociation,
    certPath: CertificationPath,
    invokeId: InvokeId,
    aliasDereferenced: OPTIONAL<BOOLEAN>,
    arg: SIGNED<T>,
    argDataEncoder: ASN1Encoder<T>,
    signErrors: boolean,
): void {
    const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
    if (!certPath) {
        throw new MistypedArgumentError(
            ctx.i18n.t("err:cert_path_required_signed", {
                context: "arg",
                host: remoteHostIdentifier,
                aid: assn.id,
                iid: printInvokeId(invokeId),
            }),
        );
    }
    for (const pair of certPath.theCACertificates ?? []) {
        if (!pair.issuedToThisCA) {
            throw new MistypedArgumentError(
                ctx.i18n.t("err:cert_path_issuedToThisCA", {
                    host: remoteHostIdentifier,
                    aid: assn.id,
                    iid: printInvokeId(invokeId),
                }),
            );
        }
    }
    const vacpResult = verifyAnyCertPath(ctx, certPath);
    if (vacpResult.returnCode !== VCP_RETURN_CODE_OK) {
        throw new SecurityError(
            ctx.i18n.t("err:cert_path_invalid", {
                host: remoteHostIdentifier,
                aid: assn.id,
                iid: printInvokeId(invokeId),
            }),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
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
    const signedData = arg.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(arg.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : argDataEncoder(arg.toBeSigned, DER).toBytes();
    const signatureAlg = arg.algorithmIdentifier;
    const signatureValue = packBits(arg.signature);
    const signatureIsValid: boolean | undefined = verifySignature(
        signedData,
        signatureAlg,
        signatureValue,
        certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
    );
    if (!signatureIsValid) {
        throw new SecurityError(
            ctx.i18n.t("err:invalid_signature_on_arg", {
                host: remoteHostIdentifier,
                aid: assn.id,
                iid: printInvokeId(invokeId),
            }),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
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

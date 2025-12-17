import type { Context } from "../types/index.js";
import {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    CertificatePair,
} from "@wildboar/x500/AuthenticationFramework";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import { unpackBits } from "@wildboar/asn1";
import { randomBytes } from "crypto";

// TODO: Convert to native function?
export
function createSecurityParameters (
    ctx: Context,
    signed: boolean,
    recipient?: DistinguishedName,
    operationCode?: Code,
    errorCode?: Code,
    // This was added as a result of a deeply-entrenched design mistake. This
    // basically forces signing, even if bulk insert mode is on. This is so a
    // DSA can still chain with a signed argument.
    demandSigning: boolean = false,
): SecurityParameters | undefined {
    const signingCertPath = ctx.config.signing.certPath;
    const isDopOperation = operationCode && ("local" in operationCode) && (operationCode.local >= 100);
    const signable: boolean = !!(demandSigning && signingCertPath)
        || !!(signingCertPath && signed && (!ctx.config.bulkInsertMode || isDopOperation));
    // Errors are thrown by the server, not client.
    // This block is a short-circuit to prevent DoS.
    if (!signable && errorCode) {
        return undefined;
    }
    return new SecurityParameters(
        signable
            ? new CertificationPath(
                signingCertPath![signingCertPath!.length - 1],
                (signingCertPath!.length > 1)
                    ? signingCertPath!
                        .slice(0, -1) // The last certificate is the end-entity (the DSA.)
                        .reverse() // The certificates are in order of descending authority.
                        .map((cert) => new CertificatePair(
                            cert,
                            undefined,
                        ))
                    : undefined,
            )
            : undefined,
        signable
            ? recipient
            : undefined,
        signable
            ? {
                generalizedTime: new Date((new Date()).valueOf() + 60000),
            }
            : undefined,
        signable
            ? unpackBits(randomBytes(4))
            : undefined,
        ProtectionRequest_signed,
        operationCode,
        ErrorProtectionRequest_signed,
        errorCode,
    );
}

export default createSecurityParameters;

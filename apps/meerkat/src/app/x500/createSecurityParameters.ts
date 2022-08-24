import type { Context } from "@wildboar/meerkat-types";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    CertificatePair,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificatePair.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { unpackBits } from "asn1-ts";
import { randomBytes } from "crypto";

// TODO: Convert to native function?
export
function createSecurityParameters (
    ctx: Context,
    signed: boolean,
    recipient?: DistinguishedName,
    operationCode?: Code,
    errorCode?: Code,
): SecurityParameters | undefined {
    const signingCertPath = ctx.config.signing.certPath;
    const signable: boolean = !!(signingCertPath && signed && !ctx.config.bulkInsertMode);
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

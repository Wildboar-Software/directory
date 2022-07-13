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

export
function createSecurityParameters (
    ctx: Context,
    recipient?: DistinguishedName,
    operationCode?: Code,
    errorCode?: Code,
): SecurityParameters {
    const signingCertPath = ctx.config.signing.certPath;
    return new SecurityParameters(
        (signingCertPath && !ctx.config.bulkInsertMode)
            ? new CertificationPath(
                signingCertPath[signingCertPath.length - 1],
                (signingCertPath.length > 1)
                    ? signingCertPath
                        .slice(0, -1) // The last certificate is the end-entity (the DSA.)
                        .reverse() // The certificates are in order of descending authority.
                        .map((cert) => new CertificatePair(
                            undefined,
                            cert, // REVIEW: Should you use issuedToThisCA instead?
                        ))
                    : undefined,
            )
            : undefined,
        recipient,
        {
            generalizedTime: new Date((new Date()).valueOf() + 60000),
        },
        ctx.config.bulkInsertMode
            ? undefined
            : unpackBits(randomBytes(16)),
        ProtectionRequest_signed,
        operationCode,
        ErrorProtectionRequest_signed,
        errorCode,
    );
}

export default createSecurityParameters;

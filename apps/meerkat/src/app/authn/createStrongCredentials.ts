import type { Context } from "@wildboar/meerkat-types";
import {
    StrongCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/StrongCredentials.ta";
import {
    TokenContent,
    _encode_TokenContent,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TokenContent.ta";
import {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    CertificatePair,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificatePair.ta";
import { keyTypeToAlgOID } from "../pki/keyTypeToAlgOID";
import { DERElement, unpackBits } from "asn1-ts";
import { randomBytes } from "crypto";
import { generateSIGNED } from "../pki/generateSIGNED";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { addSeconds } from "date-fns";

/**
 * @summary Creates strong credentials to be used for strong authentication
 * @description
 *
 * This function uses this DSA's signing key and certification path (if
 * configured) to produce strong credentials as used for strong authentication
 * as described in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 9.1.2.
 *
 * @param ctx The context object
 * @param intendedRecipient The intended recipient of these strong credentials
 * @returns The strong credentials, or `null` if they could not be generated
 *
 * @function
 */
export
function createStrongCredentials (
    ctx: Context,
    intendedRecipient: DistinguishedName,
): StrongCredentials | null {
    const pkiPath = ctx.config.signing.certPath;
    const key = ctx.config.signing.key;
    if (!pkiPath || !key || !key.asymmetricKeyType) {
        return null;
    }
    const algOID = keyTypeToAlgOID.get(key.asymmetricKeyType);
    if (!algOID) {
        return null;
    }
    const endEntityCert = pkiPath[pkiPath.length - 1];
    if (!endEntityCert) {
        return null;
    }
    const certPath: CertificationPath = new CertificationPath(
        endEntityCert,
        [ ...pkiPath.slice(0, -1) ]
            .reverse()
            .map((cert) => new CertificatePair(
                cert,
                undefined,
            )),
    );
    /**
     * This is a meaningless call to generateSIGNED() just to get the exact
     * algorithm identifier that will be used for digital signature.
     */
    const pseudoSig = generateSIGNED(ctx, null, () => new DERElement());
    if (!("signed" in pseudoSig)) {
        return null;
    }
    const algID = pseudoSig.signed.algorithmIdentifier;
    const tokenContent = new TokenContent(
        algID,
        intendedRecipient,
        {
            generalizedTime: addSeconds(new Date(), 60), // TODO: Make this time configurable.
        },
        unpackBits(randomBytes(4)),
        undefined,
    );
    const op = generateSIGNED(ctx, tokenContent, _encode_TokenContent);
    if (!("signed" in op)) {
        return null;
    }

    return new StrongCredentials(
        certPath,
        op.signed,
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        ctx.config.authn.attributeCertificationPath,
    );
}

export default createStrongCredentials;

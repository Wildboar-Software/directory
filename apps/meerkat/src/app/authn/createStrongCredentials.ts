import type { Context } from "../types/index.js";
import {
    StrongCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    TokenContent,
    _encode_TokenContent,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    CertificatePair,
} from "@wildboar/x500/AuthenticationFramework";
import { keyTypeToAlgOID } from "../pki/keyTypeToAlgOID.js";
import { DERElement, unpackBits } from "@wildboar/asn1";
import { randomBytes } from "node:crypto";
import { generateSIGNED } from "../pki/generateSIGNED.js";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
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
        ctx.log.debug(ctx.i18n.t("log:cannot_create_strong_creds_deps_unmet"));
        return null;
    }
    const algOID = keyTypeToAlgOID.get(key.asymmetricKeyType);
    if (!algOID) {
        ctx.log.debug(ctx.i18n.t("log:key_type_has_no_oid", {
            kt: key.asymmetricKeyType,
        }));
        return null;
    }
    const endEntityCert = pkiPath[pkiPath.length - 1];
    if (!endEntityCert) {
        ctx.log.debug(ctx.i18n.t("log:cannot_create_strong_creds_no_ee_cert"));
        return null;
    }
    const certPath: CertificationPath = new CertificationPath(
        endEntityCert,
        pkiPath
            .slice(0, -1)
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
        ctx.log.debug(ctx.i18n.t("log:cannot_create_strong_creds_failed_pseudo_sig"));
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
        ctx.log.debug(ctx.i18n.t("log:cannot_create_strong_creds_failed_sig"));
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

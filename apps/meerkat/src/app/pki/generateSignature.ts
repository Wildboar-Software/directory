import { KeyObject, createSign, sign } from "crypto";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18";
import { ASN1Element } from "@wildboar/asn1";
import {
    DER,
    _encodeNull,
} from "@wildboar/asn1/functional";
import {
    rSASSA_PSS,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    rSASSA_PSS_Type,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { nodeHashAlgStringToOID } from "./nodeHashAlgStringToOID";
import { id_sha1 } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { keyTypeToAlgOID } from "./keyTypeToAlgOID";

/**
 * @summary Generate a digital signature
 * @description
 *
 * This function generates a digital signature and returns both the signature
 * and the `AlgorithmIdentifier` of the signature algorithm used, or `null` if
 * no signature could be generated.
 *
 * @param key The private key to use for generating the signature
 * @param data The bytes or arrays of bytes to be signed.
 * @returns An `AlgorithmIdentifier` and a buffer representing the signature value,
 *  or `null` if a signature could not be generated.
 *
 * @function
 */
export
function generateSignature (
    key: KeyObject,
    data: Uint8Array | Uint8Array[], // Array of buffers to avoid unnecessary concat().
): [ AlgorithmIdentifier, Buffer ] | null {
    if (!key.asymmetricKeyType) {
        return null;
    }
    const supportedKeyType = (
        (key.asymmetricKeyType === "rsa") // Requires digest
        || (key.asymmetricKeyType === "ed25519") // NO digest
        || (key.asymmetricKeyType === "ec") // Requires digest? (If it is ECDSA: https://stackoverflow.com/questions/72761177/what-signature-algorithm-does-a-key-of-type-ec-use-in-nodejs)
        || (key.asymmetricKeyType === "dsa") // Requires digest
        || (key.asymmetricKeyType === "rsa-pss") // Requires digest
    );
    if (!supportedKeyType) {
        return null;
    }
    const signatureRequiresDigest: boolean = (key.asymmetricKeyType !== "ed25519");
    if (signatureRequiresDigest) {
        const algOID = keyTypeToAlgOID.get(key.asymmetricKeyType);
        if (!algOID) {
            return null;
        }
        let error: boolean = false;
        const param: ASN1Element | undefined = (() => {
            switch (key.asymmetricKeyType) {
                case ("rsa"): return _encodeNull(null, DER);
                case ("rsa-pss"): {
                    // TODO: This needs to be tested thoroughly, because it was
                    // not clear what the parameters are and how to translate
                    // their NodeJS values to the X.500 values.
                    const {
                        hashAlgorithm,
                        saltLength,
                    } = key.asymmetricKeyDetails!;
                    const haOID = nodeHashAlgStringToOID.get(hashAlgorithm!);
                    if (!haOID) {
                        error = true;
                        return undefined;
                    }
                    const hparam: ASN1Element | undefined = haOID.isEqualTo(id_sha1)
                        ? _encodeNull(null, DER)
                        : undefined;
                    // It seems like trailerField is always the default.
                    return rSASSA_PSS.encoderFor["&Type"]!(new rSASSA_PSS_Type(
                        new AlgorithmIdentifier(
                            haOID,
                            hparam,
                        ),
                        saltLength,
                        undefined,
                    ), DER);
                }
                default: {
                    return undefined;
                }
            }
        })();
        if (error) {
            return null;
        }
        const sigAlg = new AlgorithmIdentifier(
            algOID,
            param,
        );
        const signer = createSign((key.asymmetricKeyType === "dsa") ? "SHA256" : "SHA512");
        if (Array.isArray(data)) {
            for (const buffer of data) {
                signer.update(buffer);
            }
        } else {
            signer.update(data);
        }
        const sigValue = signer.sign(key);
        return [ sigAlg, sigValue ];
    } else {
        const sigValue = sign(null, Array.isArray(data) ? Buffer.concat(data) : data, key);
        const sigAlg = new AlgorithmIdentifier(
            sa_Ed25519["&id"]!,
        );
        return [ sigAlg, sigValue ];
    }
}

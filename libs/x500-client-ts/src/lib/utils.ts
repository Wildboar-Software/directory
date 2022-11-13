import { ASN1Element, ObjectIdentifier, OBJECT_IDENTIFIER, unpackBits } from "asn1-ts";
import destringifyLDAPDN from "@wildboar/ldap/src/lib/destringifiers/RDNSequence";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { DER, ASN1Encoder, _encodeNull } from "asn1-ts/dist/node/functional";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import { KeyObject, createSign, sign, KeyType } from "crypto";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18/src/lib/modules/Safecurves-pkix-18/sa-Ed25519.oa";
import {
    rSASSA_PSS_Type,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/rSASSA-PSS-Type.ta";
import {
    id_sha1,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha1.va";
import {
    id_sha224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha224.va";
import {
    id_sha256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha256.va";
import {
    id_sha384,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha384.va";
import {
    id_sha512,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha512.va";
import {
    id_sha3_224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha3-224.va";
import {
    id_sha3_256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha3-256.va";
import {
    id_sha3_384,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha3-384.va";
import {
    id_sha3_512,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha3-512.va";
import {
    id_shake128,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-shake128.va";
import {
    id_shake256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-shake256.va";
import {
    sha512WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha512WithRSAEncryption.va";
import {
    ecdsa_with_SHA512,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA512.va";
import {
    rSASSA_PSS,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/rSASSA-PSS.oa";
import {
    id_dsa_with_sha256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha256.va";

/**
 * @summary A mapping of NodeJS hash name strings to their equivalent algorithm object identifiers
 * @description
 *
 * This is a mapping between NodeJS's algorithm identifiers, as used by the
 * `crypto.createHash()` function and their equivalent algorithm object
 * identifiers.
 *
 * You can run `crypto.getHashes()` to see which hash identifiers are defined
 * for a given NodeJS runtime.
 *
 * @see {@link digestOIDToNodeHash}, which is the reverse of this.
 * @see {@link https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options}
 * @see {@link https://nodejs.org/api/crypto.html#cryptogethashes}
 */
export
const nodeHashAlgStringToOID: Map<string, OBJECT_IDENTIFIER> = new Map([
    [ "sha1", id_sha1 ], // NOTE: This one differs from the others by requiring a NULL parameter.
    [ "sha224", id_sha224 ],
    [ "sha256", id_sha256 ],
    [ "sha384", id_sha384 ],
    [ "sha512", id_sha512 ],
    [ "sha3-244", id_sha3_224 ],
    [ "sha3-256", id_sha3_256 ],
    [ "sha3-384", id_sha3_384 ],
    [ "sha3-512", id_sha3_512 ],
    [ "shake128", id_shake128 ],
    [ "shake256", id_shake256 ],
]);

/**
 * @summary A mapping from a NodeJS private key and an algorithm object identifier to use for digital signature
 * @description
 *
 * A mapping from a NodeJS `crypto.KeyObject.asymmetricKeyType` and an algorithm
 * object identifier to use for digital signature.
 *
 * @see {@link https://nodejs.org/api/crypto.html#keyobjectasymmetrickeytype}
 */
 export
 const keyTypeToAlgOID: Map<KeyType, OBJECT_IDENTIFIER> = new Map([
     [ "rsa", sha512WithRSAEncryption ],
     [ "ec", ecdsa_with_SHA512 ],
     [ "dsa", id_dsa_with_sha256 ],
     [ "rsa-pss", rSASSA_PSS["&id"]! ],
     [ "ed25519", sa_Ed25519["&id"]! ],
]);

export
function destringifyDN (
    dn: string,
    nameToOID: (name: string) => OBJECT_IDENTIFIER | undefined | null,
    valueParser: (str: string) => ASN1Element,
): DistinguishedName {
    return Array.from(destringifyLDAPDN(
        dn,
        (syntax: string) => {
            const desc = normalizeAttributeDescription(Buffer.from(syntax));
            const oid = desc.indexOf(".") > -1
                ? ObjectIdentifier.fromString(desc)
                : nameToOID(desc);
            if (!oid) {
                return undefined;
            }
            return [
                oid,
                (value: string): ASN1Element => valueParser(value),
            ];
        },
    ))
        .map((rdn) => rdn.map((atav) => new AttributeTypeAndValue(
            atav[0],
            atav[1],
        )));
}

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

export
function generateSIGNED <T> (
    key: KeyObject,
    data: T,
    encoder: ASN1Encoder<T>,
): OPTIONALLY_PROTECTED<T> {
    const tbsBytes = encoder(data, DER).toBytes();
    const signingResult = generateSignature(key, tbsBytes);
    if (!signingResult) {
        return {
            unsigned: data,
        };
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            data,
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}


import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { KeyObject, KeyType } from "node:crypto";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18/src/lib/modules/Safecurves-pkix-18/sa-Ed25519.oa";
import { OBJECT_IDENTIFIER } from "asn1-ts";
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
import { ASN1Element } from "asn1-ts";
import {
    DER,
    _encodeNull,
} from "asn1-ts/dist/node/functional";
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

export default keyTypeToAlgOID;


export type AlgorithmInfo = [
    alg_id: AlgorithmIdentifier,
    hash_str: string | null,
];

export
function getAlgorithmInfoFromKey (key: KeyObject): AlgorithmInfo | null {
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
        let hash_str: string = (key.asymmetricKeyType === "dsa") ? "SHA256" : "SHA512";
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
                    hash_str = hashAlgorithm!;
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
        return [ sigAlg, hash_str ];
    } else {
        const sigAlg = new AlgorithmIdentifier(
            sa_Ed25519["&id"]!,
        );
        return [ sigAlg, null ];
    }
    return null;
}

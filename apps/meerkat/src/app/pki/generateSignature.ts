import {
    KeyObject,
    createSign,
    sign,
    KeyType
} from "crypto";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18/src/lib/modules/Safecurves-pkix-18/sa-Ed25519.oa";
import { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    DER,
    _encodeNull,
} from "asn1-ts/dist/node/functional";
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
import {
    rSASSA_PSS_Type,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/rSASSA-PSS-Type.ta";
import { nodeHashAlgStringToOID } from "./nodeHashAlgStringToOID";
import { id_sha1 } from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha1.va";


const keyTypeToAlgOID: Map<KeyType, OBJECT_IDENTIFIER> = new Map([
    [ "rsa", sha512WithRSAEncryption ],
    [ "ec", ecdsa_with_SHA512 ],
    [ "dsa", id_dsa_with_sha256 ],
    [ "rsa-pss", rSASSA_PSS["&id"]! ],
]);

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

import type { KeyType } from "node:crypto";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    sha512WithRSAEncryption,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    ecdsa_with_SHA512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    rSASSA_PSS,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_dsa_with_sha256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";

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

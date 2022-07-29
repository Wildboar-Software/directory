import { OBJECT_IDENTIFIER } from "asn1-ts";
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

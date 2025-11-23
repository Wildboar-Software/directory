import type { IndexableOID } from "@wildboar/meerkat-types";
import {
    id_sha1,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha224,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha384,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_224,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_384,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_shake128,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_shake256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";

/**
 * @summary A mapping of algorithm object identifiers to their equivalent NodeJS hash name strings
 * @description
 *
 * This is a mapping between dot-delimited numeric object identifiers and their
 * equivalent algorithm identifiers as used by NodeJS's `crypto.createHash()`
 * function.
 *
 * @see {@link nodeHashAlgStringToOID}, which is the reverse of this.
 * @see {@link https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options}
 * @see {@link https://nodejs.org/api/crypto.html#cryptogethashes}
 */
export
const digestOIDToNodeHash: Map<IndexableOID, string> = new Map([
    [ id_sha1.toString(), "sha1" ], // NOTE: This one differs from the others by requiring a NULL parameter.
    [ id_sha224.toString(), "sha224" ],
    [ id_sha256.toString(), "sha256" ],
    [ id_sha384.toString(), "sha384" ],
    [ id_sha512.toString(), "sha512" ],
    [ id_sha3_224.toString(), "sha3-244" ],
    [ id_sha3_256.toString(), "sha3-256" ],
    [ id_sha3_384.toString(), "sha3-384" ],
    [ id_sha3_512.toString(), "sha3-512" ],
    [ id_shake128.toString(), "shake128" ],
    [ id_shake256.toString(), "shake256" ],
]);

import type { IndexableOID } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    sha1WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha1WithRSAEncryption.va";
import {
    sha256WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha256WithRSAEncryption.va";
import {
    sha384WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha384WithRSAEncryption.va";
import {
    sha512WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha512WithRSAEncryption.va";
import {
    sha224WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha224WithRSAEncryption.va";
import {
    id_dsa_with_sha1,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha1.va";
import {
    id_dsa_with_sha224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha224.va";
import {
    id_dsa_with_sha256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha256.va";
import {
    ecdsa_with_SHA224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA224.va";
import {
    ecdsa_with_SHA256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA256.va";
import {
    ecdsa_with_SHA384,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA384.va";
import {
    ecdsa_with_SHA512,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA512.va";
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

/**
 * @summary A mapping of signature algorithm object identifiers and their hash algorithm object identifiers.
 * @description
 *
 * This is a mapping of dot-delimited numeric object identifiers that each
 * represent a different signature algorithm and the object identifiers of their
 * implied hash algorithms.
 *
 * Note that not all signature algorithms use a hash.
 *
 * Most of these algorithm object identifiers are defined in
 * [ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509/en),
 * in the `AlgorithmObjectIdentifiers` ASN.1 module. Some are defined in
 * IETF RFCs.
 *
 */
export
const sigAlgToHashAlg: Map<IndexableOID, OBJECT_IDENTIFIER> = new Map([
    [ sha1WithRSAEncryption.toString(), id_sha1 ],
    [ sha256WithRSAEncryption.toString(), id_sha256 ],
    [ sha384WithRSAEncryption.toString(), id_sha384 ],
    [ sha512WithRSAEncryption.toString(), id_sha512 ],
    [ sha224WithRSAEncryption.toString(), id_sha224 ],
    [ id_dsa_with_sha1.toString(), id_sha1 ],
    [ id_dsa_with_sha224.toString(), id_sha224 ],
    [ id_dsa_with_sha256.toString(), id_sha256 ],
    [ ecdsa_with_SHA224.toString(), id_sha224 ],
    [ ecdsa_with_SHA256.toString(), id_sha256 ],
    [ ecdsa_with_SHA384.toString(), id_sha384 ],
    [ ecdsa_with_SHA512.toString(), id_sha512 ],
]);

export default sigAlgToHashAlg;

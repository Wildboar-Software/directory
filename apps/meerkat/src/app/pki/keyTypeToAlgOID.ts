import type { KeyType } from "crypto";
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

export
const keyTypeToAlgOID: Map<KeyType, OBJECT_IDENTIFIER> = new Map([
    [ "rsa", sha512WithRSAEncryption ],
    [ "ec", ecdsa_with_SHA512 ],
    [ "dsa", id_dsa_with_sha256 ],
    [ "rsa-pss", rSASSA_PSS["&id"]! ],
    [ "ed25519", sa_Ed25519["&id"]! ],
]);

export default keyTypeToAlgOID;

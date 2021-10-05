import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { scrypt, Scrypt_params } from "@wildboar/scrypt-0";
import * as crypto from "crypto";
import { DER } from "asn1-ts/dist/node/functional";
export
const getScryptAlgorithmIdentifier = () => new AlgorithmIdentifier(
    scrypt["&id"]!,
    scrypt.encoderFor["&Type"]!(new Scrypt_params(
        crypto.randomBytes(32),
        16384,
        8,
        1,
        128,
    ), DER),
);

export default getScryptAlgorithmIdentifier;

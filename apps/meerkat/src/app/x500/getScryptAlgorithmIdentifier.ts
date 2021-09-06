import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { scrypt, Scrypt_params } from "@wildboar/scrypt-0";
import { DERElement } from "asn1-ts";
import * as crypto from "crypto";

export
const getScryptAlgorithmIdentifier = () => new AlgorithmIdentifier(
    scrypt["&id"]!,
    scrypt.encoderFor["&Type"]!(new Scrypt_params(
        crypto.randomBytes(32),
        16384,
        8,
        1,
        128,
    ), () => new DERElement())
);

export default getScryptAlgorithmIdentifier;

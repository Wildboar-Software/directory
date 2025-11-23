import * as pem from "pem-ts";
import {
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import type {
    PkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import { BERElement } from "@wildboar/asn1";

/**
 * @summary Produce a `PkiPath` from a PEM-encoded X.509 certificate chain.
 * @description
 *
 * In a `PkiPath`, the certificates are ordered by descending authority, but in
 * a PEM chain, they are ordered by ascending authority.
 *
 * @param data The file contents, which must contain at least one PEM-encoded
 *  X.509 certificate.
 * @returns A `PkiPath` (A sequence of `Certificate`)
 *
 * @function
 */
export
function decodePkiPathFromPEM (data: string): PkiPath {
    const pemObjects: pem.PEMObject[] = pem.PEMObject.parse(data);
    return pemObjects
        .map((obj) => {
            const el = new BERElement();
            el.fromBytes(obj.data);
            return el;
        })
        .map(_decode_Certificate)
        .reverse();
}

export default decodePkiPathFromPEM;

import * as pem from "pem-ts";
import {
    _decode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import type {
    PkiPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/PkiPath.ta";
import { BERElement } from "asn1-ts";

/**
 * In a `PkiPath`, the certificates are ordered by descending authority, but in
 * a PEM chain, they are ordered by ascending authority.
 *
 * @param data
 * @returns
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

import { Buffer } from "node:buffer";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { ASN1Element, BERElement, ObjectIdentifier } from "@wildboar/asn1";

/**
 * @summary Converts a JSON-encoded relative distinguished name to a normal relative distinguished name
 * @description
 *
 * This function takes a JSON-encoded relative distinguished name as one might
 * find within the Meerkat DSA database and converts it to a normally-encoded
 * relative distinguished name.
 *
 * Note that there is no specification as to how relative distinguished names
 * are stored in the database in Meerkat DSA. Every RDN so encoded is simply
 * stored as an object whose keys are attribute types (dot-delimited object
 * identifier strings, or human-friendly names) and whose values are the
 * string forms of the values as used by LDAP, possibly using the
 * hex-encoded values as specified in IETF RFC 4514.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4514
 *
 * @param rdn A JSON-encoded relative distinguished name
 * @returns An X.500 relative distinguished name, encoded normally
 *
 * @function
 */
export
function rdnFromJson (rdn: Record<string, string>): RDN {
    return Object.entries(rdn).map(([ oidStr, value ]) => new AttributeTypeAndValue(
        ObjectIdentifier.fromString(oidStr),
        ((): ASN1Element => {
            const el = new BERElement();
            el.fromBytes(Buffer.from(value.slice(1), "hex"));
            return el;
        })(),
    ));
}

export default rdnFromJson;

import type { Buffer } from "node:buffer";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Converts a relative distinguished name and converts it to a JSON-format
 * @description
 *
 * This function takes a relative distinguished name and converts it to a JSON
 * format that can be stored in a JSON column of a relational database.
 *
 * Note that there is no specification as to how relative distinguished names
 * are stored in the database in Meerkat DSA. Every RDN so encoded is simply
 * stored as an object whose keys are attribute types (dot-delimited object
 * identifier strings, or human-friendly names) and whose values are the
 * string forms of the values as used by LDAP, possibly using the
 * hex-encoded values as specified in IETF RFC 4514.
 *
 * @param rdn The relative distinguished name to be converted to JSON
 * @returns The JSON-encoded relative distinguished name
 *
 * @function
 */
export
function rdnToJson (rdn: RDN): Record<string, string> {
    return Object.fromEntries(
        rdn.map((atav) => [ atav.type_.toString(), "#" + (atav.value.toBytes() as Buffer).toString("hex") ]),
    );
}

export default rdnToJson;

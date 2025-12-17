import type {
    SYNTAX_NAME,
} from "@wildboar/x500/InformationFramework";
import { LDAPSyntaxInfo } from "../types/index.js";

/**
 * @summary Convert a `SYNTAX-NAME` information object into `LDAPSyntaxInfo`.
 * @description
 *
 * Converts a `SYNTAX-NAME` information object into `AttributeInfo`.
 *
 * @param io The `SYNTAX-NAME` information object, as produced by the Wildboar
 *  ASN.1 compiler.
 * @returns An `LDAPSyntaxInfo` as used by Meerkat DSA's internal index of known
 *  LDAP syntaxes.
 *
 * @function
 */
export
function ldapSyntaxFromInformationObject (io: SYNTAX_NAME): LDAPSyntaxInfo {
    if (!io["&id"]) {
        throw new Error("9174581e-739e-4a3c-8438-bdf900849831");
    }
    return {
        id: io["&id"],
        description: io["&ldapDesc"],
    };
}

export default ldapSyntaxFromInformationObject;

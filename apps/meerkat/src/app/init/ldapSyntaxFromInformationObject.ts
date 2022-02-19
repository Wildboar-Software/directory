import type {
    SYNTAX_NAME,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
import { LDAPSyntaxInfo } from "@wildboar/meerkat-types";

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
        throw new Error();
    }
    return {
        id: io["&id"],
        description: io["&ldapDesc"],
    };
}

export default ldapSyntaxFromInformationObject;

import type { ASN1Element } from "asn1-ts";
import type { AttributeInfo } from "@wildboar/meerkat-types";
import type {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";

/**
 * @summary Convert an `ATTRIBUTE` information object into `AttributeInfo`.
 * @description
 *
 * Converts an `ATTRIBUTE` information object into `AttributeInfo`.
 *
 * @param io The `ATTRIBUTE` information object, as produced by the Wildboar
 *  ASN.1 compiler.
 * @param name The name of the `ATTRIBUTE` information object.
 * @returns An `AttributeInfo` as used by Meerkat DSA's internal index of known
 *  attribute types.
 *
 * @function
 */
export
function attributeFromInformationObject (io: ATTRIBUTE, name?: string): AttributeInfo {
    return {
        id: io["&id"],
        name: name ? [ name.replace(/_/g, "-") ] : undefined,
        parent: io["&derivation"]?.["&id"],
        equalityMatchingRule: io["&equality-match"]?.["&id"],
        orderingMatchingRule: io["&ordering-match"]?.["&id"],
        substringsMatchingRule: io["&substrings-match"]?.["&id"],
        singleValued: io["&single-valued"] ?? false,
        collective: io["&collective"] ?? false,
        dummy: io["&dummy"] ?? false,
        noUserModification: io["&no-user-modification"] ?? false,
        obsolete: io["&obsolete"] ?? false,
        usage: io["&usage"] ?? AttributeUsage_userApplications,
        ldapSyntax: io["&ldapSyntax"],
        ldapNames: (io["&ldapName"]?.length || !name)
            ? io["&ldapName"]
            : [ name ],
        ldapDescription: io["&ldapDesc"],
        compatibleMatchingRules: new Set(),
        validator: io.decoderFor["&Type"]
            ? (value: ASN1Element) => io.decoderFor["&Type"]!(value)
            : undefined,
    };
}

export default attributeFromInformationObject;

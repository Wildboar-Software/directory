import type { AttributeInfo } from "@wildboar/meerkat-types";
import {
    ASN1Element,
    ObjectIdentifier,
    ASN1TagClass,
    ASN1UniversalType,
} from "asn1-ts";
import {
    AttributeUsage_directoryOperation,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { uuid } from "@wildboar/ldap/src/lib/syntaxes";

export
const entryUUID: AttributeInfo = {
    id: new ObjectIdentifier([ 1, 3, 6, 1, 1, 16, 4 ]),
    singleValued: true,
    noUserModification: true,
    usage: AttributeUsage_directoryOperation,
    collective: false,
    dummy: false,
    obsolete: false,
    compatibleMatchingRules: new Set(),
    ldapDescription: "UUID of the entry",
    ldapNames: ["entryUUID"],
    ldapSyntax: uuid,
    name: ["entryUUID"],
    syntax: "UUID ::= OCTET STRING (SIZE(16)) -- constrained to a UUID [RFC4122]",
    description: "UUID of the entry (Specified in IETF RFC 4530)",
    equalityMatchingRule: new ObjectIdentifier([ 1, 3, 6, 1, 1, 16, 2 ]),
    orderingMatchingRule: new ObjectIdentifier([ 1, 3, 6, 1, 1, 16, 3 ]),
    validator: (value: ASN1Element) => {
        if (
            (value.tagClass !== ASN1TagClass.universal)
            || (value.tagNumber !== ASN1UniversalType.octetString)
            || (value.octetString.length !== 16)
        ) {
            throw new Error();
        }
    },
};

export default entryUUID;

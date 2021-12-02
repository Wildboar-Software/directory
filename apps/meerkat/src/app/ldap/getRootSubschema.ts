import type { Context } from "@wildboar/meerkat-types";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import readAttributeTypes from "./readAttributeTypes";
import readObjectClasses from "./readObjectClasses";

const rootAttributeTypesValues: Buffer[] = [
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.6 NAME 'altServer' SYNTAX 1.3.6.1.4.1.1466.115.121.1.26 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.5 NAME 'namingContexts' SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.13 NAME 'supportedControl' SYNTAX 1.3.6.1.4.1.1466.115.121.1.38 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.7 NAME 'supportedExtension' SYNTAX 1.3.6.1.4.1.1466.115.121.1.38 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.4203.1.3.5 NAME 'supportedFeatures' SYNTAX 1.3.6.1.4.1.1466.115.121.1.38 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.15 NAME 'supportedLDAPVersion' SYNTAX 1.3.6.1.4.1.1466.115.121.1.27 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.4.1.1466.101.120.14 NAME 'supportedSASLMechanisms' SYNTAX 1.3.6.1.4.1.1466.115.121.1.15 USAGE dSAOperation )", "utf-8"),
    Buffer.from("( 2.5.18.3 NAME 'creatorsName' EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )", "utf-8"),
    Buffer.from("( 2.5.18.1 NAME 'createTimestamp' EQUALITY generalizedTimeMatch ORDERING generalizedTimeOrderingMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.24 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )", "utf-8"),
    Buffer.from("( 2.5.18.4 NAME 'modifiersName' EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )", "utf-8"),
    Buffer.from("( 2.5.18.2 NAME 'modifyTimestamp' EQUALITY generalizedTimeMatch ORDERING generalizedTimeOrderingMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.24 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )", "utf-8"),
    Buffer.from("( 1.3.6.1.1.16.4 NAME 'entryUUID' DESC 'UUID of the entry' EQUALITY uuidMatch ORDERING uuidOrderingMatch SYNTAX 1.3.6.1.1.16.1 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )", "utf-8"),
];

/**
 * NOTE: The subschemaSubentry in the Root DSE only points to the subschema
 * subentry that provides schema for the Root DSE. However, it does provide
 * some editors with the schema needed to create first-level DSEs, too.
 *
 * We want to preserve the privacy of directory schema, but still allow users
 * to create first-level entries using schema information. For this reason,
 * this function takes the parameter `permittedToSeeSchema`; if this is false,
 * the user will only be able to see schema for attributes in the Root DSE.
 * Otherwise, they will be able to see all attribute types and object classes
 * defined in this DSA.
 */
function getRootSubschema (ctx: Context, permittedToSeeSchema: boolean): PartialAttribute[] {
    const attributeTypesValues: Buffer[] = permittedToSeeSchema
        ? [] // Do not include the hard-coded list, otherwise, they'll be duplicated.
        : [ ...rootAttributeTypesValues ];
    const attributes: PartialAttribute[] = [
        new PartialAttribute(
            Buffer.from("objectClass", "utf-8"),
            [
                Buffer.from("subentry", "utf-8"),
                Buffer.from("subschema", "utf-8"),
            ],
        ),
        new PartialAttribute(
            Buffer.from("attributeTypes", "utf-8"),
            attributeTypesValues,
        ),
    ];

    if (permittedToSeeSchema) {
        attributeTypesValues.push(...readAttributeTypes(ctx));
        attributes.push(new PartialAttribute(
            Buffer.from("objectClasses", "utf-8"),
            readObjectClasses(ctx),
        ));
    }

    return attributes;
}

export default getRootSubschema;

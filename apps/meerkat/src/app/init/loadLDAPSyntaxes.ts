import type { Context } from "@wildboar/meerkat-types";
import type { ASN1Element } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import ldapSyntaxFromInformationObject from "./ldapSyntaxFromInformationObject";
import { attributeTypeDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeTypeDescription.oa";
import { bitString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/bitString.oa";
import { boolean_ } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/boolean.oa";
import { countryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryString.oa";
import { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
import { deliveryMethod } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/deliveryMethod.oa";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { dITContentRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dITContentRuleDescription.oa";
import { dITStructureRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dITStructureRuleDescription.oa";
import { enhancedGuide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/enhancedGuide.oa";
import { facsimileTelephoneNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNr.oa";
import { fax } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/fax.oa";
import { generalizedTime } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTime.oa";
import { guide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/guide.oa";
import { ia5String } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa";
import { integer } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa";
import { jpeg } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/jpeg.oa";
import { matchingRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/matchingRuleDescription.oa";
import { matchingRuleUseDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/matchingRuleUseDescription.oa";
import { nameAndOptionalUID } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/nameAndOptionalUID.oa";
import { nameFormDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/nameFormDescription.oa";
import { numericString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericString.oa";
import { objectClassDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/objectClassDescription.oa";
import { oid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oid.oa";
import { otherMailbox } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/otherMailbox.oa";
import { octetString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa";
import { postalAddr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddr.oa";
import { presentationAddr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/presentationAddr.oa";
import { printableString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/printableString.oa";
import { subtreeSpec } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/subtreeSpec.oa";
import { telephoneNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNr.oa";
import { telexNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telexNr.oa";
import { utcTime } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/utcTime.oa";
import { ldapSyntaxDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ldapSyntaxDescription.oa";
import { substringAssertion } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/substringAssertion.oa";
import * as decoders from "@wildboar/ldap/src/lib/syntaxDecoders";
import * as encoders from "@wildboar/ldap/src/lib/syntaxEncoders";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import decodeLDAPDN from "../ldap/decodeLDAPDN";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import * as localEncoders from "../ldap/syntaxEncoders";
import * as localDecoders from "../ldap/syntaxDecoders";

// IANA LDAP Syntaxes
import {
    authPasswordSyntax,
} from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordSyntax.oa";
import {
    bootParameterSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootParameterSyntax.oa";
import {
    nisNetgroupTripleSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisNetgroupTripleSyntax.oa";
import {
    componentFilter,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/componentFilter.oa";
import {
    null_,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/null.oa";
import {
    open,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/open.oa";
import {
    rdn,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/rdn.oa";
import {
    uuid,
} from "@wildboar/parity-schema/src/lib/modules/UUID/uuid.oa";

const ldapSyntaxes = {
    attributeTypeDescription,
    bitString,
    "boolean": boolean_,
    countryString,
    dn,
    deliveryMethod,
    directoryString,
    dITContentRuleDescription,
    dITStructureRuleDescription,
    enhancedGuide,
    facsimileTelephoneNr,
    fax,
    generalizedTime,
    guide,
    ia5String,
    integer,
    jpeg,
    matchingRuleDescription,
    matchingRuleUseDescription,
    nameAndOptionalUID,
    nameFormDescription,
    numericString,
    objectClassDescription,
    oid,
    otherMailbox,
    octetString,
    postalAddr,
    presentationAddr,
    printableString,
    subtreeSpec,
    telephoneNr,
    telexNr,
    utcTime,
    ldapSyntaxDescription,
    substringAssertion,
    authPasswordSyntax,
    bootParameterSyntax,
    nisNetgroupTripleSyntax,
    componentFilter,
    "null": null_,
    open,
    rdn,
};

const nisNetgroupTripleSyntaxSyntax: string = `NISNetgroupTripleSyntax ::= SEQUENCE {
    hostname    [0] IA5String OPTIONAL,
    username    [1] IA5String OPTIONAL,
    domainname  [2] IA5String OPTIONAL
}`;

const componentFilterSyntax: string = `ComponentReference  ::=  UTF8String

ComponentAssertion ::= SEQUENCE {
    component         ComponentReference (SIZE(1..MAX)) OPTIONAL,
    useDefaultValues  BOOLEAN DEFAULT TRUE,
    rule              MATCHING-RULE.&id,
    value             MATCHING-RULE.&AssertionType,
    ...
}

ComponentFilter ::= CHOICE {
    item  [0] ComponentAssertion,
    and   [1] SEQUENCE OF ComponentFilter,
    or    [2] SEQUENCE OF ComponentFilter,
    not   [3] ComponentFilter,
    ...
}`;

const bootParameterSyntaxSyntax: string = `BootParameterSyntax ::= SEQUENCE {
    key     IA5String,
    server  IA5String,
    path    IA5String
}`;

const authPasswordSyntaxSyntax: string = `PlaintextPasswordSyntax ::= OCTET STRING

AuthPasswordSyntax ::= SEQUENCE {
    algorithmIdentifier  AlgorithmIdentifier{{SupportedAlgorithms}},
    hashValue            PlaintextPasswordSyntax,
    ...
}`;

const ldapSyntaxToASN1Syntax = {
    "1.3.6.1.4.1.1466.115.121.1.3": "AttributeTypeDescription",
    "1.3.6.1.4.1.1466.115.121.1.6": "BIT STRING",
    "1.3.6.1.4.1.1466.115.121.1.7": "BOOLEAN",
    "1.3.6.1.4.1.1466.115.121.1.11": "CountryName",
    "1.3.6.1.4.1.1466.115.121.1.14": "PreferredDeliveryMethod",
    "1.3.6.1.4.1.1466.115.121.1.15": "UnboundedDirectoryString",
    "1.3.6.1.4.1.1466.115.121.1.16": "DITContentRuleDescription",
    "1.3.6.1.4.1.1466.115.121.1.17": "DITStructureRuleDescription",
    "1.3.6.1.4.1.1466.115.121.1.12": "DistinguishedName",
    "1.3.6.1.4.1.1466.115.121.1.21": "EnhancedGuide",
    "1.3.6.1.4.1.1466.115.121.1.22": "FacsimileTelephoneNumber",
    // "1.3.6.1.4.1.1466.115.121.1.23": "NULL",
    "1.3.6.1.4.1.1466.115.121.1.24": "GeneralizedTime",
    "1.3.6.1.4.1.1466.115.121.1.25": "Guide",
    "1.3.6.1.4.1.1466.115.121.1.26": "IA5String",
    "1.3.6.1.4.1.1466.115.121.1.27": "INTEGER",
    // "1.3.6.1.4.1.1466.115.121.1.28": "NULL",
    // "1.3.6.1.4.1.1466.115.121.1.54": "NULL",
    "1.3.6.1.4.1.1466.115.121.1.30": "MatchingRuleDescription",
    "1.3.6.1.4.1.1466.115.121.1.31": "MatchingRuleUseDescription",
    "1.3.6.1.4.1.1466.115.121.1.34": "NameAndOptionalUID",
    "1.3.6.1.4.1.1466.115.121.1.35": "NameFormDescription",
    "1.3.6.1.4.1.1466.115.121.1.36": "NumericString",
    "1.3.6.1.4.1.1466.115.121.1.37": "ObjectClassDescription",
    "1.3.6.1.4.1.1466.115.121.1.40": "OCTET STRING",
    "1.3.6.1.4.1.1466.115.121.1.38": "OBJECT IDENTIFIER",
    // "1.3.6.1.4.1.1466.115.121.1.39": "NULL",
    "1.3.6.1.4.1.1466.115.121.1.41": "PostalAddress",
    "1.3.6.1.4.1.1466.115.121.1.44": "PrintableString",
    "1.3.6.1.4.1.1466.115.121.1.58": "SubstringAssertion",
    "1.3.6.1.4.1.1466.115.121.1.50": "TelephoneNumber",
    // "1.3.6.1.4.1.1466.115.121.1.51": "", // Telex Terminal Identifier
    "1.3.6.1.4.1.1466.115.121.1.52": "TelexNumber",
    "1.3.6.1.4.1.1466.115.121.1.53": "UTCTime",
    "1.3.6.1.1.16.1": "UUID",
    [authPasswordSyntax["&id"].toString()]: authPasswordSyntaxSyntax, // Not supported, because its LDAP syntax is not well-defined.
    [bootParameterSyntax["&id"].toString()]: bootParameterSyntaxSyntax,
    [nisNetgroupTripleSyntax["&id"].toString()]: nisNetgroupTripleSyntaxSyntax,
    [componentFilter["&id"].toString()]: componentFilterSyntax,
    [null_["&id"].toString()]: "NULL",
    [open["&id"].toString()]: "TYPE-IDENTIFIER.&Type",
    [rdn["&id"].toString()]: "RelativeDistinguishedName",
};

/**
 * @summary Initialize Meerkat DSA's internal index of known LDAP syntaxes.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known LDAP syntaxes.
 *
 * @param ctx The context object
 *
 * @function
 */
export
function loadLDAPSyntaxes (ctx: Context): void {
    Object.values(ldapSyntaxes)
        .map(ldapSyntaxFromInformationObject)
        .forEach((syntax) => {
            ctx.ldapSyntaxes.set(syntax.id.toString(), syntax);
        });
    Object.entries(ldapSyntaxToASN1Syntax)
        .map(([ oid, syntax ]) => {
            ctx.ldapSyntaxToASN1Syntax.set(oid, syntax);
        });

    ctx.ldapSyntaxes.set(uuid.toString(), {
        id: uuid["&id"],
        description: "UUID",
        decoder: decoders.uuid,
        encoder: encoders.uuid,
    });

    ctx.ldapSyntaxes.get(attributeTypeDescription["&id"]!.toString())!.decoder = localDecoders.getAttributeTypesDecoder(ctx);
    ctx.ldapSyntaxes.get(attributeTypeDescription["&id"]!.toString())!.encoder = localEncoders.attributeTypes(ctx);
    ctx.ldapSyntaxes.get(bitString["&id"]!.toString())!.decoder = decoders.bitString;
    ctx.ldapSyntaxes.get(bitString["&id"]!.toString())!.encoder = encoders.bitString;
    ctx.ldapSyntaxes.get(boolean_["&id"]!.toString())!.decoder = decoders.boolean_;
    ctx.ldapSyntaxes.get(boolean_["&id"]!.toString())!.encoder = encoders.boolean_;
    ctx.ldapSyntaxes.get(countryString["&id"]!.toString())!.decoder = decoders.countryString;
    ctx.ldapSyntaxes.get(countryString["&id"]!.toString())!.encoder = encoders.countryString;
    ctx.ldapSyntaxes.get(dn["&id"]!.toString())!.decoder = (value: Uint8Array): ASN1Element => {
        const dn: DistinguishedName = decodeLDAPDN(ctx, value);
        return _encode_DistinguishedName(dn, DER);
    };
    ctx.ldapSyntaxes.get(dn["&id"]!.toString())!.encoder = (value: ASN1Element): Uint8Array => {
        const dn: DistinguishedName = _decode_DistinguishedName(value);
        return encodeLDAPDN(ctx, dn);
    };
    ctx.ldapSyntaxes.get(deliveryMethod["&id"]!.toString())!.decoder = decoders.deliveryMethod;
    ctx.ldapSyntaxes.get(deliveryMethod["&id"]!.toString())!.encoder = encoders.deliveryMethod;
    ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!.decoder = decoders.directoryString;
    ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!.encoder = encoders.directoryString;
    ctx.ldapSyntaxes.get(dITContentRuleDescription["&id"]!.toString())!.decoder = localDecoders.getDITContentRulesDecoder(ctx);
    ctx.ldapSyntaxes.get(dITContentRuleDescription["&id"]!.toString())!.encoder = localEncoders.dITContentRules;
    ctx.ldapSyntaxes.get(dITStructureRuleDescription["&id"]!.toString())!.decoder = localDecoders.getDITStructureRulesDecoder(ctx);
    ctx.ldapSyntaxes.get(dITStructureRuleDescription["&id"]!.toString())!.encoder = localEncoders.dITStructureRules;
    // enhancedGuide
    // facsimileTelephoneNr
    // fax
    ctx.ldapSyntaxes.get(generalizedTime["&id"]!.toString())!.decoder = decoders.generalizedTime;
    ctx.ldapSyntaxes.get(generalizedTime["&id"]!.toString())!.encoder = encoders.generalizedTime;
    // guide
    ctx.ldapSyntaxes.get(ia5String["&id"]!.toString())!.decoder = decoders.ia5String;
    ctx.ldapSyntaxes.get(ia5String["&id"]!.toString())!.encoder = encoders.ia5String;
    ctx.ldapSyntaxes.get(integer["&id"]!.toString())!.decoder = decoders.integer;
    ctx.ldapSyntaxes.get(integer["&id"]!.toString())!.encoder = encoders.integer;
    // jpeg
    ctx.ldapSyntaxes.get(jpeg["&id"]!.toString())!.decoder = decoders.jpeg;
    ctx.ldapSyntaxes.get(jpeg["&id"]!.toString())!.encoder = encoders.jpeg;
    ctx.ldapSyntaxes.get(matchingRuleDescription["&id"]!.toString())!.decoder = localDecoders.getMatchingRulesDecoder(ctx);
    ctx.ldapSyntaxes.get(matchingRuleDescription["&id"]!.toString())!.encoder = localEncoders.getMatchingRulesEncoder(ctx);
    ctx.ldapSyntaxes.get(matchingRuleUseDescription["&id"]!.toString())!.decoder = localDecoders.getMatchingRuleUseDecoder(ctx);
    ctx.ldapSyntaxes.get(matchingRuleUseDescription["&id"]!.toString())!.encoder = localEncoders.matchingRuleUse;
    // nameAndOptionalUID
    ctx.ldapSyntaxes.get(nameFormDescription["&id"]!.toString())!.decoder = localDecoders.getNameFormsDecoder(ctx);
    ctx.ldapSyntaxes.get(nameFormDescription["&id"]!.toString())!.encoder = localEncoders.nameForms;
    ctx.ldapSyntaxes.get(numericString["&id"]!.toString())!.decoder = decoders.numericString;
    ctx.ldapSyntaxes.get(numericString["&id"]!.toString())!.encoder = encoders.numericString;
    ctx.ldapSyntaxes.get(objectClassDescription["&id"]!.toString())!.decoder = localDecoders.getObjectClassesDecoder(ctx);
    ctx.ldapSyntaxes.get(objectClassDescription["&id"]!.toString())!.encoder = localEncoders.objectClasses;
    ctx.ldapSyntaxes.get(oid["&id"]!.toString())!.decoder = (value: Uint8Array): ASN1Element => {
        const desc = normalizeAttributeDescription(value);
        const id = ctx.nameToObjectIdentifier.get(desc);
        if (!id) {
            throw new Error(desc);
        }
        return _encodeObjectIdentifier(id, DER);
    };
    ctx.ldapSyntaxes.get(oid["&id"]!.toString())!.encoder = (value: ASN1Element): Uint8Array => {
        const name = ctx.objectIdentifierToName.get(value.objectIdentifier.toString());
        if (name) {
            return Buffer.from(name);
        } else {
            return encoders.oid(value);
        }
    };
    ctx.ldapSyntaxes.get(otherMailbox["&id"]!.toString())!.decoder = decoders.otherMailbox;
    ctx.ldapSyntaxes.get(otherMailbox["&id"]!.toString())!.encoder = encoders.otherMailbox;
    ctx.ldapSyntaxes.get(octetString["&id"]!.toString())!.decoder = decoders.octetString;
    ctx.ldapSyntaxes.get(octetString["&id"]!.toString())!.encoder = encoders.octetString;
    ctx.ldapSyntaxes.get(postalAddr["&id"]!.toString())!.decoder = decoders.postalAddress;
    ctx.ldapSyntaxes.get(postalAddr["&id"]!.toString())!.encoder = encoders.postalAddress;
    // presentationAddr
    ctx.ldapSyntaxes.get(printableString["&id"]!.toString())!.decoder = decoders.printableString;
    ctx.ldapSyntaxes.get(printableString["&id"]!.toString())!.encoder = encoders.printableString;
    ctx.ldapSyntaxes.get(subtreeSpec["&id"]!.toString())!.decoder = localDecoders.getSubtreeSpecificationDecoder(ctx);
    ctx.ldapSyntaxes.get(subtreeSpec["&id"]!.toString())!.encoder = localEncoders.getSubtreeSpecificationEncoder(ctx);
    ctx.ldapSyntaxes.get(telephoneNr["&id"]!.toString())!.decoder = localDecoders.telephoneNumber;
    ctx.ldapSyntaxes.get(telephoneNr["&id"]!.toString())!.encoder = localEncoders.telephoneNumber;
    // telexNr
    ctx.ldapSyntaxes.get(utcTime["&id"]!.toString())!.decoder = decoders.utcTime;
    ctx.ldapSyntaxes.get(utcTime["&id"]!.toString())!.encoder = encoders.utcTime;
    ctx.ldapSyntaxes.get(ldapSyntaxDescription["&id"]!.toString())!.decoder = localDecoders.ldapSyntaxes;
    ctx.ldapSyntaxes.get(ldapSyntaxDescription["&id"]!.toString())!.encoder = localEncoders.ldapSyntaxes;
    // substringAssertion

    ctx.ldapSyntaxes.set("cn", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("commonName", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("surname", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("sn", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);

    Object.entries(ldapSyntaxes).forEach(([ name, ldapSyntax ]) => {
        ctx.nameToObjectIdentifier.set(name, ldapSyntax["&id"]);
        ctx.objectIdentifierToName.set(ldapSyntax["&id"].toString(), name);
    });
}

export default loadLDAPSyntaxes;

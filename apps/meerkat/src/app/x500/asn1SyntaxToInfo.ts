import { ObjectIdentifier, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    _decodeBoolean,
    _decodeInteger,
    _decodePrintableString,
    _decodeGeneralizedTime,
    _decodeBitString,
    _decodeIA5String,
    _decodeUTCTime,
    _decodeOctetString,
    _decodeObjectIdentifier,
    _decodeNumericString,
} from "@wildboar/asn1/functional";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_CountryName,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_EnhancedGuide,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_FacsimileTelephoneNumber,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_TelephoneNumber,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_Guide,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_PostalAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_TelexNumber,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_PreferredDeliveryMethod,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_UUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_DITContentRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_DITStructureRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_MatchingRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_MatchingRuleUseDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_NameFormDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_ObjectClassDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_SubstringAssertion,
} from "@wildboar/x500/SelectedAttributeTypes";


export
const asn1SyntaxInfo: Record<string, [ ldapSyntax: OBJECT_IDENTIFIER, validator: undefined | ((value: any) => unknown) ]> = {
    "AttributeTypeDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.3"), undefined ],
    "BIT STRING": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.6"), _decodeBitString ],
    "BOOLEAN": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.7"), _decodeBoolean ],
    "CountryName": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.11"), _decode_CountryName ],
    "PreferredDeliveryMethod": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.14"), _decode_PreferredDeliveryMethod ],
    "UnboundedDirectoryString": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.15"), _decode_UnboundedDirectoryString ],
    "DITContentRuleDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.16"), _decode_DITContentRuleDescription ],
    "DITStructureRuleDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.17"), _decode_DITStructureRuleDescription ],
    "DistinguishedName": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.12"), _decode_DistinguishedName ],
    "EnhancedGuide": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.21"), _decode_EnhancedGuide ],
    "FacsimileTelephoneNumber": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.22"), _decode_FacsimileTelephoneNumber ],
    // "NULL": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.23"),  ],
    "GeneralizedTime": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.24"), _decodeGeneralizedTime ],
    "Guide": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.25"), _decode_Guide ],
    "IA5String": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.26"), _decodeIA5String ],
    "INTEGER": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.27"), _decodeInteger ],
    // "NULL": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.28"),  ],
    // "NULL": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.54"),  ],
    "MatchingRuleDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.30"), _decode_MatchingRuleDescription ],
    "MatchingRuleUseDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.31"), _decode_MatchingRuleUseDescription ],
    "NameAndOptionalUID": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.34"), _decode_NameAndOptionalUID ],
    "NameFormDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.35"), _decode_NameFormDescription ],
    "NumericString": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.36"), _decodeNumericString ],
    "ObjectClassDescription": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.37"), _decode_ObjectClassDescription ],
    "OCTET STRING": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.40"), _decodeOctetString ],
    "OBJECT IDENTIFIER": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.38"), _decodeObjectIdentifier ],
    // "NULL": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.39"),  ],
    "PostalAddress": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.41"), _decode_PostalAddress ],
    "PrintableString": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.44"), _decodePrintableString ],
    "SubstringAssertion": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.58"), _decode_SubstringAssertion ],
    "TelephoneNumber": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.50"), _decode_TelephoneNumber ],
    // "" // Telex Terminal Identifier: [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.51"),  ],
    "TelexNumber": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.52"), _decode_TelexNumber ],
    "UTCTime": [ ObjectIdentifier.fromString("1.3.6.1.4.1.1466.115.121.1.53"), _decodeUTCTime ],
    "UUID": [ ObjectIdentifier.fromString("1.3.6.1.1.16.1"), _decode_UUID ],
};

export default asn1SyntaxInfo;

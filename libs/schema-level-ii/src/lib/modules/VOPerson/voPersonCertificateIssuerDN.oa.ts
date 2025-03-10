/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { distinguishedNameMatch } from "@wildboar/x500/src/lib/modules/InformationFramework/distinguishedNameMatch.oa";
import { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
import { id_at_voPersonCertificateIssuerDN } from "../VOPerson/id-at-voPersonCertificateIssuerDN.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { AttributeUsage, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
export { distinguishedNameMatch } from "@wildboar/x500/src/lib/modules/InformationFramework/distinguishedNameMatch.oa";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
export { id_at_voPersonCertificateIssuerDN } from "../VOPerson/id-at-voPersonCertificateIssuerDN.va";


/* START_OF_SYMBOL_DEFINITION voPersonCertificateIssuerDN */
/**
 * @summary voPersonCertificateIssuerDN
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonCertificateIssuerDN ATTRIBUTE ::= {
 *     WITH SYNTAX                    DistinguishedName
 *     EQUALITY MATCHING RULE        distinguishedNameMatch
 *     LDAP-SYNTAX                    dn.&id
 *     LDAP-NAME                    {"voPersonCertificateIssuerDN"}
 *     LDAP-DESC                    "voPerson Certificate Issuer DN"
 *     ID                            id-at-voPersonCertificateIssuerDN
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export
const voPersonCertificateIssuerDN: ATTRIBUTE<DistinguishedName> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_DistinguishedName,
    },
    encoderFor: {
        "&Type": _encode_DistinguishedName,
    },
    "&equality-match": distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": dn["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonCertificateIssuerDN" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "voPerson Certificate Issuer DN" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_voPersonCertificateIssuerDN /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonCertificateIssuerDN */

/* eslint-enable */

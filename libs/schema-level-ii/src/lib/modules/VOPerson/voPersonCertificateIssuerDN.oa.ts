/* eslint-disable */
import type { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/InformationFramework";
import { distinguishedNameMatch } from "@wildboar/x500/InformationFramework";
import { dn } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_voPersonCertificateIssuerDN } from "../VOPerson/id-at-voPersonCertificateIssuerDN.va";





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

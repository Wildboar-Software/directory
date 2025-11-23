/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/InformationFramework";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/InformationFramework";
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/InformationFramework";
import { distinguishedNameMatch } from "@wildboar/x500/InformationFramework";
import { dn } from "@wildboar/x500/SelectedAttributeTypes";
import { id_at_voPersonCertificateDN } from "../VOPerson/id-at-voPersonCertificateDN.va";





/* START_OF_SYMBOL_DEFINITION voPersonCertificateDN */
/**
 * @summary voPersonCertificateDN
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * voPersonCertificateDN ATTRIBUTE ::= {
 *     WITH SYNTAX                    DistinguishedName
 *     EQUALITY MATCHING RULE        distinguishedNameMatch
 *     LDAP-SYNTAX                    dn.&id
 *     LDAP-NAME                    {"voPersonCertificateDN"}
 *     LDAP-DESC                    "voPerson Certificate Distinguished Name"
 *     ID                            id-at-voPersonCertificateDN
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName>}
 * @implements {ATTRIBUTE<DistinguishedName>}
 */
export
const voPersonCertificateDN: ATTRIBUTE<DistinguishedName> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_DistinguishedName,
    },
    encoderFor: {
        "&Type": _encode_DistinguishedName,
    },
    "&equality-match": distinguishedNameMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": dn["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "voPersonCertificateDN" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "voPerson Certificate Distinguished Name" /* OBJECT_FIELD_SETTING */,
    "&id": id_at_voPersonCertificateDN /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION voPersonCertificateDN */

/* eslint-enable */

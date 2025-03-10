/* eslint-disable */
import { Certificate, _decode_Certificate, _encode_Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import { x509Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/x509Certificate.oa";
import { certificateExactMatch } from "@wildboar/x500/src/lib/modules/CertificateExtensions/certificateExactMatch.oa";
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { id_at_atn_DerCertificate } from "../ATNDirectoryObjectIdentifiers/id-at-atn-DerCertificate.va";




/* START_OF_SYMBOL_DEFINITION atn_der_certificate */
/**
 * @summary atn_der_certificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atn-der-certificate ATTRIBUTE ::= {
 *     WITH SYNTAX                 Certificate
 *     EQUALITY MATCHING RULE      certificateExactMatch
 *     LDAP-SYNTAX                 x509Certificate.&id
 *     LDAP-NAME                   {"atn-der-certificate"}
 *     ID                          id-at-atn-DerCertificate
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Certificate>}
 * @implements {ATTRIBUTE<Certificate>}
 */
export
const atn_der_certificate: ATTRIBUTE<Certificate> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": _decode_Certificate,
    },
    encoderFor: {
        "&Type": _encode_Certificate,
    },
    "&equality-match": certificateExactMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": x509Certificate["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "atn-der-certificate" ] /* OBJECT_FIELD_SETTING */,
    "&id": id_at_atn_DerCertificate /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atn_der_certificate */

/* eslint-enable */

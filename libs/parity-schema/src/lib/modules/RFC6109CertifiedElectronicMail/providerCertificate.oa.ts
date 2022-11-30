/* eslint-disable */
import {
    Certificate,
    _decode_Certificate,
    _encode_Certificate,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta';
import { x509Certificate } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/x509Certificate.oa';
import { certificateExactMatch } from '@wildboar/x500/src/lib/modules/CertificateExtensions/certificateExactMatch.oa';
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';

/* START_OF_SYMBOL_DEFINITION providerCertificate */
/**
 * @summary providerCertificate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * providerCertificate ATTRIBUTE ::= {
 *     WITH SYNTAX                 Certificate
 *     EQUALITY MATCHING RULE      certificateExactMatch
 *     LDAP-SYNTAX                 x509Certificate.&id
 *     LDAP-NAME                     {"providerCertificate"}
 *     LDAP-DESC                   "X.509 certificate in ASN.1 DER binary format"
 *     ID                          { 1 3 6 1 4 1 16572 2 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Certificate>}
 * @implements {ATTRIBUTE<Certificate>}
 */
export const providerCertificate: ATTRIBUTE<Certificate> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Certificate,
    },
    encoderFor: {
        '&Type': _encode_Certificate,
    },
    '&equality-match': certificateExactMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': x509Certificate['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['providerCertificate'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'X.509 certificate in ASN.1 DER binary format' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 16572, 2, 2, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION providerCertificate */

/* eslint-enable */

/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { IA5String, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_james_kempf } from '../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
export { id_james_kempf } from '../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va';

/* START_OF_SYMBOL_DEFINITION service_advert_url_authenticator */
/**
 * @summary service_advert_url_authenticator
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * service-advert-url-authenticator ATTRIBUTE ::= {
 *     WITH SYNTAX                     IA5String
 *     SINGLE VALUE                    TRUE
 *     LDAP-SYNTAX                     ia5String.&id
 *     LDAP-NAME                       { "service-advert-url-authenticator" }
 *     LDAP-DESC                       "The authenticator for the URL, null if none."
 *     ID { id-james-kempf 2 27 6 1 6 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const service_advert_url_authenticator: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': [
        'service-advert-url-authenticator',
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The authenticator for the URL, null if none.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 27, 6, 1, 6],
        id_james_kempf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION service_advert_url_authenticator */

/* eslint-enable */

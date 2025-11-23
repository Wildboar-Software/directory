/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { boolean_ } from '@wildboar/x500/SelectedAttributeTypes';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
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
export { boolean_ } from '@wildboar/x500/SelectedAttributeTypes';
export { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';

/* START_OF_SYMBOL_DEFINITION radiusClientRequireMa */
/**
 * @summary radiusClientRequireMa
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * radiusClientRequireMa ATTRIBUTE ::= {
 *     EQUALITY MATCHING RULE      booleanMatch
 *     SINGLE VALUE                TRUE
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                   { "radiusClientRequireMa" }
 *     LDAP-DESC                   "Require Message Authenticator"
 *     ID                          { id-at-freeRadius 4 1 1 2 7 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const radiusClientRequireMa: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': boolean_['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['radiusClientRequireMa'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Require Message Authenticator' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 1, 1, 2, 7],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusClientRequireMa */

/* eslint-enable */

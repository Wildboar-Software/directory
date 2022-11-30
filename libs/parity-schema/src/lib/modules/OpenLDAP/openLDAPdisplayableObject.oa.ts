/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { displayName } from '../InetOrgPerson/displayName.oa';
import { id_openldap_oc } from '../OpenLDAP/id-openldap-oc.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { id_openldap_oc } from '../OpenLDAP/id-openldap-oc.va';

/* START_OF_SYMBOL_DEFINITION openLDAPdisplayableObject */
/**
 * @summary openLDAPdisplayableObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * openLDAPdisplayableObject OBJECT-CLASS ::= {
 *     KIND            auxiliary
 *     MAY CONTAIN     {displayName}
 *     LDAP-NAME        {"OpenLDAPdisplayableObject"}
 *     LDAP-DESC       "OpenLDAP Displayable Object"
 *     ID                { id-openldap-oc 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const openLDAPdisplayableObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [displayName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['OpenLDAPdisplayableObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'OpenLDAP Displayable Object' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6],
        id_openldap_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPdisplayableObject */

/* eslint-enable */

/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { organizationalUnit } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { buildingName } from '../Cosine/buildingName.oa';
import { displayName } from '../InetOrgPerson/displayName.oa';
import { id_openldap_oc } from '../OpenLDAP/id-openldap-oc.va';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';
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

/* START_OF_SYMBOL_DEFINITION openLDAPou */
/**
 * @summary openLDAPou
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * openLDAPou OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organizationalUnit}
 *     KIND            structural
 *     MAY CONTAIN     {buildingName | displayName | labeledURI | organizationName}
 *     LDAP-NAME        {"OpenLDAPou"}
 *     LDAP-DESC       "OpenLDAP Organizational Unit Object"
 *     ID                { id-openldap-oc 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const openLDAPou: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organizationalUnit] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        buildingName,
        displayName,
        labeledURI,
        organizationName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['OpenLDAPou'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'OpenLDAP Organizational Unit Object' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [4],
        id_openldap_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPou */

/* eslint-enable */

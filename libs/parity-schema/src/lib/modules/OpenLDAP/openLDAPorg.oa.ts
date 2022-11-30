/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { organization } from '@wildboar/x500/src/lib/modules/SelectedObjectClasses/organization.oa';
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

/* START_OF_SYMBOL_DEFINITION openLDAPorg */
/**
 * @summary openLDAPorg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * openLDAPorg OBJECT-CLASS ::= {
 *     SUBCLASS OF     {organization}
 *     KIND            structural
 *     MAY CONTAIN     {buildingName | displayName | labeledURI}
 *     LDAP-NAME        {"OpenLDAPorg"}
 *     LDAP-DESC       "OpenLDAP Organizational Object"
 *     ID                { id-openldap-oc 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const openLDAPorg: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organization] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        buildingName,
        displayName,
        labeledURI,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['OpenLDAPorg'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'OpenLDAP Organizational Object' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [3],
        id_openldap_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPorg */

/* eslint-enable */

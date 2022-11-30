/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { givenName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/givenName.oa';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { pilotPerson } from '../Cosine/pilotPerson.oa';
import { inetOrgPerson } from '../InetOrgPerson/inetOrgPerson.oa';
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
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
export { id_openldap_oc } from '../OpenLDAP/id-openldap-oc.va';

/* START_OF_SYMBOL_DEFINITION openLDAPperson */
/**
 * @summary openLDAPperson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * openLDAPperson OBJECT-CLASS ::= {
 *     SUBCLASS OF     {pilotPerson | inetOrgPerson}
 *     KIND            structural
 *     MUST CONTAIN    {uid | commonName}
 *     MAY CONTAIN     {givenName | labeledURI | organizationName}
 *     LDAP-NAME        {"OpenLDAPperson"}
 *     LDAP-DESC       "OpenLDAP Person"
 *     ID                { id-openldap-oc 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const openLDAPperson: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [pilotPerson, inetOrgPerson] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid, commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        givenName,
        labeledURI,
        organizationName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['OpenLDAPperson'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'OpenLDAP Person' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [5],
        id_openldap_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPperson */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { givenName } from '@wildboar/x500/SelectedAttributeTypes';
import { organizationName } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { pilotPerson } from '../Cosine/pilotPerson.oa';
import { inetOrgPerson } from '../InetOrgPerson/inetOrgPerson.oa';
import { id_openldap_oc } from '../OpenLDAP/id-openldap-oc.va';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';


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
    '&id': _OID.fromParts(
        [5],
        id_openldap_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION openLDAPperson */

/* eslint-enable */

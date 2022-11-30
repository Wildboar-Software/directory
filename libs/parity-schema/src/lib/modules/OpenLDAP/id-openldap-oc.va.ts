/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_openldap } from '../OpenLDAP/id-openldap.va';
export { id_openldap } from '../OpenLDAP/id-openldap.va';

/* START_OF_SYMBOL_DEFINITION id_openldap_oc */
/**
 * @summary id_openldap_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-openldap-oc      OBJECT IDENTIFIER ::= { id-openldap 4 }
 * ```
 *
 * @constant
 */
export const id_openldap_oc: OBJECT_IDENTIFIER = new _OID([4], id_openldap);
/* END_OF_SYMBOL_DEFINITION id_openldap_oc */

/* eslint-enable */

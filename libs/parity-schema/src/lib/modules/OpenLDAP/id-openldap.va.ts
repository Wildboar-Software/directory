/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_openldapRoot } from '../OpenLDAP/id-openldapRoot.va';
export { id_openldapRoot } from '../OpenLDAP/id-openldapRoot.va';

/* START_OF_SYMBOL_DEFINITION id_openldap */
/**
 * @summary id_openldap
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-openldap         OBJECT IDENTIFIER ::= { id-openldapRoot 1 }
 * ```
 *
 * @constant
 */
export const id_openldap: OBJECT_IDENTIFIER = new _OID([1], id_openldapRoot);
/* END_OF_SYMBOL_DEFINITION id_openldap */

/* eslint-enable */

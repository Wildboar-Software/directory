/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_as */
/**
 * @summary id_as
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-as OBJECT IDENTIFIER ::= {id-cs3 as(5)}
 * ```
 *
 * @constant
 */
export const id_as: OBJECT_IDENTIFIER = new _OID([/* as */ 5], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_as */

/* eslint-enable */

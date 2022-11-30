/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_mt */
/**
 * @summary id_mt
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-mt OBJECT IDENTIFIER ::= {id-cs3 mt(7)}
 * ```
 *
 * @constant
 */
export const id_mt: OBJECT_IDENTIFIER = new _OID([/* mt */ 7], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_mt */

/* eslint-enable */

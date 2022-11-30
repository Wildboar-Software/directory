/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_oc } from '../IN-CS3-object-identifiers/id-oc.va';
export { id_oc } from '../IN-CS3-object-identifiers/id-oc.va';

/* START_OF_SYMBOL_DEFINITION id_oc_tokensStock */
/**
 * @summary id_oc_tokensStock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-oc-tokensStock OBJECT IDENTIFIER ::= {id-oc tokenStock(2)}
 * ```
 *
 * @constant
 */
export const id_oc_tokensStock: OBJECT_IDENTIFIER = new _OID(
    [/* tokenStock */ 2],
    id_oc
);
/* END_OF_SYMBOL_DEFINITION id_oc_tokensStock */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION attributeSyntaxVendor */
/**
 * @summary attributeSyntaxVendor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * attributeSyntaxVendor                    ID ::= {ds 5}
 * ```
 *
 * @constant
 */
export const attributeSyntaxVendor: ID = new _OID([5], ds);
/* END_OF_SYMBOL_DEFINITION attributeSyntaxVendor */

/* eslint-enable */

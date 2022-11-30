/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION attributeSyntax */
/**
 * @summary attributeSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * attributeSyntax                          ID ::= {ds 40}
 * ```
 *
 * @constant
 */
export const attributeSyntax: ID = new _OID([40], ds);
/* END_OF_SYMBOL_DEFINITION attributeSyntax */

/* eslint-enable */

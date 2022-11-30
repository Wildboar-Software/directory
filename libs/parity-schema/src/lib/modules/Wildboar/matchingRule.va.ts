/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION matchingRule */
/**
 * @summary matchingRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * matchingRule                             ID ::= {ds 13}
 * ```
 *
 * @constant
 */
export const matchingRule: ID = new _OID([13], ds);
/* END_OF_SYMBOL_DEFINITION matchingRule */

/* eslint-enable */

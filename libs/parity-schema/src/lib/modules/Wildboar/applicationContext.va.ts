/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION applicationContext */
/**
 * @summary applicationContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * applicationContext                       ID ::= {ds 3}
 * ```
 *
 * @constant
 */
export const applicationContext: ID = new _OID([3], ds);
/* END_OF_SYMBOL_DEFINITION applicationContext */

/* eslint-enable */

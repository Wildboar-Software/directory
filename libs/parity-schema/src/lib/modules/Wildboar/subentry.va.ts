/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION subentry */
/**
 * @summary subentry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * subentry                                 ID ::= {ds 17}
 * ```
 *
 * @constant
 */
export const subentry: ID = new _OID([17], ds);
/* END_OF_SYMBOL_DEFINITION subentry */

/* eslint-enable */

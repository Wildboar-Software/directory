/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION serviceElement */
/**
 * @summary serviceElement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * serviceElement                           ID ::= {ds 2}
 * ```
 *
 * @constant
 */
export const serviceElement: ID = new _OID([2], ds);
/* END_OF_SYMBOL_DEFINITION serviceElement */

/* eslint-enable */

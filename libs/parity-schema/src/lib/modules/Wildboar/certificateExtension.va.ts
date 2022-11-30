/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION certificateExtension */
/**
 * @summary certificateExtension
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * certificateExtension                     ID ::= {ds 29}
 * ```
 *
 * @constant
 */
export const certificateExtension: ID = new _OID([29], ds);
/* END_OF_SYMBOL_DEFINITION certificateExtension */

/* eslint-enable */

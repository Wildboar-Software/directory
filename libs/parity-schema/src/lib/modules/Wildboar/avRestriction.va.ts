/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION avRestriction */
/**
 * @summary avRestriction
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * avRestriction                            ID ::= {ds 41}
 * ```
 *
 * @constant
 */
export const avRestriction: ID = new _OID([41], ds);
/* END_OF_SYMBOL_DEFINITION avRestriction */

/* eslint-enable */

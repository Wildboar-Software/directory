/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION idmProtocol */
/**
 * @summary idmProtocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * idmProtocol                              ID ::= {ds 33}
 * ```
 *
 * @constant
 */
export const idmProtocol: ID = new _OID([33], ds);
/* END_OF_SYMBOL_DEFINITION idmProtocol */

/* eslint-enable */

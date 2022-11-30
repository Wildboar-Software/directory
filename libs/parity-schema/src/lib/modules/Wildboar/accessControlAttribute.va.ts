/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION accessControlAttribute */
/**
 * @summary accessControlAttribute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accessControlAttribute                   ID ::= {ds 24}
 * ```
 *
 * @constant
 */
export const accessControlAttribute: ID = new _OID([24], ds);
/* END_OF_SYMBOL_DEFINITION accessControlAttribute */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION attributeValueContext */
/**
 * @summary attributeValueContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * attributeValueContext                    ID ::= {ds 31}
 * ```
 *
 * @constant
 */
export const attributeValueContext: ID = new _OID([31], ds);
/* END_OF_SYMBOL_DEFINITION attributeValueContext */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION keyPurposes */
/**
 * @summary keyPurposes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * keyPurposes                              ID ::= {ds 38}
 * ```
 *
 * @constant
 */
export const keyPurposes: ID = new _OID([38], ds);
/* END_OF_SYMBOL_DEFINITION keyPurposes */

/* eslint-enable */

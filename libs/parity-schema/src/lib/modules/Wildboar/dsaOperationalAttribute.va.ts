/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION dsaOperationalAttribute */
/**
 * @summary dsaOperationalAttribute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dsaOperationalAttribute                  ID ::= {ds 12}
 * ```
 *
 * @constant
 */
export const dsaOperationalAttribute: ID = new _OID([12], ds);
/* END_OF_SYMBOL_DEFINITION dsaOperationalAttribute */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION notification */
/**
 * @summary notification
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * notification                             ID ::= {ds 35}
 * ```
 *
 * @constant
 */
export const notification: ID = _OID.fromParts([35], ds);
/* END_OF_SYMBOL_DEFINITION notification */

/* eslint-enable */

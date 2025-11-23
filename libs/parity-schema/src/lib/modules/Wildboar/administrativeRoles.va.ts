/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION administrativeRoles */
/**
 * @summary administrativeRoles
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * administrativeRoles                      ID ::= {ds 23}
 * ```
 *
 * @constant
 */
export const administrativeRoles: ID = _OID.fromParts([23], ds);
/* END_OF_SYMBOL_DEFINITION administrativeRoles */

/* eslint-enable */

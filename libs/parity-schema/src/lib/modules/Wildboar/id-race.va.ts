/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_race */
/**
 * @summary id_race
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-race                                  ID ::= {ds 54}
 * ```
 *
 * @constant
 */
export const id_race: ID = new _OID([54], ds);
/* END_OF_SYMBOL_DEFINITION id_race */

/* eslint-enable */

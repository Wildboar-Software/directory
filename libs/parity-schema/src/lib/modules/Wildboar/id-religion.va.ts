/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_religion */
/**
 * @summary id_religion
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-religion                              ID ::= {ds 58}
 * ```
 *
 * @constant
 */
export const id_religion: ID = new _OID([58], ds);
/* END_OF_SYMBOL_DEFINITION id_religion */

/* eslint-enable */

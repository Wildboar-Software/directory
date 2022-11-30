/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_birthMethod */
/**
 * @summary id_birthMethod
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-birthMethod                           ID ::= {ds 51}
 * ```
 *
 * @constant
 */
export const id_birthMethod: ID = new _OID([51], ds);
/* END_OF_SYMBOL_DEFINITION id_birthMethod */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_mannerOfDeath */
/**
 * @summary id_mannerOfDeath
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-mannerOfDeath                         ID ::= {ds 56}
 * ```
 *
 * @constant
 */
export const id_mannerOfDeath: ID = new _OID([56], ds);
/* END_OF_SYMBOL_DEFINITION id_mannerOfDeath */

/* eslint-enable */

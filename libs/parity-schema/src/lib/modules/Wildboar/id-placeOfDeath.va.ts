/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_placeOfDeath */
/**
 * @summary id_placeOfDeath
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-placeOfDeath                          ID ::= {ds 52}
 * ```
 *
 * @constant
 */
export const id_placeOfDeath: ID = _OID.fromParts([52], ds);
/* END_OF_SYMBOL_DEFINITION id_placeOfDeath */

/* eslint-enable */

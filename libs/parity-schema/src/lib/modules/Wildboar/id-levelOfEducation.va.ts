/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION id_levelOfEducation */
/**
 * @summary id_levelOfEducation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-levelOfEducation                      ID ::= {ds 53}
 * ```
 *
 * @constant
 */
export const id_levelOfEducation: ID = _OID.fromParts([53], ds);
/* END_OF_SYMBOL_DEFINITION id_levelOfEducation */

/* eslint-enable */

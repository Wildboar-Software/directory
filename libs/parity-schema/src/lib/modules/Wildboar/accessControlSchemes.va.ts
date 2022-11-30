/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION accessControlSchemes */
/**
 * @summary accessControlSchemes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accessControlSchemes                     ID ::= {ds 28}
 * ```
 *
 * @constant
 */
export const accessControlSchemes: ID = new _OID([28], ds);
/* END_OF_SYMBOL_DEFINITION accessControlSchemes */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION schemaOperationalAttribute */
/**
 * @summary schemaOperationalAttribute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * schemaOperationalAttribute               ID ::= {ds 21}
 * ```
 *
 * @constant
 */
export const schemaOperationalAttribute: ID = new _OID([21], ds);
/* END_OF_SYMBOL_DEFINITION schemaOperationalAttribute */

/* eslint-enable */

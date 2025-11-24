/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION schemaObjectClass */
/**
 * @summary schemaObjectClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * schemaObjectClass                        ID ::= {ds 20}
 * ```
 *
 * @constant
 */
export const schemaObjectClass: ID = _OID.fromParts([20], ds);
/* END_OF_SYMBOL_DEFINITION schemaObjectClass */

/* eslint-enable */

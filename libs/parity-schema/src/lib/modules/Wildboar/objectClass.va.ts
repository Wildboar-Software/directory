/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION objectClass */
/**
 * @summary objectClass
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * objectClass                              ID ::= {ds 6}
 * ```
 *
 * @constant
 */
export const objectClass: ID = _OID.fromParts([6], ds);
/* END_OF_SYMBOL_DEFINITION objectClass */

/* eslint-enable */

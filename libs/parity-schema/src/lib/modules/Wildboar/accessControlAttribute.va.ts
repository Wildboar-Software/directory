/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION accessControlAttribute */
/**
 * @summary accessControlAttribute
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accessControlAttribute                   ID ::= {ds 24}
 * ```
 *
 * @constant
 */
export const accessControlAttribute: ID = _OID.fromParts([24], ds);
/* END_OF_SYMBOL_DEFINITION accessControlAttribute */

/* eslint-enable */

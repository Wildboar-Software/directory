/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION matchingRestriction */
/**
 * @summary matchingRestriction
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * matchingRestriction                      ID ::= {ds 36}
 * ```
 *
 * @constant
 */
export const matchingRestriction: ID = _OID.fromParts([36], ds);
/* END_OF_SYMBOL_DEFINITION matchingRestriction */

/* eslint-enable */

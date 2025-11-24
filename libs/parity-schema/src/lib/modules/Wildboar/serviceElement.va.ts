/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION serviceElement */
/**
 * @summary serviceElement
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * serviceElement                           ID ::= {ds 2}
 * ```
 *
 * @constant
 */
export const serviceElement: ID = _OID.fromParts([2], ds);
/* END_OF_SYMBOL_DEFINITION serviceElement */

/* eslint-enable */

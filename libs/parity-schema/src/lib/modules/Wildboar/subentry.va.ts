/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION subentry */
/**
 * @summary subentry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * subentry                                 ID ::= {ds 17}
 * ```
 *
 * @constant
 */
export const subentry: ID = _OID.fromParts([17], ds);
/* END_OF_SYMBOL_DEFINITION subentry */

/* eslint-enable */

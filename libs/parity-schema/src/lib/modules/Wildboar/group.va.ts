/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION group */
/**
 * @summary group
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * group                                    ID ::= {ds 16}
 * ```
 *
 * @constant
 */
export const group: ID = _OID.fromParts([16], ds);
/* END_OF_SYMBOL_DEFINITION group */

/* eslint-enable */

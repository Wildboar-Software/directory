/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION managementObject */
/**
 * @summary managementObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * managementObject                         ID ::= {ds 30}
 * ```
 *
 * @constant
 */
export const managementObject: ID = _OID.fromParts([30], ds);
/* END_OF_SYMBOL_DEFINITION managementObject */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { mapping } from '../MIXERAddressMapping/mapping.va';
export { mapping } from '../MIXERAddressMapping/mapping.va';

/* START_OF_SYMBOL_DEFINITION at */
/**
 * @summary at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at OBJECT IDENTIFIER ::= {mapping 2}
 * ```
 *
 * @constant
 */
export const at: OBJECT_IDENTIFIER = _OID.fromParts([2], mapping);
/* END_OF_SYMBOL_DEFINITION at */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { mapping } from '../MIXERAddressMapping/mapping.va';
export { mapping } from '../MIXERAddressMapping/mapping.va';

/* START_OF_SYMBOL_DEFINITION oc */
/**
 * @summary oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * oc OBJECT IDENTIFIER ::= {mapping 1}
 * ```
 *
 * @constant
 */
export const oc: OBJECT_IDENTIFIER = _OID.fromParts([1], mapping);
/* END_OF_SYMBOL_DEFINITION oc */

/* eslint-enable */

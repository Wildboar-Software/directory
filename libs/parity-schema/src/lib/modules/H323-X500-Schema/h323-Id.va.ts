/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { h350_cr } from '../H323-X500-Schema/h350-cr.va';

/* START_OF_SYMBOL_DEFINITION h323_Id */
/**
 * @summary h323_Id
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h323-Id OBJECT IDENTIFIER ::= {h350-cr h323-Id(3)}
 * ```
 *
 * @constant
 */
export const h323_Id: OBJECT_IDENTIFIER = _OID.fromParts([/* h323-Id */ 3], h350_cr);
/* END_OF_SYMBOL_DEFINITION h323_Id */

/* eslint-enable */

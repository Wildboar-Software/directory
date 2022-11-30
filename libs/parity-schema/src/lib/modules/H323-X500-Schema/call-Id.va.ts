/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { h350_cr } from '../H323-X500-Schema/h350-cr.va';
export { h350_cr } from '../H323-X500-Schema/h350-cr.va';

/* START_OF_SYMBOL_DEFINITION call_Id */
/**
 * @summary call_Id
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * call-Id OBJECT IDENTIFIER ::= {h350-cr call-Id(8)}
 * ```
 *
 * @constant
 */
export const call_Id: OBJECT_IDENTIFIER = new _OID([/* call-Id */ 8], h350_cr);
/* END_OF_SYMBOL_DEFINITION call_Id */

/* eslint-enable */

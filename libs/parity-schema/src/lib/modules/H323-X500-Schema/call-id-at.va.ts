/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { call_Id } from '../H323-X500-Schema/call-Id.va';
export { call_Id } from '../H323-X500-Schema/call-Id.va';

/* START_OF_SYMBOL_DEFINITION call_id_at */
/**
 * @summary call_id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * call-id-at OBJECT IDENTIFIER ::= {call-Id at(1)}
 * ```
 *
 * @constant
 */
export const call_id_at: OBJECT_IDENTIFIER = _OID.fromParts([/* at */ 1], call_Id);
/* END_OF_SYMBOL_DEFINITION call_id_at */

/* eslint-enable */

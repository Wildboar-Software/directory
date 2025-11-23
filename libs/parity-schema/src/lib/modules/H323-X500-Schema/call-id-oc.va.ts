/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { call_Id } from '../H323-X500-Schema/call-Id.va';
export { call_Id } from '../H323-X500-Schema/call-Id.va';

/* START_OF_SYMBOL_DEFINITION call_id_oc */
/**
 * @summary call_id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * call-id-oc OBJECT IDENTIFIER ::= {call-Id oc(2)}
 * ```
 *
 * @constant
 */
export const call_id_oc: OBJECT_IDENTIFIER = _OID.fromParts([/* oc */ 2], call_Id);
/* END_OF_SYMBOL_DEFINITION call_id_oc */

/* eslint-enable */

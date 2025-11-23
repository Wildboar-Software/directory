/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { sip_Id } from '../H323-X500-Schema/sip-Id.va';
export { sip_Id } from '../H323-X500-Schema/sip-Id.va';

/* START_OF_SYMBOL_DEFINITION sip_id_at */
/**
 * @summary sip_id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sip-id-at OBJECT IDENTIFIER ::= {sip-Id at(1)}
 * ```
 *
 * @constant
 */
export const sip_id_at: OBJECT_IDENTIFIER = _OID.fromParts([/* at */ 1], sip_Id);
/* END_OF_SYMBOL_DEFINITION sip_id_at */

/* eslint-enable */

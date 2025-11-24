/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { sip_Id } from '../H323-X500-Schema/sip-Id.va';

/* START_OF_SYMBOL_DEFINITION sip_id_oc */
/**
 * @summary sip_id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sip-id-oc OBJECT IDENTIFIER ::= {sip-Id oc(2)}
 * ```
 *
 * @constant
 */
export const sip_id_oc: OBJECT_IDENTIFIER = _OID.fromParts([/* oc */ 2], sip_Id);
/* END_OF_SYMBOL_DEFINITION sip_id_oc */

/* eslint-enable */

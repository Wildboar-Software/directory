/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { sip_Id } from '../H323-X500-Schema/sip-Id.va';
export { sip_Id } from '../H323-X500-Schema/sip-Id.va';

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
export const sip_id_oc: OBJECT_IDENTIFIER = new _OID([/* oc */ 2], sip_Id);
/* END_OF_SYMBOL_DEFINITION sip_id_oc */

/* eslint-enable */

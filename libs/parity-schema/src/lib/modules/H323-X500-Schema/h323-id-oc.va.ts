/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { h323_Id } from '../H323-X500-Schema/h323-Id.va';
export { h323_Id } from '../H323-X500-Schema/h323-Id.va';

/* START_OF_SYMBOL_DEFINITION h323_id_oc */
/**
 * @summary h323_id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h323-id-oc OBJECT IDENTIFIER ::= {h323-Id oc(2)}
 * ```
 *
 * @constant
 */
export const h323_id_oc: OBJECT_IDENTIFIER = new _OID([/* oc */ 2], h323_Id);
/* END_OF_SYMBOL_DEFINITION h323_id_oc */

/* eslint-enable */

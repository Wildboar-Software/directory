/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { h235_Id } from '../H323-X500-Schema/h235-Id.va';
export { h235_Id } from '../H323-X500-Schema/h235-Id.va';

/* START_OF_SYMBOL_DEFINITION h235_id_oc */
/**
 * @summary h235_id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h235-id-oc OBJECT IDENTIFIER ::= {h235-Id oc(2)}
 * ```
 *
 * @constant
 */
export const h235_id_oc: OBJECT_IDENTIFIER = new _OID([/* oc */ 2], h235_Id);
/* END_OF_SYMBOL_DEFINITION h235_id_oc */

/* eslint-enable */

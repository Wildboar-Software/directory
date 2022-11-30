/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { h320_Id } from '../H323-X500-Schema/h320-Id.va';
export { h320_Id } from '../H323-X500-Schema/h320-Id.va';

/* START_OF_SYMBOL_DEFINITION h320_id_oc */
/**
 * @summary h320_id_oc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h320-id-oc OBJECT IDENTIFIER ::= {h320-Id oc(2)}
 * ```
 *
 * @constant
 */
export const h320_id_oc: OBJECT_IDENTIFIER = new _OID([/* oc */ 2], h320_Id);
/* END_OF_SYMBOL_DEFINITION h320_id_oc */

/* eslint-enable */

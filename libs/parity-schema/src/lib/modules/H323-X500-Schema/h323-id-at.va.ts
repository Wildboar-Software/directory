/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { h323_Id } from '../H323-X500-Schema/h323-Id.va';
export { h323_Id } from '../H323-X500-Schema/h323-Id.va';

/* START_OF_SYMBOL_DEFINITION h323_id_at */
/**
 * @summary h323_id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * h323-id-at OBJECT IDENTIFIER ::= {h323-Id at(1)}
 * ```
 *
 * @constant
 */
export const h323_id_at: OBJECT_IDENTIFIER = new _OID([/* at */ 1], h323_Id);
/* END_OF_SYMBOL_DEFINITION h323_id_at */

/* eslint-enable */

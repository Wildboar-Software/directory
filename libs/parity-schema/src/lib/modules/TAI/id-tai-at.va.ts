/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_tai } from '../TAI/id-tai.va';
export { id_tai } from '../TAI/id-tai.va';

/* START_OF_SYMBOL_DEFINITION id_tai_at */
/**
 * @summary id_tai_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-tai-at                                   OBJECT IDENTIFIER ::= {id-tai attributes(1)}
 * ```
 *
 * @constant
 */
export const id_tai_at: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* attributes */ 1],
    id_tai
);
/* END_OF_SYMBOL_DEFINITION id_tai_at */

/* eslint-enable */

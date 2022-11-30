/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_tai } from '../TAI/id-tai.va';
export { id_tai } from '../TAI/id-tai.va';

/* START_OF_SYMBOL_DEFINITION id_tai_ce */
/**
 * @summary id_tai_ce
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-tai-ce                                   OBJECT IDENTIFIER ::= {id-tai certificate-extensions(2)}
 * ```
 *
 * @constant
 */
export const id_tai_ce: OBJECT_IDENTIFIER = new _OID(
    [/* certificate-extensions */ 2],
    id_tai
);
/* END_OF_SYMBOL_DEFINITION id_tai_ce */

/* eslint-enable */

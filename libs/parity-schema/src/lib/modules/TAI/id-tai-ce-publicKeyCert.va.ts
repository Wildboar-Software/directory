/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_tai_ce } from '../TAI/id-tai-ce.va';
export { id_tai_ce } from '../TAI/id-tai-ce.va';

/* START_OF_SYMBOL_DEFINITION id_tai_ce_publicKeyCert */
/**
 * @summary id_tai_ce_publicKeyCert
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-tai-ce-publicKeyCert                     OBJECT IDENTIFIER ::= {id-tai-ce  4}
 * ```
 *
 * @constant
 */
export const id_tai_ce_publicKeyCert: OBJECT_IDENTIFIER = new _OID(
    [4],
    id_tai_ce
);
/* END_OF_SYMBOL_DEFINITION id_tai_ce_publicKeyCert */

/* eslint-enable */

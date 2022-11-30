/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_mt } from '../IN-CS3-object-identifiers/id-mt.va';
export { id_mt } from '../IN-CS3-object-identifiers/id-mt.va';

/* START_OF_SYMBOL_DEFINITION id_mt_verifyCredentials */
/**
 * @summary id_mt_verifyCredentials
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-mt-verifyCredentials OBJECT IDENTIFIER ::= {id-mt verifyCredentials(1)}
 * ```
 *
 * @constant
 */
export const id_mt_verifyCredentials: OBJECT_IDENTIFIER = new _OID(
    [/* verifyCredentials */ 1],
    id_mt
);
/* END_OF_SYMBOL_DEFINITION id_mt_verifyCredentials */

/* eslint-enable */

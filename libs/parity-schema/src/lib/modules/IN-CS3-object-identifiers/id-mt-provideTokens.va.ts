/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_mt } from '../IN-CS3-object-identifiers/id-mt.va';
export { id_mt } from '../IN-CS3-object-identifiers/id-mt.va';

/* START_OF_SYMBOL_DEFINITION id_mt_provideTokens */
/**
 * @summary id_mt_provideTokens
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-mt-provideTokens OBJECT IDENTIFIER ::= {id-mt provideTokens(3)}
 * ```
 *
 * @constant
 */
export const id_mt_provideTokens: OBJECT_IDENTIFIER = new _OID(
    [/* provideTokens */ 3],
    id_mt
);
/* END_OF_SYMBOL_DEFINITION id_mt_provideTokens */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_bindLevelIfOK */
/**
 * @summary id_at_bindLevelIfOK
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-bindLevelIfOK OBJECT IDENTIFIER ::= {id-at bindLevelIfOK(4)}
 * ```
 *
 * @constant
 */
export const id_at_bindLevelIfOK: OBJECT_IDENTIFIER = new _OID(
    [/* bindLevelIfOK */ 4],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_bindLevelIfOK */

/* eslint-enable */

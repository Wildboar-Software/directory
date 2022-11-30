/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION knowledgeMatchingRule */
/**
 * @summary knowledgeMatchingRule
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * knowledgeMatchingRule                    ID ::= {ds 14}
 * ```
 *
 * @constant
 */
export const knowledgeMatchingRule: ID = new _OID([14], ds);
/* END_OF_SYMBOL_DEFINITION knowledgeMatchingRule */

/* eslint-enable */

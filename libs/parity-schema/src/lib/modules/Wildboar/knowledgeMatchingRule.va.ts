/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

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
export const knowledgeMatchingRule: ID = _OID.fromParts([14], ds);
/* END_OF_SYMBOL_DEFINITION knowledgeMatchingRule */

/* eslint-enable */

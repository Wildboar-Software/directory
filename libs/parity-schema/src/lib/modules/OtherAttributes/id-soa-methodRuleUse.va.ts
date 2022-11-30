/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_soa } from '../OtherAttributes/id-soa.va';
export { id_soa } from '../OtherAttributes/id-soa.va';

/* START_OF_SYMBOL_DEFINITION id_soa_methodRuleUse */
/**
 * @summary id_soa_methodRuleUse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-soa-methodRuleUse            OBJECT IDENTIFIER ::= { id-soa methodRuleUse(1) }
 * ```
 *
 * @constant
 */
export const id_soa_methodRuleUse: OBJECT_IDENTIFIER = new _OID(
    [/* methodRuleUse */ 1],
    id_soa
);
/* END_OF_SYMBOL_DEFINITION id_soa_methodRuleUse */

/* eslint-enable */

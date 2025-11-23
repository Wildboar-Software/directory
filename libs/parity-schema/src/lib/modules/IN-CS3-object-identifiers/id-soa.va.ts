/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_soa */
/**
 * @summary id_soa
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-soa OBJECT IDENTIFIER ::= {id-cs3 soa(21)}
 * ```
 *
 * @constant
 */
export const id_soa: OBJECT_IDENTIFIER = _OID.fromParts([/* soa */ 21], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_soa */

/* eslint-enable */

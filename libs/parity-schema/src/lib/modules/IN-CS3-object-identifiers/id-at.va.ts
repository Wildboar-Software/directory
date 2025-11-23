/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_at */
/**
 * @summary id_at
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at OBJECT IDENTIFIER ::= {id-cs3 at(4)}
 * ```
 *
 * @constant
 */
export const id_at: OBJECT_IDENTIFIER = _OID.fromParts([/* at */ 4], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_at */

/* eslint-enable */

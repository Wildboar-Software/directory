/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_avc */
/**
 * @summary id_avc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-avc OBJECT IDENTIFIER ::= {id-cs3 avc(29)}
 * ```
 *
 * @constant
 */
export const id_avc: OBJECT_IDENTIFIER = _OID.fromParts([/* avc */ 29], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_avc */

/* eslint-enable */

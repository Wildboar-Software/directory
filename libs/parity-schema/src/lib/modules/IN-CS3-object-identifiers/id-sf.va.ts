/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';
export { id_cs3 } from '../IN-CS3-object-identifiers/id-cs3.va';

/* START_OF_SYMBOL_DEFINITION id_sf */
/**
 * @summary id_sf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-sf OBJECT IDENTIFIER ::= {id-cs3 sf(11)}
 * ```
 *
 * @constant
 */
export const id_sf: OBJECT_IDENTIFIER = _OID.fromParts([/* sf */ 11], id_cs3);
/* END_OF_SYMBOL_DEFINITION id_sf */

/* eslint-enable */

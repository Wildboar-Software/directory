/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_as } from '../IN-CS3-object-identifiers/id-as.va';
export { id_as } from '../IN-CS3-object-identifiers/id-as.va';

/* START_OF_SYMBOL_DEFINITION id_as_indirectorySystemAS */
/**
 * @summary id_as_indirectorySystemAS
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-as-indirectorySystemAS OBJECT IDENTIFIER ::= {id-as indirectorySystemAS(16)}
 * ```
 *
 * @constant
 */
export const id_as_indirectorySystemAS: OBJECT_IDENTIFIER = new _OID(
    [/* indirectorySystemAS */ 16],
    id_as
);
/* END_OF_SYMBOL_DEFINITION id_as_indirectorySystemAS */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_as } from '../IN-CS3-object-identifiers/id-as.va';
export { id_as } from '../IN-CS3-object-identifiers/id-as.va';

/* START_OF_SYMBOL_DEFINITION id_as_indirectoryBindingAS */
/**
 * @summary id_as_indirectoryBindingAS
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-as-indirectoryBindingAS OBJECT IDENTIFIER ::= {id-as indirectoryBindingAS(2)}
 * ```
 *
 * @constant
 */
export const id_as_indirectoryBindingAS: OBJECT_IDENTIFIER = new _OID(
    [/* indirectoryBindingAS */ 2],
    id_as
);
/* END_OF_SYMBOL_DEFINITION id_as_indirectoryBindingAS */

/* eslint-enable */

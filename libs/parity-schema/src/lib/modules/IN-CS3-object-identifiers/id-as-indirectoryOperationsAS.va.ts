/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_as } from '../IN-CS3-object-identifiers/id-as.va';
export { id_as } from '../IN-CS3-object-identifiers/id-as.va';

/* START_OF_SYMBOL_DEFINITION id_as_indirectoryOperationsAS */
/**
 * @summary id_as_indirectoryOperationsAS
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-as-indirectoryOperationsAS OBJECT IDENTIFIER ::= {id-as indirectoryOperationsAS(1)}
 * ```
 *
 * @constant
 */
export const id_as_indirectoryOperationsAS: OBJECT_IDENTIFIER = new _OID(
    [/* indirectoryOperationsAS */ 1],
    id_as
);
/* END_OF_SYMBOL_DEFINITION id_as_indirectoryOperationsAS */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';
export { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';

/* START_OF_SYMBOL_DEFINITION id_aca_entryACI */
/**
 * @summary id_aca_entryACI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aca-entryACI OBJECT IDENTIFIER ::= {id-aca entryACI(5)}
 * ```
 *
 * @constant
 */
export const id_aca_entryACI: OBJECT_IDENTIFIER = new _OID(
    [/* entryACI */ 5],
    id_aca
);
/* END_OF_SYMBOL_DEFINITION id_aca_entryACI */

/* eslint-enable */

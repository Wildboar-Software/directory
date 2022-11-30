/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';
export { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';

/* START_OF_SYMBOL_DEFINITION id_aca_prescriptiveACI */
/**
 * @summary id_aca_prescriptiveACI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aca-prescriptiveACI OBJECT IDENTIFIER ::= {id-aca prescriptiveACI(4)}
 * ```
 *
 * @constant
 */
export const id_aca_prescriptiveACI: OBJECT_IDENTIFIER = new _OID(
    [/* prescriptiveACI */ 4],
    id_aca
);
/* END_OF_SYMBOL_DEFINITION id_aca_prescriptiveACI */

/* eslint-enable */

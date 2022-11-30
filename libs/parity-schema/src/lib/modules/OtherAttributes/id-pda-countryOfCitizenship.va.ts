/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_pda } from '../OtherAttributes/id-pda.va';
export { id_pda } from '../OtherAttributes/id-pda.va';

/* START_OF_SYMBOL_DEFINITION id_pda_countryOfCitizenship */
/**
 * @summary id_pda_countryOfCitizenship
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pda-countryOfCitizenship     OBJECT IDENTIFIER ::= { id-pda 4 }
 * ```
 *
 * @constant
 */
export const id_pda_countryOfCitizenship: OBJECT_IDENTIFIER = new _OID(
    [4],
    id_pda
);
/* END_OF_SYMBOL_DEFINITION id_pda_countryOfCitizenship */

/* eslint-enable */

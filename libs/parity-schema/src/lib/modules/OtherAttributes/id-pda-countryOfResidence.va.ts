/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_pda } from '../OtherAttributes/id-pda.va';
export { id_pda } from '../OtherAttributes/id-pda.va';

/* START_OF_SYMBOL_DEFINITION id_pda_countryOfResidence */
/**
 * @summary id_pda_countryOfResidence
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pda-countryOfResidence       OBJECT IDENTIFIER ::= { id-pda 5 }
 * ```
 *
 * @constant
 */
export const id_pda_countryOfResidence: OBJECT_IDENTIFIER = new _OID(
    [5],
    id_pda
);
/* END_OF_SYMBOL_DEFINITION id_pda_countryOfResidence */

/* eslint-enable */

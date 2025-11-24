/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_ao } from '../UPT-DataModel/id-ao.va';

/* START_OF_SYMBOL_DEFINITION id_ao_supplementaryService */
/**
 * @summary id_ao_supplementaryService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-ao-supplementaryService OBJECT IDENTIFIER ::= {id-ao 1}
 * ```
 *
 * @constant
 */
export const id_ao_supplementaryService: OBJECT_IDENTIFIER = _OID.fromParts(
    [1],
    id_ao
);
/* END_OF_SYMBOL_DEFINITION id_ao_supplementaryService */

/* eslint-enable */

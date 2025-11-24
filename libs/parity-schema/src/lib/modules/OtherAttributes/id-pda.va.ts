/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_pkix } from '../OtherAttributes/id-pkix.va';

/* START_OF_SYMBOL_DEFINITION id_pda */
/**
 * @summary id_pda
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pda                          OBJECT IDENTIFIER ::= { id-pkix 9 }
 * ```
 *
 * @constant
 */
export const id_pda: OBJECT_IDENTIFIER = _OID.fromParts([9], id_pkix);
/* END_OF_SYMBOL_DEFINITION id_pda */

/* eslint-enable */

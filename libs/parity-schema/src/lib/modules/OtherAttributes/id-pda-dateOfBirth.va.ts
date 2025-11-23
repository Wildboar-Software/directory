/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_pda } from '../OtherAttributes/id-pda.va';
export { id_pda } from '../OtherAttributes/id-pda.va';

/* START_OF_SYMBOL_DEFINITION id_pda_dateOfBirth */
/**
 * @summary id_pda_dateOfBirth
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pda-dateOfBirth              OBJECT IDENTIFIER ::= { id-pda 1 }
 * ```
 *
 * @constant
 */
export const id_pda_dateOfBirth: OBJECT_IDENTIFIER = _OID.fromParts([1], id_pda);
/* END_OF_SYMBOL_DEFINITION id_pda_dateOfBirth */

/* eslint-enable */

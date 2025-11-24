/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_at } from '../Wildboar/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_secretKey */
/**
 * @summary id_at_secretKey
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-secretKey                 OBJECT IDENTIFIER ::= { id-at secretKey(2) }
 * ```
 *
 * @constant
 */
export const id_at_secretKey: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* secretKey */ 2],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_secretKey */

/* eslint-enable */

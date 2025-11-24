/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_at } from '../Wildboar/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_identifierList */
/**
 * @summary id_at_identifierList
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-identifierList            OBJECT IDENTIFIER ::= { id-at identifierList(3) }
 * ```
 *
 * @constant
 */
export const id_at_identifierList: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* identifierList */ 3],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_identifierList */

/* eslint-enable */

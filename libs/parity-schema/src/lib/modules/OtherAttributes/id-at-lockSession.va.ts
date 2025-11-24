/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_at } from '../Wildboar/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_lockSession */
/**
 * @summary id_at_lockSession
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-lockSession               OBJECT IDENTIFIER ::= { id-at lockSession(5) }
 * ```
 *
 * @constant
 */
export const id_at_lockSession: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* lockSession */ 5],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_lockSession */

/* eslint-enable */

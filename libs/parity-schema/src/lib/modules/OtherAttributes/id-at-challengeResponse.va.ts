/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../Wildboar/id-at.va';
export { id_at } from '../Wildboar/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_challengeResponse */
/**
 * @summary id_at_challengeResponse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-challengeResponse         OBJECT IDENTIFIER ::= { id-at challengeResponse(12) }
 * ```
 *
 * @constant
 */
export const id_at_challengeResponse: OBJECT_IDENTIFIER = new _OID(
    [/* challengeResponse */ 12],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_challengeResponse */

/* eslint-enable */

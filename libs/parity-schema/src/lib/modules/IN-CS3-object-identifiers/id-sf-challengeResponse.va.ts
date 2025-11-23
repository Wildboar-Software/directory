/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_sf } from '../IN-CS3-object-identifiers/id-sf.va';
export { id_sf } from '../IN-CS3-object-identifiers/id-sf.va';

/* START_OF_SYMBOL_DEFINITION id_sf_challengeResponse */
/**
 * @summary id_sf_challengeResponse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-sf-challengeResponse OBJECT IDENTIFIER ::= {id-sf challengeResponse(2)}
 * ```
 *
 * @constant
 */
export const id_sf_challengeResponse: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* challengeResponse */ 2],
    id_sf
);
/* END_OF_SYMBOL_DEFINITION id_sf_challengeResponse */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_tokenization_manifest } from '../OtherAttributes/id-tokenization-manifest.va';
export { id_tokenization_manifest } from '../OtherAttributes/id-tokenization-manifest.va';

/* START_OF_SYMBOL_DEFINITION id_tokenizedParts */
/**
 * @summary id_tokenizedParts
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-tokenizedParts               OBJECT IDENTIFIER ::= { id-tokenization-manifest tokenizedParts(0) }
 * ```
 *
 * @constant
 */
export const id_tokenizedParts: OBJECT_IDENTIFIER = new _OID(
    [/* tokenizedParts */ 0],
    id_tokenization_manifest
);
/* END_OF_SYMBOL_DEFINITION id_tokenizedParts */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_tokenization_manifest } from '../OtherAttributes/id-tokenization-manifest.va';

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
export const id_tokenizedParts: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* tokenizedParts */ 0],
    id_tokenization_manifest
);
/* END_OF_SYMBOL_DEFINITION id_tokenizedParts */

/* eslint-enable */

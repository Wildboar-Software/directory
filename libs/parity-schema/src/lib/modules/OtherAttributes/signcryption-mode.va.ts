/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { signcryption } from '../OtherAttributes/signcryption.va';
export { signcryption } from '../OtherAttributes/signcryption.va';

/* START_OF_SYMBOL_DEFINITION signcryption_mode */
/**
 * @summary signcryption_mode
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * signcryption-mode       OBJECT IDENTIFIER ::= { signcryption modes(1) }
 * ```
 *
 * @constant
 */
export const signcryption_mode: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* modes */ 1],
    signcryption
);
/* END_OF_SYMBOL_DEFINITION signcryption_mode */

/* eslint-enable */

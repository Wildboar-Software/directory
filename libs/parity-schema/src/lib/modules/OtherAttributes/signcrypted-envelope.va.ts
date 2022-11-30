/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { signcryption_mode } from '../OtherAttributes/signcryption-mode.va';
export { signcryption_mode } from '../OtherAttributes/signcryption-mode.va';

/* START_OF_SYMBOL_DEFINITION signcrypted_envelope */
/**
 * @summary signcrypted_envelope
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * signcrypted-envelope    OBJECT IDENTIFIER ::= { signcryption-mode enveloped(4) }
 * ```
 *
 * @constant
 */
export const signcrypted_envelope: OBJECT_IDENTIFIER = new _OID(
    [/* enveloped */ 4],
    signcryption_mode
);
/* END_OF_SYMBOL_DEFINITION signcrypted_envelope */

/* eslint-enable */

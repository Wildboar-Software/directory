/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_pkcs_9 } from '../OtherAttributes/id-pkcs-9.va';
export { id_pkcs_9 } from '../OtherAttributes/id-pkcs-9.va';

/* START_OF_SYMBOL_DEFINITION id_aa */
/**
 * @summary id_aa
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aa                           OBJECT IDENTIFIER ::= { id-pkcs-9 smime(16) attributes(2) }
 * ```
 *
 * @constant
 */
export const id_aa: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* smime */ 16, /* attributes */ 2],
    id_pkcs_9
);
/* END_OF_SYMBOL_DEFINITION id_aa */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_pbact } from '../OtherAttributes/id-pbact.va';

/* START_OF_SYMBOL_DEFINITION id_pbactPrivAttr */
/**
 * @summary id_pbactPrivAttr
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pbactPrivAttr                OBJECT IDENTIFIER ::= { id-pbact prAttr(2) }
 * ```
 *
 * @constant
 */
export const id_pbactPrivAttr: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* prAttr */ 2],
    id_pbact
);
/* END_OF_SYMBOL_DEFINITION id_pbactPrivAttr */

/* eslint-enable */

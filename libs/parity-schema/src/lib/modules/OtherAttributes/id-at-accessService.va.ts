/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_pbactPrivAttr } from '../OtherAttributes/id-pbactPrivAttr.va';
export { id_pbactPrivAttr } from '../OtherAttributes/id-pbactPrivAttr.va';

/* START_OF_SYMBOL_DEFINITION id_at_accessService */
/**
 * @summary id_at_accessService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-accessService             OBJECT IDENTIFIER ::= { id-pbactPrivAttr 1 }
 * ```
 *
 * @constant
 */
export const id_at_accessService: OBJECT_IDENTIFIER = new _OID(
    [1],
    id_pbactPrivAttr
);
/* END_OF_SYMBOL_DEFINITION id_at_accessService */

/* eslint-enable */

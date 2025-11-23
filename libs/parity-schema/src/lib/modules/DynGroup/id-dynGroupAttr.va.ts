/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_dynGroupBase } from '../DynGroup/id-dynGroupBase.va';
export { id_dynGroupBase } from '../DynGroup/id-dynGroupBase.va';

/* START_OF_SYMBOL_DEFINITION id_dynGroupAttr */
/**
 * @summary id_dynGroupAttr
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-dynGroupAttr     OBJECT IDENTIFIER ::= { id-dynGroupBase 1 }
 * ```
 *
 * @constant
 */
export const id_dynGroupAttr: OBJECT_IDENTIFIER = _OID.fromParts(
    [1],
    id_dynGroupBase
);
/* END_OF_SYMBOL_DEFINITION id_dynGroupAttr */

/* eslint-enable */

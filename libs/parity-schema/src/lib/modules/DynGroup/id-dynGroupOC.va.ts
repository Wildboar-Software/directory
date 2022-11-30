/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_dynGroupBase } from '../DynGroup/id-dynGroupBase.va';
export { id_dynGroupBase } from '../DynGroup/id-dynGroupBase.va';

/* START_OF_SYMBOL_DEFINITION id_dynGroupOC */
/**
 * @summary id_dynGroupOC
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-dynGroupOC       OBJECT IDENTIFIER ::= { id-dynGroupBase 2 }
 * ```
 *
 * @constant
 */
export const id_dynGroupOC: OBJECT_IDENTIFIER = new _OID([2], id_dynGroupBase);
/* END_OF_SYMBOL_DEFINITION id_dynGroupOC */

/* eslint-enable */

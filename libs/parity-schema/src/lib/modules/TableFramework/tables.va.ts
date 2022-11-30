/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { mhs_ds } from '../TableFramework/mhs-ds.va';
export { mhs_ds } from '../TableFramework/mhs-ds.va';

/* START_OF_SYMBOL_DEFINITION tables */
/**
 * @summary tables
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tables OBJECT IDENTIFIER ::= {mhs-ds 1}
 * ```
 *
 * @constant
 */
export const tables: OBJECT_IDENTIFIER = new _OID([1], mhs_ds);
/* END_OF_SYMBOL_DEFINITION tables */

/* eslint-enable */

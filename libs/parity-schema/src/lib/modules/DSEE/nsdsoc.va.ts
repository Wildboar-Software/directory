/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { netscapeDS } from '../DSEE/netscapeDS.va';
export { netscapeDS } from '../DSEE/netscapeDS.va';

/* START_OF_SYMBOL_DEFINITION nsdsoc */
/**
 * @summary nsdsoc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nsdsoc          OBJECT IDENTIFIER ::= { netscapeDS 2 }
 * ```
 *
 * @constant
 */
export const nsdsoc: OBJECT_IDENTIFIER = new _OID([2], netscapeDS);
/* END_OF_SYMBOL_DEFINITION nsdsoc */

/* eslint-enable */

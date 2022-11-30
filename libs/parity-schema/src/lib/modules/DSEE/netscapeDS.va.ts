/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { netscapeRoot } from '../DSEE/netscapeRoot.va';
export { netscapeRoot } from '../DSEE/netscapeRoot.va';

/* START_OF_SYMBOL_DEFINITION netscapeDS */
/**
 * @summary netscapeDS
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * netscapeDS      OBJECT IDENTIFIER ::= { netscapeRoot 3 }
 * ```
 *
 * @constant
 */
export const netscapeDS: OBJECT_IDENTIFIER = new _OID([3], netscapeRoot);
/* END_OF_SYMBOL_DEFINITION netscapeDS */

/* eslint-enable */

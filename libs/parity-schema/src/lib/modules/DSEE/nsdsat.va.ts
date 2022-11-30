/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { netscapeDS } from '../DSEE/netscapeDS.va';
export { netscapeDS } from '../DSEE/netscapeDS.va';

/* START_OF_SYMBOL_DEFINITION nsdsat */
/**
 * @summary nsdsat
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nsdsat          OBJECT IDENTIFIER ::= { netscapeDS 1 }
 * ```
 *
 * @constant
 */
export const nsdsat: OBJECT_IDENTIFIER = new _OID([1], netscapeDS);
/* END_OF_SYMBOL_DEFINITION nsdsat */

/* eslint-enable */

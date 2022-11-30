/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_wildboar } from '../Wildboar/id-wildboar.va';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION ds */
/**
 * @summary ds
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ds              ID ::= {id-wildboar ds(5)}
 * ```
 *
 * @constant
 */
export const ds: ID = new _OID([/* ds */ 5], id_wildboar);
/* END_OF_SYMBOL_DEFINITION ds */

/* eslint-enable */

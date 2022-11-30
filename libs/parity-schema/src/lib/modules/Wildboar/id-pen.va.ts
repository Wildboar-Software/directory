/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ID } from '../Wildboar/ID.ta';
import { internet } from '../Wildboar/internet.va';

/* START_OF_SYMBOL_DEFINITION id_pen */
/**
 * @summary id_pen
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-pen          ID ::= {internet private(4) enterprise(1)}
 * ```
 *
 * @constant
 */
export const id_pen: ID = new _OID(
    [/* private */ 4, /* enterprise */ 1],
    internet
);
/* END_OF_SYMBOL_DEFINITION id_pen */

/* eslint-enable */

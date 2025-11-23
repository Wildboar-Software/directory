/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION internet */
/**
 * @summary internet
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * internet        ID ::= {iso(1) identified-organization(3) dod(6) internet(1)}
 * ```
 *
 * @constant
 */
export const internet: ID = _OID.fromParts([
    /* iso */ 1, /* identified-organization */ 3, /* dod */ 6, /* internet */ 1,
]);
/* END_OF_SYMBOL_DEFINITION internet */

/* eslint-enable */

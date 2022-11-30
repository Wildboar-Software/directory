/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_sf } from '../IN-CS3-object-identifiers/id-sf.va';
export { id_sf } from '../IN-CS3-object-identifiers/id-sf.va';

/* START_OF_SYMBOL_DEFINITION id_sf_onAirSubscription */
/**
 * @summary id_sf_onAirSubscription
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-sf-onAirSubscription OBJECT IDENTIFIER ::= {id-sf onAirSubscription(3)}
 * ```
 *
 * @constant
 */
export const id_sf_onAirSubscription: OBJECT_IDENTIFIER = new _OID(
    [/* onAirSubscription */ 3],
    id_sf
);
/* END_OF_SYMBOL_DEFINITION id_sf_onAirSubscription */

/* eslint-enable */

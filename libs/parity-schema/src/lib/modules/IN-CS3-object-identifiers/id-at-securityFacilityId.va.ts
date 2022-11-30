/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_at } from '../IN-CS3-object-identifiers/id-at.va';
export { id_at } from '../IN-CS3-object-identifiers/id-at.va';

/* START_OF_SYMBOL_DEFINITION id_at_securityFacilityId */
/**
 * @summary id_at_securityFacilityId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-at-securityFacilityId OBJECT IDENTIFIER ::= {id-at securityFacilityId(1)}
 * ```
 *
 * @constant
 */
export const id_at_securityFacilityId: OBJECT_IDENTIFIER = new _OID(
    [/* securityFacilityId */ 1],
    id_at
);
/* END_OF_SYMBOL_DEFINITION id_at_securityFacilityId */

/* eslint-enable */

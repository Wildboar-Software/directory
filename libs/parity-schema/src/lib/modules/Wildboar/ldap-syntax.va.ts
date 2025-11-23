/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION ldap_syntax */
/**
 * @summary ldap_syntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ldap-syntax                              ID ::= {ds 389}
 * ```
 *
 * @constant
 */
export const ldap_syntax: ID = _OID.fromParts([389], ds);
/* END_OF_SYMBOL_DEFINITION ldap_syntax */

/* eslint-enable */

/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { at } from '../TableFramework/at.va';
export { at } from '../TableFramework/at.va';

/* START_OF_SYMBOL_DEFINITION at_distinguished_name_table_key */
/**
 * @summary at_distinguished_name_table_key
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at-distinguished-name-table-key OBJECT IDENTIFIER ::= {at 3}
 * ```
 *
 * @constant
 */
export const at_distinguished_name_table_key: OBJECT_IDENTIFIER = _OID.fromParts(
    [3],
    at
);
/* END_OF_SYMBOL_DEFINITION at_distinguished_name_table_key */

/* eslint-enable */

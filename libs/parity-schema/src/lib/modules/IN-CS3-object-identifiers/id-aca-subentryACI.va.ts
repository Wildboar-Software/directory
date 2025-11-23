/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';
export { id_aca } from '../IN-CS3-object-identifiers/id-aca.va';

/* START_OF_SYMBOL_DEFINITION id_aca_subentryACI */
/**
 * @summary id_aca_subentryACI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-aca-subentryACI OBJECT IDENTIFIER ::= {id-aca subentryACI(6)}
 * ```
 *
 * @constant
 */
export const id_aca_subentryACI: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* subentryACI */ 6],
    id_aca
);
/* END_OF_SYMBOL_DEFINITION id_aca_subentryACI */

/* eslint-enable */

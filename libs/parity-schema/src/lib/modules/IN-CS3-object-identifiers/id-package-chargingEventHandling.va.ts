/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';
export { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_chargingEventHandling */
/**
 * @summary id_package_chargingEventHandling
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-chargingEventHandling OBJECT IDENTIFIER ::= {id-package chargingEventHandling(23)}
 * ```
 *
 * @constant
 */
export const id_package_chargingEventHandling: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* chargingEventHandling */ 23],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_chargingEventHandling */

/* eslint-enable */

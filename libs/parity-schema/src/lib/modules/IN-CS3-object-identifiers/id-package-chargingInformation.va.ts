/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_chargingInformation */
/**
 * @summary id_package_chargingInformation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-chargingInformation OBJECT IDENTIFIER ::= {id-package chargingInformation(56)}
 * ```
 *
 * @constant
 */
export const id_package_chargingInformation: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* chargingInformation */ 56],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_chargingInformation */

/* eslint-enable */

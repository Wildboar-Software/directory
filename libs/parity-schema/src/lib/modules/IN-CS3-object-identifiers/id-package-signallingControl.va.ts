/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from '@wildboar/asn1';
import { id_package } from '../IN-CS3-object-identifiers/id-package.va';

/* START_OF_SYMBOL_DEFINITION id_package_signallingControl */
/**
 * @summary id_package_signallingControl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-package-signallingControl OBJECT IDENTIFIER ::= {id-package signallingControl(33)}
 * ```
 *
 * @constant
 */
export const id_package_signallingControl: OBJECT_IDENTIFIER = _OID.fromParts(
    [/* signallingControl */ 33],
    id_package
);
/* END_OF_SYMBOL_DEFINITION id_package_signallingControl */

/* eslint-enable */

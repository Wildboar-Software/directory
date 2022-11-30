/* eslint-disable */
import { ObjectIdentifier as _OID, OBJECT_IDENTIFIER } from 'asn1-ts';
import { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';
export { id_rosObject } from '../IN-CS3-object-identifiers/id-rosObject.va';

/* START_OF_SYMBOL_DEFINITION id_rosObject_scf */
/**
 * @summary id_rosObject_scf
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * id-rosObject-scf OBJECT IDENTIFIER ::= {id-rosObject scf(1)}
 * ```
 *
 * @constant
 */
export const id_rosObject_scf: OBJECT_IDENTIFIER = new _OID(
    [/* scf */ 1],
    id_rosObject
);
/* END_OF_SYMBOL_DEFINITION id_rosObject_scf */

/* eslint-enable */

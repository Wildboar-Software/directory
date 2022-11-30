/* eslint-disable */
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';
export { ds } from '../Wildboar/ds.va';
export { ID, _decode_ID, _encode_ID } from '../Wildboar/ID.ta';

/* START_OF_SYMBOL_DEFINITION cmsContentType */
/**
 * @summary cmsContentType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * cmsContentType                           ID ::= {ds 42}
 * ```
 *
 * @constant
 */
export const cmsContentType: ID = new _OID([42], ds);
/* END_OF_SYMBOL_DEFINITION cmsContentType */

/* eslint-enable */

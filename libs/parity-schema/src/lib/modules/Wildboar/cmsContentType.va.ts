/* eslint-disable */
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { ds } from '../Wildboar/ds.va';
import { ID } from '../Wildboar/ID.ta';

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
export const cmsContentType: ID = _OID.fromParts([42], ds);
/* END_OF_SYMBOL_DEFINITION cmsContentType */

/* eslint-enable */

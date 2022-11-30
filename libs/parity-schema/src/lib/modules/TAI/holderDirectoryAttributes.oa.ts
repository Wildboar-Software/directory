/* eslint-disable */
import { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
import {
    AttributesSyntax,
    _decode_AttributesSyntax,
    _encode_AttributesSyntax,
} from '../TAI/AttributesSyntax.ta';
import { id_tai_ce_holderDirectoryAttributes } from '../TAI/id-tai-ce-holderDirectoryAttributes.va';
export { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
export {
    AttributesSyntax,
    _decode_AttributesSyntax,
    _encode_AttributesSyntax,
} from '../TAI/AttributesSyntax.ta';
export { id_tai_ce_holderDirectoryAttributes } from '../TAI/id-tai-ce-holderDirectoryAttributes.va';

/* START_OF_SYMBOL_DEFINITION holderDirectoryAttributes */
/**
 * @summary holderDirectoryAttributes
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * holderDirectoryAttributes EXTENSION ::= {
 *   SYNTAX         AttributesSyntax
 *   IDENTIFIED BY  id-tai-ce-holderDirectoryAttributes
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<AttributesSyntax>}
 * @implements {EXTENSION<AttributesSyntax>}
 */
export const holderDirectoryAttributes: EXTENSION<AttributesSyntax> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_AttributesSyntax,
    },
    encoderFor: {
        '&ExtnType': _encode_AttributesSyntax,
    },
    '&id': id_tai_ce_holderDirectoryAttributes /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION holderDirectoryAttributes */

/* eslint-enable */

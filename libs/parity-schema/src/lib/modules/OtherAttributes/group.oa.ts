/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import {
    IetfAttrSyntax,
    _decode_IetfAttrSyntax,
    _encode_IetfAttrSyntax,
} from '../OtherImplicitlyTaggedTypes/IetfAttrSyntax.ta';
import { id_aca } from './id-aca.va';

export {
    IetfAttrSyntax,
    _decode_IetfAttrSyntax,
    _encode_IetfAttrSyntax,
} from '../OtherImplicitlyTaggedTypes/IetfAttrSyntax.ta';

/* START_OF_SYMBOL_DEFINITION group */
/**
 * @summary group
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * group ATTRIBUTE ::= {
 *     WITH SYNTAX     IetfAttrSyntax
 *     ID              id-aca-group }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IetfAttrSyntax>}
 * @implements {ATTRIBUTE<IetfAttrSyntax>}
 */
export const group: ATTRIBUTE<IetfAttrSyntax> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_IetfAttrSyntax,
    },
    encoderFor: {
        '&Type': _encode_IetfAttrSyntax,
    },
    '&id': _OID.fromParts(
        [4],
        id_aca
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION group */

/* eslint-enable */

/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import {
    SvceAuthInfo,
    _decode_SvceAuthInfo,
    _encode_SvceAuthInfo,
} from '../OtherImplicitlyTaggedTypes/SvceAuthInfo.ta';
import { id_aca } from './id-aca.va';

export {
    SvceAuthInfo,
    _decode_SvceAuthInfo,
    _encode_SvceAuthInfo,
} from '../OtherImplicitlyTaggedTypes/SvceAuthInfo.ta';

/* START_OF_SYMBOL_DEFINITION authenticationInfo */
/**
 * @summary authenticationInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * authenticationInfo ATTRIBUTE ::= {
 *     WITH SYNTAX     SvceAuthInfo
 *     ID              id-aca-authenticationInfo }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SvceAuthInfo>}
 * @implements {ATTRIBUTE<SvceAuthInfo>}
 */
export const authenticationInfo: ATTRIBUTE<SvceAuthInfo> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SvceAuthInfo,
    },
    encoderFor: {
        '&Type': _encode_SvceAuthInfo,
    },
    '&id': _OID.fromParts(
        [1],
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
/* END_OF_SYMBOL_DEFINITION authenticationInfo */

/* eslint-enable */

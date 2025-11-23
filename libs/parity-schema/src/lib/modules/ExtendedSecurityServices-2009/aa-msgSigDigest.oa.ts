/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_msgSigDigest } from '../ExtendedSecurityServices-2009/id-aa-msgSigDigest.va';
import {
    MsgSigDigest,
    _decode_MsgSigDigest,
    _encode_MsgSigDigest,
} from '../ExtendedSecurityServices-2009/MsgSigDigest.ta';

/* START_OF_SYMBOL_DEFINITION aa_msgSigDigest */
/**
 * @summary aa_msgSigDigest
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-msgSigDigest ATTRIBUTE ::= {
 *     WITH SYNTAX     MsgSigDigest
 *     ID              id-aa-msgSigDigest }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MsgSigDigest>}
 * @implements {ATTRIBUTE<MsgSigDigest>}
 */
export const aa_msgSigDigest: ATTRIBUTE<MsgSigDigest> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MsgSigDigest,
    },
    encoderFor: {
        '&Type': _encode_MsgSigDigest,
    },
    '&id': id_aa_msgSigDigest /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_msgSigDigest */

/* eslint-enable */

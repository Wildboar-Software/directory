/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { numericStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { storedPrefixMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    AddressString,
    _decode_AddressString,
    _encode_AddressString,
} from '../UPT-DataModel/AddressString.ta';
import { id_at_allowedRegistrationAddress } from '../UPT-DataModel/id-at-allowedRegistrationAddress.va';

/* START_OF_SYMBOL_DEFINITION allowedRegistrationAddress */
/**
 * @summary allowedRegistrationAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * allowedRegistrationAddress ATTRIBUTE ::= {
 *   WITH SYNTAX               AddressString {ub-international-isdn-number}
 *   EQUALITY MATCHING RULE    numericStringMatch
 *   SUBSTRINGS MATCHING RULE  storedPrefixMatch
 *   ID                        id-at-allowedRegistrationAddress
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AddressString>}
 * @implements {ATTRIBUTE<AddressString>}
 */
export const allowedRegistrationAddress: ATTRIBUTE<AddressString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AddressString,
    },
    encoderFor: {
        '&Type': _encode_AddressString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': storedPrefixMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_at_allowedRegistrationAddress /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION allowedRegistrationAddress */

/* eslint-enable */

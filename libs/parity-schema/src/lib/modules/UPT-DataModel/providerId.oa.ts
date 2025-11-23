/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
import { id_at_providerId } from '../UPT-DataModel/id-at-providerId.va';

/* START_OF_SYMBOL_DEFINITION providerId */
/**
 * @summary providerId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * providerId ATTRIBUTE ::= {
 *   WITH SYNTAX               AddressString {ub-providerId}
 *   EQUALITY MATCHING RULE    numericStringMatch
 *   SUBSTRINGS MATCHING RULE  storedPrefixMatch
 *   SINGLE VALUE              TRUE
 *   ID                        id-at-providerId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AddressString>}
 * @implements {ATTRIBUTE<AddressString>}
 */
export const providerId: ATTRIBUTE<AddressString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AddressString,
    },
    encoderFor: {
        '&Type': _encode_AddressString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': storedPrefixMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_providerId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION providerId */

/* eslint-enable */

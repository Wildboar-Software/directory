/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { numericStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringMatch.oa';
import {
    AddressString,
    _decode_AddressString,
    _encode_AddressString,
} from '../UPT-DataModel/AddressString.ta';
import { id_at_pui } from '../UPT-DataModel/id-at-pui.va';

/* START_OF_SYMBOL_DEFINITION pui */
/**
 * @summary pui
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pui ATTRIBUTE ::= {
 *   WITH SYNTAX             AddressString {ub-pui}
 *   EQUALITY MATCHING RULE  numericStringMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-pui
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AddressString>}
 * @implements {ATTRIBUTE<AddressString>}
 */
export const pui: ATTRIBUTE<AddressString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AddressString,
    },
    encoderFor: {
        '&Type': _encode_AddressString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_pui /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION pui */

/* eslint-enable */

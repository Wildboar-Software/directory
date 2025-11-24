/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { numericStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { storedPrefixMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_forwardedToNumber } from '../UPT-DataModel/id-at-forwardedToNumber.va';
import {
    IsdnAddress,
    _decode_IsdnAddress,
    _encode_IsdnAddress,
} from '../UPT-DataModel/IsdnAddress.ta';

/* START_OF_SYMBOL_DEFINITION forwardedToNumber */
/**
 * @summary forwardedToNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * forwardedToNumber ATTRIBUTE ::= {
 *   WITH SYNTAX               IsdnAddress
 *   EQUALITY MATCHING RULE    numericStringMatch
 *   SUBSTRINGS MATCHING RULE  storedPrefixMatch
 *   ID                        id-at-forwardedToNumber
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IsdnAddress>}
 * @implements {ATTRIBUTE<IsdnAddress>}
 */
export const forwardedToNumber: ATTRIBUTE<IsdnAddress> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_IsdnAddress,
    },
    encoderFor: {
        '&Type': _encode_IsdnAddress,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': storedPrefixMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_at_forwardedToNumber /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION forwardedToNumber */

/* eslint-enable */

/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { numericStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringMatch.oa';
import { storedPrefixMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/storedPrefixMatch.oa';
import { id_at_uptNumber } from '../UPT-DataModel/id-at-uptNumber.va';
import {
    IsdnAddress,
    _decode_IsdnAddress,
    _encode_IsdnAddress,
} from '../UPT-DataModel/IsdnAddress.ta';

/* START_OF_SYMBOL_DEFINITION uptNumber */
/**
 * @summary uptNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uptNumber ATTRIBUTE ::= {
 *   WITH SYNTAX               IsdnAddress
 *   EQUALITY MATCHING RULE    numericStringMatch
 *   SUBSTRINGS MATCHING RULE  storedPrefixMatch
 *   SINGLE VALUE              TRUE
 *   ID                        id-at-uptNumber
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IsdnAddress>}
 * @implements {ATTRIBUTE<IsdnAddress>}
 */
export const uptNumber: ATTRIBUTE<IsdnAddress> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_IsdnAddress,
    },
    encoderFor: {
        '&Type': _encode_IsdnAddress,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': storedPrefixMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_uptNumber /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION uptNumber */

/* eslint-enable */

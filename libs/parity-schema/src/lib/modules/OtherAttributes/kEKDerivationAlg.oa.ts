/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
import { id_aa_KEKDerivationAlg } from '../OtherAttributes/id-aa-KEKDerivationAlg.va';
import {
    KEKDerivationAlgorithm,
    _decode_KEKDerivationAlgorithm,
    _encode_KEKDerivationAlgorithm,
} from '../OtherAttributes/KEKDerivationAlgorithm.ta';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
export { id_aa_KEKDerivationAlg } from '../OtherAttributes/id-aa-KEKDerivationAlg.va';
export {
    KEKDerivationAlgorithm,
    _decode_KEKDerivationAlgorithm,
    _encode_KEKDerivationAlgorithm,
} from '../OtherAttributes/KEKDerivationAlgorithm.ta';

/* START_OF_SYMBOL_DEFINITION kEKDerivationAlg */
/**
 * @summary kEKDerivationAlg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * kEKDerivationAlg ATTRIBUTE ::= {
 *     WITH SYNTAX               KEKDerivationAlgorithm
 *     EQUALITY MATCHING RULE    integerMatch
 *     SINGLE VALUE              TRUE
 *     ID                        id-aa-KEKDerivationAlg }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<KEKDerivationAlgorithm>}
 * @implements {ATTRIBUTE<KEKDerivationAlgorithm>}
 */
export const kEKDerivationAlg: ATTRIBUTE<KEKDerivationAlgorithm> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_KEKDerivationAlgorithm,
    },
    encoderFor: {
        '&Type': _encode_KEKDerivationAlgorithm,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_aa_KEKDerivationAlg /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION kEKDerivationAlg */

/* eslint-enable */

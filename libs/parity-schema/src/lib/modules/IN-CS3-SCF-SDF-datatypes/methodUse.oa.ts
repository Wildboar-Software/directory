/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { objectIdentifierFirstComponentMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/objectIdentifierFirstComponentMatch.oa';
import { id_soa_methodRuleUse } from '../IN-CS3-object-identifiers/id-soa-methodRuleUse.va';
import {
    MethodUseDescription,
    _decode_MethodUseDescription,
    _encode_MethodUseDescription,
} from '../IN-CS3-SCF-SDF-datatypes/MethodUseDescription.ta';
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
export { objectIdentifierFirstComponentMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/objectIdentifierFirstComponentMatch.oa';
export { id_soa_methodRuleUse } from '../IN-CS3-object-identifiers/id-soa-methodRuleUse.va';
export {
    MethodUseDescription,
    _decode_MethodUseDescription,
    _encode_MethodUseDescription,
} from '../IN-CS3-SCF-SDF-datatypes/MethodUseDescription.ta';

/* START_OF_SYMBOL_DEFINITION methodUse */
/**
 * @summary methodUse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * methodUse ATTRIBUTE ::= {
 *   WITH SYNTAX             MethodUseDescription
 *   EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
 *   USAGE                   directoryOperation
 *   ID                      id-soa-methodRuleUse
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MethodUseDescription>}
 * @implements {ATTRIBUTE<MethodUseDescription>}
 */
export const methodUse: ATTRIBUTE<MethodUseDescription> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MethodUseDescription,
    },
    encoderFor: {
        '&Type': _encode_MethodUseDescription,
    },
    '&equality-match':
        objectIdentifierFirstComponentMatch /* OBJECT_FIELD_SETTING */,
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&id': id_soa_methodRuleUse /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION methodUse */

/* eslint-enable */

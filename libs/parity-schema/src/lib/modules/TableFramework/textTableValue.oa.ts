/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { at_text_table_value } from '../TableFramework/at-text-table-value.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
export { name } from '@wildboar/x500/SelectedAttributeTypes';
export { at_text_table_value } from '../TableFramework/at-text-table-value.va';

/* START_OF_SYMBOL_DEFINITION textTableValue */
/**
 * @summary textTableValue
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * textTableValue ATTRIBUTE ::= {
 *     SUBTYPE OF      name
 *     WITH SYNTAX     DirectoryString {ub-description}
 *     ID              at-text-table-value }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DirectoryString>}
 * @implements {ATTRIBUTE<DirectoryString>}
 */
export const textTableValue: ATTRIBUTE<DirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DirectoryString,
    },
    encoderFor: {
        '&Type': _encode_DirectoryString,
    },
    '&derivation': name /* OBJECT_FIELD_SETTING */,
    '&id': at_text_table_value /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION textTableValue */

/* eslint-enable */

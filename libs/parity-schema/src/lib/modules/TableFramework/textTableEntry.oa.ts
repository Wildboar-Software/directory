/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { oc_text_table_entry } from '../TableFramework/oc-text-table-entry.va';
import { tableEntry } from '../TableFramework/tableEntry.oa';
import { textTableKey } from '../TableFramework/textTableKey.oa';
import { textTableValue } from '../TableFramework/textTableValue.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { oc_text_table_entry } from '../TableFramework/oc-text-table-entry.va';
export { tableEntry } from '../TableFramework/tableEntry.oa';
export { textTableKey } from '../TableFramework/textTableKey.oa';
export { textTableValue } from '../TableFramework/textTableValue.oa';

/* START_OF_SYMBOL_DEFINITION textTableEntry */
/**
 * @summary textTableEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * textTableEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {tableEntry}
 *     MUST CONTAIN    {textTableKey}
 *     MAY CONTAIN     {textTableValue}
 *     ID              oc-text-table-entry }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const textTableEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [tableEntry] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [textTableKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [textTableValue] /* OBJECT_FIELD_SETTING */,
    '&id': oc_text_table_entry /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION textTableEntry */

/* eslint-enable */

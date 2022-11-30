/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { distinguishedNameTableKey } from '../TableFramework/distinguishedNameTableKey.oa';
import { oc_distinguished_name_table_entry } from '../TableFramework/oc-distinguished-name-table-entry.va';
import { tableEntry } from '../TableFramework/tableEntry.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { distinguishedNameTableKey } from '../TableFramework/distinguishedNameTableKey.oa';
export { oc_distinguished_name_table_entry } from '../TableFramework/oc-distinguished-name-table-entry.va';
export { tableEntry } from '../TableFramework/tableEntry.oa';

/* START_OF_SYMBOL_DEFINITION distinguishedNameTableEntry */
/**
 * @summary distinguishedNameTableEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * distinguishedNameTableEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {tableEntry}
 *     MUST CONTAIN    {distinguishedNameTableKey}
 *     ID              oc-distinguished-name-table-entry }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const distinguishedNameTableEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [tableEntry] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        distinguishedNameTableKey,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': oc_distinguished_name_table_entry /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION distinguishedNameTableEntry */

/* eslint-enable */

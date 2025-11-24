/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { oc_table_entry } from '../TableFramework/oc-table-entry.va';


/* START_OF_SYMBOL_DEFINITION tableEntry */
/**
 * @summary tableEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tableEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MAY CONTAIN     {description}
 *     ID              oc-table-entry }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const tableEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': oc_table_entry /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION tableEntry */

/* eslint-enable */

/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BOOLEAN } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_trader_at_so_colourCapable } from '../PrinterServiceOfferDefinitions/id-trader-at-so-colourCapable.va';


/* START_OF_SYMBOL_DEFINITION colourCapable */
/**
 * @summary colourCapable
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * colourCapable ATTRIBUTE ::= {
 *   WITH SYNTAX             BOOLEAN
 *   EQUALITY MATCHING RULE  booleanMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-trader-at-so-colourCapable
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export const colourCapable: ATTRIBUTE<BOOLEAN> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBoolean,
    },
    encoderFor: {
        '&Type': $._encodeBoolean,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_so_colourCapable /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION colourCapable */

/* eslint-enable */

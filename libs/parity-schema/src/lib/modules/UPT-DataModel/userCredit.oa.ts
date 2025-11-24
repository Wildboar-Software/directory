/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { INTEGER } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_userCredit } from '../UPT-DataModel/id-at-userCredit.va';


/* START_OF_SYMBOL_DEFINITION userCredit */
/**
 * @summary userCredit
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * userCredit ATTRIBUTE ::= {
 *   WITH SYNTAX             INTEGER(1..ub-maxUserCredit)
 *   ORDERING MATCHING RULE  integerOrderingMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-userCredit
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<INTEGER>}
 * @implements {ATTRIBUTE<INTEGER>}
 */
export const userCredit: ATTRIBUTE<INTEGER> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeInteger,
    },
    encoderFor: {
        '&Type': $._encodeInteger,
    },
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_userCredit /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION userCredit */

/* eslint-enable */

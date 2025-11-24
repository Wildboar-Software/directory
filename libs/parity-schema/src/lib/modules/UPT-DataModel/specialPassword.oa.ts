/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetStringMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_at_specialPassword } from '../UPT-DataModel/id-at-specialPassword.va';


/* START_OF_SYMBOL_DEFINITION specialPassword */
/**
 * @summary specialPassword
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * specialPassword ATTRIBUTE ::= {
 *   WITH SYNTAX             OCTET STRING(SIZE (0..ub-special-password))
 *   EQUALITY MATCHING RULE  octetStringMatch
 *   ID                      id-at-specialPassword
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const specialPassword: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&equality-match': octetStringMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_at_specialPassword /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION specialPassword */

/* eslint-enable */

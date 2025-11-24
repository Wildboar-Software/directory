/* eslint-disable */
import type { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { NULL } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_mr_presentMatch } from '../RFC3687ComponentMatching/id-mr-presentMatch.va';
import { null_ } from '../RFC3687ComponentMatching/null.oa';

/* START_OF_SYMBOL_DEFINITION presentMatch */
/**
 * @summary presentMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * presentMatch MATCHING-RULE ::= {
 *     SYNTAX                  NULL
 *     LDAP-SYNTAX             null.&id
 *     LDAP-NAME               {"presentMatch"}
 *     ID                      id-mr-presentMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<NULL>}
 * @implements {MATCHING_RULE<NULL>}
 */
export const presentMatch: MATCHING_RULE<NULL> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': $._decodeNull,
    },
    encoderFor: {
        '&AssertionType': $._encodeNull,
    },
    '&ldapSyntax': null_['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['presentMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_mr_presentMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION presentMatch */

/* eslint-enable */

/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import { id_mr_allComponentsMatch } from '../RFC3687ComponentMatching/id-mr-allComponentsMatch.va';
import { open } from '../RFC3687ComponentMatching/open.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { id_mr_allComponentsMatch } from '../RFC3687ComponentMatching/id-mr-allComponentsMatch.va';
export { open } from '../RFC3687ComponentMatching/open.oa';

/* START_OF_SYMBOL_DEFINITION allComponentsMatch */
/**
 * @summary allComponentsMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * allComponentsMatch MATCHING-RULE ::= {
 *     -- SYNTAX                  TYPE-IDENTIFIER.&Type
 *     LDAP-SYNTAX             open.&id
 *     LDAP-NAME               {"allComponentsMatch"}
 *     ID                      id-mr-allComponentsMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE}
 * @implements {MATCHING_RULE}
 */
export const allComponentsMatch: MATCHING_RULE = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': undefined,
    },
    encoderFor: {
        '&AssertionType': undefined,
    },
    '&ldapSyntax': open['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['allComponentsMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_mr_allComponentsMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION allComponentsMatch */

/* eslint-enable */

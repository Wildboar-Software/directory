/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import { componentFilter } from '../RFC3687ComponentMatching/componentFilter.oa';
import {
    ComponentFilter,
    _decode_ComponentFilter,
    _encode_ComponentFilter,
} from '../RFC3687ComponentMatching/ComponentFilter.ta';
import { id_mr_componentFilterMatch } from '../RFC3687ComponentMatching/id-mr-componentFilterMatch.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { componentFilter } from '../RFC3687ComponentMatching/componentFilter.oa';
export {
    ComponentFilter,
    _decode_ComponentFilter,
    _encode_ComponentFilter,
} from '../RFC3687ComponentMatching/ComponentFilter.ta';
export { id_mr_componentFilterMatch } from '../RFC3687ComponentMatching/id-mr-componentFilterMatch.va';

/* START_OF_SYMBOL_DEFINITION componentFilterMatch */
/**
 * @summary componentFilterMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * componentFilterMatch MATCHING-RULE ::= {
 *     SYNTAX                  ComponentFilter
 *     LDAP-SYNTAX             componentFilter.&id
 *     LDAP-NAME               {"componentFilterMatch"}
 *     ID                      id-mr-componentFilterMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<ComponentFilter>}
 * @implements {MATCHING_RULE<ComponentFilter>}
 */
export const componentFilterMatch: MATCHING_RULE<ComponentFilter> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_ComponentFilter,
    },
    encoderFor: {
        '&AssertionType': _encode_ComponentFilter,
    },
    '&ldapSyntax': componentFilter['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['componentFilterMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_mr_componentFilterMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION componentFilterMatch */

/* eslint-enable */

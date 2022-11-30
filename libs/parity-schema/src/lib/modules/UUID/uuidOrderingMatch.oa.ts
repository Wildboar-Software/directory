/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
import {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UUID.ta';
import { uuid } from '../UUID/uuid.oa';
import { id_uuidOrderingMatch } from './id-uuidOrderingMatch.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UUID.ta';
export { uuid } from '../UUID/uuid.oa';

/* START_OF_SYMBOL_DEFINITION uuidOrderingMatch */
/**
 * @summary uuidOrderingMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uuidOrderingMatch MATCHING-RULE ::= {
 *     SYNTAX                  UUID
 *     LDAP-SYNTAX             uuid.&id
 *     LDAP-NAME               {"uuidOrderingMatch"}
 *     ID                      id-uuidOrderingMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<UUID>}
 * @implements {MATCHING_RULE<UUID>}
 */
export const uuidOrderingMatch: MATCHING_RULE<UUID> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_UUID,
    },
    encoderFor: {
        '&AssertionType': _encode_UUID,
    },
    '&ldapSyntax': uuid['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uuidOrderingMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_uuidOrderingMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uuidOrderingMatch */

/* eslint-enable */

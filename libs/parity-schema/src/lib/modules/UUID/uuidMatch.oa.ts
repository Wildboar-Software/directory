/* eslint-disable */
import { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
import {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
import { uuid } from '../UUID/uuid.oa';
import { id_uuidMatch } from './id-uuidMatch.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export {
    UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
export { uuid } from '../UUID/uuid.oa';

/* START_OF_SYMBOL_DEFINITION uuidMatch */
/**
 * @summary uuidMatch
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uuidMatch MATCHING-RULE ::= {
 *     SYNTAX                  UUID
 *     LDAP-SYNTAX             uuid.&id
 *     LDAP-NAME               {"uuidMatch"}
 *     ID                      id-uuidMatch
 * }
 * ```
 *
 * @constant
 * @type {MATCHING_RULE<UUID>}
 * @implements {MATCHING_RULE<UUID>}
 */
export const uuidMatch: MATCHING_RULE<UUID> = {
    class: 'MATCHING-RULE',
    decoderFor: {
        '&AssertionType': _decode_UUID,
    },
    encoderFor: {
        '&AssertionType': _encode_UUID,
    },
    '&ldapSyntax': uuid['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uuidMatch'] /* OBJECT_FIELD_SETTING */,
    '&id': id_uuidMatch /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&AssertionType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uuidMatch */

/* eslint-enable */

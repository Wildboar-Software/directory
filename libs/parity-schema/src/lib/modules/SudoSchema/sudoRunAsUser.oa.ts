/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { caseExactIA5Match } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactIA5Match.oa';
import { ia5String } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa';
import { IA5String, ObjectIdentifier as _OID } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { id_aaron_spangler } from '../SudoSchema/id-aaron-spangler.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { caseExactIA5Match } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactIA5Match.oa';
export { ia5String } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa';
export { id_aaron_spangler } from '../SudoSchema/id-aaron-spangler.va';

/* START_OF_SYMBOL_DEFINITION sudoRunAsUser */
/**
 * @summary sudoRunAsUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sudoRunAsUser ATTRIBUTE ::= {
 *     WITH SYNTAX                 IA5String
 *     EQUALITY MATCHING RULE      caseExactIA5Match
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                   { "sudoRunAsUser" }
 *     LDAP-DESC                   "User(s) impersonated by sudo"
 *     ID                          { id-aaron-spangler 9 1 6 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<IA5String>}
 * @implements {ATTRIBUTE<IA5String>}
 */
export const sudoRunAsUser: ATTRIBUTE<IA5String> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeIA5String,
    },
    encoderFor: {
        '&Type': $._encodeIA5String,
    },
    '&equality-match': caseExactIA5Match /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sudoRunAsUser'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'User(s) impersonated by sudo' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [9, 1, 6],
        id_aaron_spangler
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION sudoRunAsUser */

/* eslint-enable */
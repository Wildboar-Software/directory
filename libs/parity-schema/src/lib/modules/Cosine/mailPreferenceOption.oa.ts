/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { integer } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa';
import { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import {
    MailPreferenceOptionSyntax,
    _decode_MailPreferenceOptionSyntax,
    _encode_MailPreferenceOptionSyntax,
} from '../Cosine/MailPreferenceOptionSyntax.ta';
import { pilotAttributeType } from '../Cosine/pilotAttributeType.va';
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
export {
    any_list_inclusion /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    MailPreferenceOptionSyntax,
    MailPreferenceOptionSyntax_any_list_inclusion /* IMPORTED_LONG_ENUMERATION_ITEM */,
    MailPreferenceOptionSyntax_no_list_inclusion /* IMPORTED_LONG_ENUMERATION_ITEM */,
    MailPreferenceOptionSyntax_professional_list_inclusion /* IMPORTED_LONG_ENUMERATION_ITEM */,
    no_list_inclusion /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    professional_list_inclusion /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_MailPreferenceOptionSyntax,
    _encode_MailPreferenceOptionSyntax,
    _enum_for_MailPreferenceOptionSyntax,
} from '../Cosine/MailPreferenceOptionSyntax.ta';
export { pilotAttributeType } from '../Cosine/pilotAttributeType.va';

/* START_OF_SYMBOL_DEFINITION mailPreferenceOption */
/**
 * @summary mailPreferenceOption
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mailPreferenceOption ATTRIBUTE ::= {
 *     WITH SYNTAX                 MailPreferenceOptionSyntax
 *     EQUALITY MATCHING RULE      integerMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                   { "mailPreferenceOption" }
 *     ID                          { pilotAttributeType 47 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MailPreferenceOptionSyntax>}
 * @implements {ATTRIBUTE<MailPreferenceOptionSyntax>}
 */
export const mailPreferenceOption: ATTRIBUTE<MailPreferenceOptionSyntax> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MailPreferenceOptionSyntax,
    },
    encoderFor: {
        '&Type': _encode_MailPreferenceOptionSyntax,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mailPreferenceOption'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [47],
        pilotAttributeType
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION mailPreferenceOption */

/* eslint-enable */

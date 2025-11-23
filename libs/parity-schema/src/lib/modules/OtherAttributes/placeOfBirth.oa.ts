/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { id_pda_placeOfBirth } from '../OtherAttributes/id-pda-placeOfBirth.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
export {
    DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
export { id_pda_placeOfBirth } from '../OtherAttributes/id-pda-placeOfBirth.va';

/* START_OF_SYMBOL_DEFINITION placeOfBirth */
/**
 * @summary placeOfBirth
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * placeOfBirth ATTRIBUTE ::= {
 *     WITH SYNTAX                        DirectoryString{128}
 *     EQUALITY MATCHING RULE            caseIgnoreMatch
 *     ORDERING MATCHING RULE            caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE        caseIgnoreSubstringsMatch
 *     -- Purposefully not single-valued so values with contexts can display different languages
 *     LDAP-SYNTAX                        directoryString.&id
 *     LDAP-NAME                        {"placeOfBirth"}
 *     LDAP-DESC                        "IETF RFC 3739: Place of birth of the subject"
 *     ID                                id-pda-placeOfBirth
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DirectoryString>}
 * @implements {ATTRIBUTE<DirectoryString>}
 */
export const placeOfBirth: ATTRIBUTE<DirectoryString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_DirectoryString,
    },
    encoderFor: {
        '&Type': _encode_DirectoryString,
    },
    '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match': caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['placeOfBirth'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'IETF RFC 3739: Place of birth of the subject' /* OBJECT_FIELD_SETTING */,
    '&id': id_pda_placeOfBirth /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION placeOfBirth */

/* eslint-enable */

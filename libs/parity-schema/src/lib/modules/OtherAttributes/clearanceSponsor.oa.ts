/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { id_clearanceSponsor } from '../OtherAttributes/id-clearanceSponsor.va';



/* START_OF_SYMBOL_DEFINITION clearanceSponsor */
/**
 * @summary clearanceSponsor
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * clearanceSponsor ATTRIBUTE ::= {
 *     WITH SYNTAX                        DirectoryString{ub-clearance-sponsor} ( WITH COMPONENTS { utf8String PRESENT } )
 *     EQUALITY MATCHING RULE            caseIgnoreMatch
 *     ORDERING MATCHING RULE            caseIgnoreOrderingMatch
 *     SUBSTRINGS MATCHING RULE        caseIgnoreSubstringsMatch
 *     LDAP-SYNTAX                        directoryString.&id
 *     LDAP-NAME                        {"clearanceSponsor"}
 *     LDAP-DESC                        "IETF RFC 5917: The sponsor of the clearance of the subject with which this attribute is associated"
 *     ID                                id-clearanceSponsor
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DirectoryString>}
 * @implements {ATTRIBUTE<DirectoryString>}
 */
export const clearanceSponsor: ATTRIBUTE<DirectoryString> = {
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
    '&ldapName': ['clearanceSponsor'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'IETF RFC 5917: The sponsor of the clearance of the subject with which this attribute is associated' /* OBJECT_FIELD_SETTING */,
    '&id': id_clearanceSponsor /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION clearanceSponsor */

/* eslint-enable */

/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { generalizedTime } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { GeneralizedTime } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_pda_dateOfBirth } from '../OtherAttributes/id-pda-dateOfBirth.va';


/* START_OF_SYMBOL_DEFINITION dateOfBirth */
/**
 * @summary dateOfBirth
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dateOfBirth ATTRIBUTE ::= {
 *     WITH SYNTAX                        GeneralizedTime
 *     EQUALITY MATCHING RULE            generalizedTimeMatch
 *     ORDERING MATCHING RULE            generalizedTimeOrderingMatch
 *     SINGLE VALUE                    TRUE
 *     LDAP-SYNTAX                        generalizedTime.&id
 *     LDAP-NAME                        {"dateOfBirth"}
 *     LDAP-DESC                        "IETF RFC 3739: Date of birth of the subject"
 *     ID                                id-pda-dateOfBirth
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<GeneralizedTime>}
 * @implements {ATTRIBUTE<GeneralizedTime>}
 */
export const dateOfBirth: ATTRIBUTE<GeneralizedTime> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeGeneralizedTime,
    },
    encoderFor: {
        '&Type': $._encodeGeneralizedTime,
    },
    '&equality-match': generalizedTimeMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': generalizedTimeOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': generalizedTime['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['dateOfBirth'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'IETF RFC 3739: Date of birth of the subject' /* OBJECT_FIELD_SETTING */,
    '&id': id_pda_dateOfBirth /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION dateOfBirth */

/* eslint-enable */

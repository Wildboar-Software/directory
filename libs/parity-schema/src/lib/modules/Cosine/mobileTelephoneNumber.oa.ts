/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { telephoneNr } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type TelephoneNumber,
    _decode_TelephoneNumber,
    _encode_TelephoneNumber,
} from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumberMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { telephoneNumberSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { pilotAttributeType } from '../Cosine/pilotAttributeType.va';



/* START_OF_SYMBOL_DEFINITION mobileTelephoneNumber */
/**
 * @summary mobileTelephoneNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mobileTelephoneNumber ATTRIBUTE ::= {
 *     WITH SYNTAX                 TelephoneNumber
 *     EQUALITY MATCHING RULE         telephoneNumberMatch
 *     SUBSTRINGS MATCHING RULE     telephoneNumberSubstringsMatch
 *     LDAP-SYNTAX                 telephoneNr.&id
 *     LDAP-NAME                     {"mobileTelephoneNumber", "mobile"}
 *     LDAP-DESC                    "RFC1274: mobile telephone number"
 *     ID { pilotAttributeType 41 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<TelephoneNumber>}
 * @implements {ATTRIBUTE<TelephoneNumber>}
 */
export const mobileTelephoneNumber: ATTRIBUTE<TelephoneNumber> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_TelephoneNumber,
    },
    encoderFor: {
        '&Type': _encode_TelephoneNumber,
    },
    '&equality-match': telephoneNumberMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        telephoneNumberSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': telephoneNr['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mobileTelephoneNumber', 'mobile'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: mobile telephone number' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [41],
        pilotAttributeType
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
/* END_OF_SYMBOL_DEFINITION mobileTelephoneNumber */

/* eslint-enable */

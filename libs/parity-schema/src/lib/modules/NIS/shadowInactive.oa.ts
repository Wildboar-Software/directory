/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { integer } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa';
import { integerMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerMatch.oa';
import { integerOrderingMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integerOrderingMatch.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_nis_at } from '../NIS/id-nis-at.va';
import { Uint32, _decode_Uint32, _encode_Uint32 } from '../NIS/Uint32.ta';

/* START_OF_SYMBOL_DEFINITION shadowInactive */
/**
 * @summary shadowInactive
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * shadowInactive ATTRIBUTE ::= {
 *     WITH SYNTAX                 Uint32
 *     EQUALITY MATCHING RULE         integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                     {"shadowInactive"}
 *     ID { id-nis-at 9 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Uint32>}
 * @implements {ATTRIBUTE<Uint32>}
 */
export const shadowInactive: ATTRIBUTE<Uint32> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Uint32,
    },
    encoderFor: {
        '&Type': _encode_Uint32,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['shadowInactive'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [9],
        id_nis_at
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
/* END_OF_SYMBOL_DEFINITION shadowInactive */

/* eslint-enable */

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
import {
    UnixEpoch,
    _decode_UnixEpoch,
    _encode_UnixEpoch,
} from '../NIS/UnixEpoch.ta';

/* START_OF_SYMBOL_DEFINITION shadowLastChange */
/**
 * @summary shadowLastChange
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * shadowLastChange ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnixEpoch
 *     EQUALITY MATCHING RULE         integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                     {"shadowLastChange"}
 *     ID { id-nis-at 5 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnixEpoch>}
 * @implements {ATTRIBUTE<UnixEpoch>}
 */
export const shadowLastChange: ATTRIBUTE<UnixEpoch> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_UnixEpoch,
    },
    encoderFor: {
        '&Type': _encode_UnixEpoch,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['shadowLastChange'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [5],
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
/* END_OF_SYMBOL_DEFINITION shadowLastChange */

/* eslint-enable */

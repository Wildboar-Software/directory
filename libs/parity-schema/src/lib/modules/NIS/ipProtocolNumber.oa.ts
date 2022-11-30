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
import { Uint8, _decode_Uint8, _encode_Uint8 } from '../NIS/Uint8.ta';

/* START_OF_SYMBOL_DEFINITION ipProtocolNumber */
/**
 * @summary ipProtocolNumber
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipProtocolNumber ATTRIBUTE ::= {
 *     WITH SYNTAX                 Uint8
 *     EQUALITY MATCHING RULE         integerMatch
 *     ORDERING MATCHING RULE      integerOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 integer.&id
 *     LDAP-NAME                     {"ipProtocolNumber"}
 *     ID { id-nis-at 17 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Uint8>}
 * @implements {ATTRIBUTE<Uint8>}
 */
export const ipProtocolNumber: ATTRIBUTE<Uint8> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Uint8,
    },
    encoderFor: {
        '&Type': _encode_Uint8,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': integerOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': integer['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipProtocolNumber'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [17],
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
/* END_OF_SYMBOL_DEFINITION ipProtocolNumber */

/* eslint-enable */

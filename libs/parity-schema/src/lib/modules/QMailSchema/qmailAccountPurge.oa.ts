/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { numericString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericString.oa';
import { numericStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringMatch.oa';
import { NumericString, ObjectIdentifier as _OID } from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import { id_at } from '../QMailSchema/id-at.va';
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
export { numericString } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericString.oa';
export { numericStringMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericStringMatch.oa';
export { id_at } from '../QMailSchema/id-at.va';

/* START_OF_SYMBOL_DEFINITION qmailAccountPurge */
/**
 * @summary qmailAccountPurge
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * qmailAccountPurge ATTRIBUTE ::= {
 *     WITH SYNTAX                 NumericString
 *     EQUALITY MATCHING RULE         numericStringMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 numericString.&id
 *     LDAP-NAME                     {"qmailAccountPurge"}
 *     LDAP-DESC                   "The earliest date when a mailMessageStore will be purged"
 *     ID                          { id-at 13 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NumericString>}
 * @implements {ATTRIBUTE<NumericString>}
 */
export const qmailAccountPurge: ATTRIBUTE<NumericString> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeNumericString,
    },
    encoderFor: {
        '&Type': $._encodeNumericString,
    },
    '&equality-match': numericStringMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': numericString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['qmailAccountPurge'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The earliest date when a mailMessageStore will be purged' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [13],
        id_at
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
/* END_OF_SYMBOL_DEFINITION qmailAccountPurge */

/* eslint-enable */

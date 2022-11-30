/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import { caseIgnoreListMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreListMatch.oa';
import { caseIgnoreListSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreListSubstringsMatch.oa';
import { postalAddr } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddr.oa';
import {
    PostalAddress,
    _decode_PostalAddress,
    _encode_PostalAddress,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PostalAddress.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
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
export { caseIgnoreListMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreListMatch.oa';
export { caseIgnoreListSubstringsMatch } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreListSubstringsMatch.oa';
export { postalAddr } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddr.oa';
export {
    PostalAddress,
    _decode_PostalAddress,
    _encode_PostalAddress,
} from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PostalAddress.ta';
export { pilotAttributeType } from '../Cosine/pilotAttributeType.va';

/* START_OF_SYMBOL_DEFINITION homePostalAddress */
/**
 * @summary homePostalAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * homePostalAddress ATTRIBUTE ::= {
 *     WITH SYNTAX                 PostalAddress
 *     EQUALITY MATCHING RULE         caseIgnoreListMatch
 *     SUBSTRINGS MATCHING RULE     caseIgnoreListSubstringsMatch
 *     LDAP-SYNTAX                 postalAddr.&id
 *     LDAP-NAME                     {"homePostalAddress"}
 *     LDAP-DESC                    "RFC1274: home postal address"
 *     ID { pilotAttributeType 39 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PostalAddress>}
 * @implements {ATTRIBUTE<PostalAddress>}
 */
export const homePostalAddress: ATTRIBUTE<PostalAddress> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_PostalAddress,
    },
    encoderFor: {
        '&Type': _encode_PostalAddress,
    },
    '&equality-match': caseIgnoreListMatch /* OBJECT_FIELD_SETTING */,
    '&substrings-match':
        caseIgnoreListSubstringsMatch /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': postalAddr['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['homePostalAddress'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: home postal address' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [39],
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
/* END_OF_SYMBOL_DEFINITION homePostalAddress */

/* eslint-enable */

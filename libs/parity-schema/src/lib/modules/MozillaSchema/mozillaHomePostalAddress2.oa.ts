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

/* START_OF_SYMBOL_DEFINITION mozillaHomePostalAddress2 */
/**
 * @summary mozillaHomePostalAddress2
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mozillaHomePostalAddress2 ATTRIBUTE ::= {
 *     WITH SYNTAX                 PostalAddress
 *     EQUALITY MATCHING RULE      caseIgnoreListMatch
 *     SUBSTRINGS MATCHING RULE    caseIgnoreListSubstringsMatch
 *     USAGE                       userApplications
 *     LDAP-SYNTAX                 postalAddr.&id
 *     LDAP-NAME                   {"mozillaHomePostalAddress2"}
 *     ID                          { 1 3 6 1 4 1 13769 2 1 6 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<PostalAddress>}
 * @implements {ATTRIBUTE<PostalAddress>}
 */
export const mozillaHomePostalAddress2: ATTRIBUTE<PostalAddress> = {
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
    '&usage': userApplications /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': postalAddr['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mozillaHomePostalAddress2'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 13769, 2, 1, 6,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mozillaHomePostalAddress2 */

/* eslint-enable */

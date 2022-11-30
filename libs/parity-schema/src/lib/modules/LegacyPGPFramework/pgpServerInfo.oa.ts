/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { mcafee } from '../LegacyPGPFramework/mcafee.va';
import { pgpBaseKeySpaceDN } from '../LegacyPGPFramework/pgpBaseKeySpaceDN.oa';
import { pgpSoftware } from '../LegacyPGPFramework/pgpSoftware.oa';
import { pgpVersion } from '../LegacyPGPFramework/pgpVersion.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { mcafee } from '../LegacyPGPFramework/mcafee.va';
export { pgpBaseKeySpaceDN } from '../LegacyPGPFramework/pgpBaseKeySpaceDN.oa';
export { pgpSoftware } from '../LegacyPGPFramework/pgpSoftware.oa';
export { pgpVersion } from '../LegacyPGPFramework/pgpVersion.oa';

/* START_OF_SYMBOL_DEFINITION pgpServerInfo */
/**
 * @summary pgpServerInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pgpServerInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName | pgpBaseKeySpaceDN }
 *     MAY CONTAIN         { pgpSoftware | pgpVersion }
 *     LDAP-NAME           {"pgpServerInfo"}
 *     LDAP-DESC           {"An OpenPGP public keyblock store"}
 *     ID { mcafee 8 2 23 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pgpServerInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        pgpBaseKeySpaceDN,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [pgpSoftware, pgpVersion] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pgpServerInfo'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An OpenPGP public keyblock store' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [8, 2, 23],
        mcafee
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pgpServerInfo */

/* eslint-enable */

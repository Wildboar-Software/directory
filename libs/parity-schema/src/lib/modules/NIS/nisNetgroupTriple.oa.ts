/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_at } from '../NIS/id-nis-at.va';
import { nisNetgroupTripleSyntax } from '../NIS/nisNetgroupTripleSyntax.oa';
import {
    NISNetgroupTripleSyntax,
    _decode_NISNetgroupTripleSyntax,
    _encode_NISNetgroupTripleSyntax,
} from '../NIS/NISNetgroupTripleSyntax.ta';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { id_nis_at } from '../NIS/id-nis-at.va';
export { nisNetgroupTripleSyntax } from '../NIS/nisNetgroupTripleSyntax.oa';
export {
    NISNetgroupTripleSyntax,
    _decode_NISNetgroupTripleSyntax,
    _encode_NISNetgroupTripleSyntax,
} from '../NIS/NISNetgroupTripleSyntax.ta';

/* START_OF_SYMBOL_DEFINITION nisNetgroupTriple */
/**
 * @summary nisNetgroupTriple
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisNetgroupTriple ATTRIBUTE ::= {
 *     WITH SYNTAX                 NISNetgroupTripleSyntax
 *     LDAP-SYNTAX                 nisNetgroupTripleSyntax.&id
 *     LDAP-NAME                     {"nisNetgroupTriple"}
 *     LDAP-DESC                   "Netgroup triple"
 *     ID { id-nis-at 14 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<NISNetgroupTripleSyntax>}
 * @implements {ATTRIBUTE<NISNetgroupTripleSyntax>}
 */
export const nisNetgroupTriple: ATTRIBUTE<NISNetgroupTripleSyntax> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_NISNetgroupTripleSyntax,
    },
    encoderFor: {
        '&Type': _encode_NISNetgroupTripleSyntax,
    },
    '&ldapSyntax': nisNetgroupTripleSyntax['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisNetgroupTriple'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Netgroup triple' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [14],
        id_nis_at
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
/* END_OF_SYMBOL_DEFINITION nisNetgroupTriple */

/* eslint-enable */

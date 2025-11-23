/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { bootParameterSyntax } from '../NIS/bootParameterSyntax.oa';
import {
    BootParameterSyntax,
    _decode_BootParameterSyntax,
    _encode_BootParameterSyntax,
} from '../NIS/BootParameterSyntax.ta';
import { id_nis_at } from '../NIS/id-nis-at.va';
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
export { bootParameterSyntax } from '../NIS/bootParameterSyntax.oa';
export {
    BootParameterSyntax,
    _decode_BootParameterSyntax,
    _encode_BootParameterSyntax,
} from '../NIS/BootParameterSyntax.ta';
export { id_nis_at } from '../NIS/id-nis-at.va';

/* START_OF_SYMBOL_DEFINITION bootParameter */
/**
 * @summary bootParameter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bootParameter ATTRIBUTE ::= {
 *     WITH SYNTAX                 BootParameterSyntax
 *     LDAP-SYNTAX                 bootParameterSyntax.&id
 *     LDAP-NAME                     {"bootParameter"}
 *     LDAP-DESC                   "rpc.bootparamd parameter"
 *     ID { id-nis-at 23 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BootParameterSyntax>}
 * @implements {ATTRIBUTE<BootParameterSyntax>}
 */
export const bootParameter: ATTRIBUTE<BootParameterSyntax> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_BootParameterSyntax,
    },
    encoderFor: {
        '&Type': _encode_BootParameterSyntax,
    },
    '&ldapSyntax': bootParameterSyntax['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['bootParameter'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'rpc.bootparamd parameter' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [23],
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
/* END_OF_SYMBOL_DEFINITION bootParameter */

/* eslint-enable */

/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { attributeMap } from '../DUAConf/attributeMap.oa';
import { authenticationMethod } from '../DUAConf/authenticationMethod.oa';
import { bindTimeLimit } from '../DUAConf/bindTimeLimit.oa';
import { credentialLevel } from '../DUAConf/credentialLevel.oa';
import { defaultSearchBase } from '../DUAConf/defaultSearchBase.oa';
import { defaultSearchScope } from '../DUAConf/defaultSearchScope.oa';
import { defaultServerList } from '../DUAConf/defaultServerList.oa';
import { dereferenceAliases } from '../DUAConf/dereferenceAliases.oa';
import { duaConfSchemaOID } from '../DUAConf/duaConfSchemaOID.va';
import { followReferrals } from '../DUAConf/followReferrals.oa';
import { objectclassMap } from '../DUAConf/objectclassMap.oa';
import { preferredServerList } from '../DUAConf/preferredServerList.oa';
import { profileTTL } from '../DUAConf/profileTTL.oa';
import { searchTimeLimit } from '../DUAConf/searchTimeLimit.oa';
import { serviceAuthenticationMethod } from '../DUAConf/serviceAuthenticationMethod.oa';
import { serviceCredentialLevel } from '../DUAConf/serviceCredentialLevel.oa';
import { serviceSearchDescriptor } from '../DUAConf/serviceSearchDescriptor.oa';
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
export { attributeMap } from '../DUAConf/attributeMap.oa';
export { authenticationMethod } from '../DUAConf/authenticationMethod.oa';
export { bindTimeLimit } from '../DUAConf/bindTimeLimit.oa';
export { credentialLevel } from '../DUAConf/credentialLevel.oa';
export { defaultSearchBase } from '../DUAConf/defaultSearchBase.oa';
export { defaultSearchScope } from '../DUAConf/defaultSearchScope.oa';
export { defaultServerList } from '../DUAConf/defaultServerList.oa';
export { dereferenceAliases } from '../DUAConf/dereferenceAliases.oa';
export { duaConfSchemaOID } from '../DUAConf/duaConfSchemaOID.va';
export { followReferrals } from '../DUAConf/followReferrals.oa';
export { objectclassMap } from '../DUAConf/objectclassMap.oa';
export { preferredServerList } from '../DUAConf/preferredServerList.oa';
export { profileTTL } from '../DUAConf/profileTTL.oa';
export { searchTimeLimit } from '../DUAConf/searchTimeLimit.oa';
export { serviceAuthenticationMethod } from '../DUAConf/serviceAuthenticationMethod.oa';
export { serviceCredentialLevel } from '../DUAConf/serviceCredentialLevel.oa';
export { serviceSearchDescriptor } from '../DUAConf/serviceSearchDescriptor.oa';

/* START_OF_SYMBOL_DEFINITION duaConfigProfile */
/**
 * @summary duaConfigProfile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * duaConfigProfile OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName}
 *     MAY CONTAIN        {
 *         defaultServerList
 *         | preferredServerList
 *         | defaultSearchBase
 *         | defaultSearchScope
 *         | searchTimeLimit
 *         | bindTimeLimit
 *         | credentialLevel
 *         | authenticationMethod
 *         | followReferrals
 *         | dereferenceAliases
 *         | serviceSearchDescriptor
 *         | serviceCredentialLevel
 *         | serviceAuthenticationMethod
 *         | objectclassMap
 *         | attributeMap
 *         | profileTTL
 *     }
 *     LDAP-NAME        {"DUAConfigProfile"}
 *     LDAP-DESC        "Abstraction of a base configuration for a DUA"
 *     ID                { duaConfSchemaOID 2 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const duaConfigProfile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        defaultServerList,
        preferredServerList,
        defaultSearchBase,
        defaultSearchScope,
        searchTimeLimit,
        bindTimeLimit,
        credentialLevel,
        authenticationMethod,
        followReferrals,
        dereferenceAliases,
        serviceSearchDescriptor,
        serviceCredentialLevel,
        serviceAuthenticationMethod,
        objectclassMap,
        attributeMap,
        profileTTL,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['DUAConfigProfile'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction of a base configuration for a DUA' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [2, 5],
        duaConfSchemaOID
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION duaConfigProfile */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
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
    '&id': _OID.fromParts(
        [2, 5],
        duaConfSchemaOID
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION duaConfigProfile */

/* eslint-enable */

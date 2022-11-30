/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { eduPersonAffiliation } from '../EduPersonSchema/eduPersonAffiliation.oa';
import { eduPersonAssurance } from '../EduPersonSchema/eduPersonAssurance.oa';
import { eduPersonEntitlement } from '../EduPersonSchema/eduPersonEntitlement.oa';
import { eduPersonNickName } from '../EduPersonSchema/eduPersonNickName.oa';
import { eduPersonOrcid } from '../EduPersonSchema/eduPersonOrcid.oa';
import { eduPersonOrgDN } from '../EduPersonSchema/eduPersonOrgDN.oa';
import { eduPersonOrgUnitDN } from '../EduPersonSchema/eduPersonOrgUnitDN.oa';
import { eduPersonPrimaryAffiliation } from '../EduPersonSchema/eduPersonPrimaryAffiliation.oa';
import { eduPersonPrimaryOrgUnitDN } from '../EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa';
import { eduPersonPrincipalName } from '../EduPersonSchema/eduPersonPrincipalName.oa';
import { eduPersonPrincipalNamePrior } from '../EduPersonSchema/eduPersonPrincipalNamePrior.oa';
import { eduPersonScopedAffiliation } from '../EduPersonSchema/eduPersonScopedAffiliation.oa';
import { eduPersonTargetedID } from '../EduPersonSchema/eduPersonTargetedID.oa';
import { eduPersonUniqueId } from '../EduPersonSchema/eduPersonUniqueId.oa';
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
export { eduPersonAffiliation } from '../EduPersonSchema/eduPersonAffiliation.oa';
export { eduPersonAssurance } from '../EduPersonSchema/eduPersonAssurance.oa';
export { eduPersonEntitlement } from '../EduPersonSchema/eduPersonEntitlement.oa';
export { eduPersonNickName } from '../EduPersonSchema/eduPersonNickName.oa';
export { eduPersonOrcid } from '../EduPersonSchema/eduPersonOrcid.oa';
export { eduPersonOrgDN } from '../EduPersonSchema/eduPersonOrgDN.oa';
export { eduPersonOrgUnitDN } from '../EduPersonSchema/eduPersonOrgUnitDN.oa';
export { eduPersonPrimaryAffiliation } from '../EduPersonSchema/eduPersonPrimaryAffiliation.oa';
export { eduPersonPrimaryOrgUnitDN } from '../EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa';
export { eduPersonPrincipalName } from '../EduPersonSchema/eduPersonPrincipalName.oa';
export { eduPersonPrincipalNamePrior } from '../EduPersonSchema/eduPersonPrincipalNamePrior.oa';
export { eduPersonScopedAffiliation } from '../EduPersonSchema/eduPersonScopedAffiliation.oa';
export { eduPersonTargetedID } from '../EduPersonSchema/eduPersonTargetedID.oa';
export { eduPersonUniqueId } from '../EduPersonSchema/eduPersonUniqueId.oa';

/* START_OF_SYMBOL_DEFINITION eduPerson */
/**
 * @summary eduPerson
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * eduPerson OBJECT-CLASS ::= {
 *     KIND            auxiliary
 *     MAY CONTAIN     {
 *         eduPersonAffiliation
 *         | eduPersonNickName
 *         | eduPersonOrgDN
 *         | eduPersonOrgUnitDN
 *         | eduPersonPrimaryAffiliation
 *         | eduPersonPrincipalName
 *         | eduPersonEntitlement
 *         | eduPersonPrimaryOrgUnitDN
 *         | eduPersonScopedAffiliation
 *         | eduPersonTargetedID
 *         | eduPersonAssurance
 *         | eduPersonPrincipalNamePrior
 *         | eduPersonUniqueId
 *         | eduPersonOrcid
 *     }
 *     LDAP-NAME       {"eduPerson"}
 *     ID              { 1 3 6 1 4 1 5923 1 1 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const eduPerson: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        eduPersonAffiliation,
        eduPersonNickName,
        eduPersonOrgDN,
        eduPersonOrgUnitDN,
        eduPersonPrimaryAffiliation,
        eduPersonPrincipalName,
        eduPersonEntitlement,
        eduPersonPrimaryOrgUnitDN,
        eduPersonScopedAffiliation,
        eduPersonTargetedID,
        eduPersonAssurance,
        eduPersonPrincipalNamePrior,
        eduPersonUniqueId,
        eduPersonOrcid,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['eduPerson'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 5923, 1, 1, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION eduPerson */

/* eslint-enable */

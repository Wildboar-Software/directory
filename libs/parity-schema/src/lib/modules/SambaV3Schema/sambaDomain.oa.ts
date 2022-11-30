/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { sambaAlgorithmicRidBase } from '../SambaV3Schema/sambaAlgorithmicRidBase.oa';
import { sambaDomainName } from '../SambaV3Schema/sambaDomainName.oa';
import { sambaForceLogoff } from '../SambaV3Schema/sambaForceLogoff.oa';
import { sambaLockoutDuration } from '../SambaV3Schema/sambaLockoutDuration.oa';
import { sambaLockoutObservationWindow } from '../SambaV3Schema/sambaLockoutObservationWindow.oa';
import { sambaLockoutThreshold } from '../SambaV3Schema/sambaLockoutThreshold.oa';
import { sambaLogonToChgPwd } from '../SambaV3Schema/sambaLogonToChgPwd.oa';
import { sambaMaxPwdAge } from '../SambaV3Schema/sambaMaxPwdAge.oa';
import { sambaMinPwdAge } from '../SambaV3Schema/sambaMinPwdAge.oa';
import { sambaMinPwdLength } from '../SambaV3Schema/sambaMinPwdLength.oa';
import { sambaNextGroupRid } from '../SambaV3Schema/sambaNextGroupRid.oa';
import { sambaNextRid } from '../SambaV3Schema/sambaNextRid.oa';
import { sambaNextUserRid } from '../SambaV3Schema/sambaNextUserRid.oa';
import { sambaPwdHistoryLength } from '../SambaV3Schema/sambaPwdHistoryLength.oa';
import { sambaRefuseMachinePwdChange } from '../SambaV3Schema/sambaRefuseMachinePwdChange.oa';
import { sambaSID } from '../SambaV3Schema/sambaSID.oa';
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
export { sambaAlgorithmicRidBase } from '../SambaV3Schema/sambaAlgorithmicRidBase.oa';
export { sambaDomainName } from '../SambaV3Schema/sambaDomainName.oa';
export { sambaForceLogoff } from '../SambaV3Schema/sambaForceLogoff.oa';
export { sambaLockoutDuration } from '../SambaV3Schema/sambaLockoutDuration.oa';
export { sambaLockoutObservationWindow } from '../SambaV3Schema/sambaLockoutObservationWindow.oa';
export { sambaLockoutThreshold } from '../SambaV3Schema/sambaLockoutThreshold.oa';
export { sambaLogonToChgPwd } from '../SambaV3Schema/sambaLogonToChgPwd.oa';
export { sambaMaxPwdAge } from '../SambaV3Schema/sambaMaxPwdAge.oa';
export { sambaMinPwdAge } from '../SambaV3Schema/sambaMinPwdAge.oa';
export { sambaMinPwdLength } from '../SambaV3Schema/sambaMinPwdLength.oa';
export { sambaNextGroupRid } from '../SambaV3Schema/sambaNextGroupRid.oa';
export { sambaNextRid } from '../SambaV3Schema/sambaNextRid.oa';
export { sambaNextUserRid } from '../SambaV3Schema/sambaNextUserRid.oa';
export { sambaPwdHistoryLength } from '../SambaV3Schema/sambaPwdHistoryLength.oa';
export { sambaRefuseMachinePwdChange } from '../SambaV3Schema/sambaRefuseMachinePwdChange.oa';
export { sambaSID } from '../SambaV3Schema/sambaSID.oa';

/* START_OF_SYMBOL_DEFINITION sambaDomain */
/**
 * @summary sambaDomain
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaDomain OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {sambaDomainName | sambaSID}
 *     MAY CONTAIN     {sambaAlgorithmicRidBase | sambaForceLogoff | sambaLockoutDuration | sambaLockoutObservationWindow | sambaLockoutThreshold | sambaLogonToChgPwd | sambaMaxPwdAge | sambaMinPwdAge | sambaMinPwdLength | sambaNextGroupRid | sambaNextRid | sambaNextUserRid | sambaPwdHistoryLength | sambaRefuseMachinePwdChange}
 *     LDAP-NAME       {"sambaDomain"}
 *     LDAP-DESC       "Samba Domain Information"
 *     ID              { 1 3 6 1 4 1 7165 2 2 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaDomain: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        sambaDomainName,
        sambaSID,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sambaAlgorithmicRidBase,
        sambaForceLogoff,
        sambaLockoutDuration,
        sambaLockoutObservationWindow,
        sambaLockoutThreshold,
        sambaLogonToChgPwd,
        sambaMaxPwdAge,
        sambaMinPwdAge,
        sambaMinPwdLength,
        sambaNextGroupRid,
        sambaNextRid,
        sambaNextUserRid,
        sambaPwdHistoryLength,
        sambaRefuseMachinePwdChange,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaDomain'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Domain Information' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 5,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaDomain */

/* eslint-enable */

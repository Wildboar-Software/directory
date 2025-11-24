/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
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
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 5,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaDomain */

/* eslint-enable */

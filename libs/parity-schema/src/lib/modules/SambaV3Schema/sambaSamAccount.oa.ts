/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { displayName } from '../InetOrgPerson/displayName.oa';
import { sambaAcctFlags } from '../SambaV3Schema/sambaAcctFlags.oa';
import { sambaBadPasswordCount } from '../SambaV3Schema/sambaBadPasswordCount.oa';
import { sambaBadPasswordTime } from '../SambaV3Schema/sambaBadPasswordTime.oa';
import { sambaDomainName } from '../SambaV3Schema/sambaDomainName.oa';
import { sambaHomeDrive } from '../SambaV3Schema/sambaHomeDrive.oa';
import { sambaHomePath } from '../SambaV3Schema/sambaHomePath.oa';
import { sambaKickoffTime } from '../SambaV3Schema/sambaKickoffTime.oa';
import { sambaLMPassword } from '../SambaV3Schema/sambaLMPassword.oa';
import { sambaLogoffTime } from '../SambaV3Schema/sambaLogoffTime.oa';
import { sambaLogonHours } from '../SambaV3Schema/sambaLogonHours.oa';
import { sambaLogonScript } from '../SambaV3Schema/sambaLogonScript.oa';
import { sambaLogonTime } from '../SambaV3Schema/sambaLogonTime.oa';
import { sambaMungedDial } from '../SambaV3Schema/sambaMungedDial.oa';
import { sambaNTPassword } from '../SambaV3Schema/sambaNTPassword.oa';
import { sambaPasswordHistory } from '../SambaV3Schema/sambaPasswordHistory.oa';
import { sambaPrimaryGroupSID } from '../SambaV3Schema/sambaPrimaryGroupSID.oa';
import { sambaProfilePath } from '../SambaV3Schema/sambaProfilePath.oa';
import { sambaPwdCanChange } from '../SambaV3Schema/sambaPwdCanChange.oa';
import { sambaPwdLastSet } from '../SambaV3Schema/sambaPwdLastSet.oa';
import { sambaPwdMustChange } from '../SambaV3Schema/sambaPwdMustChange.oa';
import { sambaSID } from '../SambaV3Schema/sambaSID.oa';
import { sambaUserWorkstations } from '../SambaV3Schema/sambaUserWorkstations.oa';


/* START_OF_SYMBOL_DEFINITION sambaSamAccount */
/**
 * @summary sambaSamAccount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaSamAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {sambaSID | uid}
 *     MAY CONTAIN     {
 *         commonName
 *         | description
 *         | displayName
 *         | sambaAcctFlags
 *         | sambaBadPasswordCount
 *         | sambaBadPasswordTime
 *         | sambaDomainName
 *         | sambaHomeDrive
 *         | sambaHomePath
 *         | sambaKickoffTime
 *         | sambaLMPassword
 *         | sambaLogoffTime
 *         | sambaLogonHours
 *         | sambaLogonScript
 *         | sambaLogonTime
 *         | sambaMungedDial
 *         | sambaNTPassword
 *         | sambaPasswordHistory
 *         | sambaPrimaryGroupSID
 *         | sambaProfilePath
 *         | sambaPwdCanChange
 *         | sambaPwdLastSet
 *         | sambaPwdMustChange
 *         | sambaUserWorkstations
 *     }
 *     LDAP-NAME       {"sambaSamAccount"}
 *     LDAP-DESC       "Samba 3.0 Auxilary SAM Account"
 *     ID              { 1 3 6 1 4 1 7165 2 2 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaSamAccount: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [sambaSID, uid] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        description,
        displayName,
        sambaAcctFlags,
        sambaBadPasswordCount,
        sambaBadPasswordTime,
        sambaDomainName,
        sambaHomeDrive,
        sambaHomePath,
        sambaKickoffTime,
        sambaLMPassword,
        sambaLogoffTime,
        sambaLogonHours,
        sambaLogonScript,
        sambaLogonTime,
        sambaMungedDial,
        sambaNTPassword,
        sambaPasswordHistory,
        sambaPrimaryGroupSID,
        sambaProfilePath,
        sambaPwdCanChange,
        sambaPwdLastSet,
        sambaPwdMustChange,
        sambaUserWorkstations,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaSamAccount'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba 3.0 Auxilary SAM Account' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 6,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaSamAccount */

/* eslint-enable */

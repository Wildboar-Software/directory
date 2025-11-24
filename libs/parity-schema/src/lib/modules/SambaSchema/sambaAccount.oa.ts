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
import { acctFlags } from '../SambaSchema/acctFlags.oa';
import { domain } from '../SambaSchema/domain.oa';
import { homeDrive } from '../SambaSchema/homeDrive.oa';
import { id_samba_oc } from '../SambaSchema/id-samba-oc.va';
import { kickoffTime } from '../SambaSchema/kickoffTime.oa';
import { lmPassword } from '../SambaSchema/lmPassword.oa';
import { logoffTime } from '../SambaSchema/logoffTime.oa';
import { logonTime } from '../SambaSchema/logonTime.oa';
import { ntPassword } from '../SambaSchema/ntPassword.oa';
import { primaryGroupID } from '../SambaSchema/primaryGroupID.oa';
import { profilePath } from '../SambaSchema/profilePath.oa';
import { pwdCanChange } from '../SambaSchema/pwdCanChange.oa';
import { pwdLastSet } from '../SambaSchema/pwdLastSet.oa';
import { pwdMustChange } from '../SambaSchema/pwdMustChange.oa';
import { rid } from '../SambaSchema/rid.oa';
import { scriptPath } from '../SambaSchema/scriptPath.oa';
import { smbHome } from '../SambaSchema/smbHome.oa';
import { userWorkstations } from '../SambaSchema/userWorkstations.oa';


/* START_OF_SYMBOL_DEFINITION sambaAccount */
/**
 * @summary sambaAccount
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaAccount OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                auxiliary
 *     MUST CONTAIN        { uid | rid }
 *     MAY CONTAIN         {
 *         commonName
 *         | lmPassword
 *         | ntPassword
 *         | pwdLastSet
 *         | logonTime
 *         | logoffTime
 *         | kickoffTime
 *         | pwdCanChange
 *         | pwdMustChange
 *         | acctFlags
 *         | displayName
 *         | smbHome
 *         | homeDrive
 *         | scriptPath
 *         | profilePath
 *         | description
 *         | userWorkstations
 *         | primaryGroupID
 *         | domain
 *     }
 *     LDAP-NAME           { "sambaAccount" }
 *     LDAP-DESC           "Samba Auxilary Account"
 *     ID                  { id-samba-oc 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaAccount: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid, rid] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        lmPassword,
        ntPassword,
        pwdLastSet,
        logonTime,
        logoffTime,
        kickoffTime,
        pwdCanChange,
        pwdMustChange,
        acctFlags,
        displayName,
        smbHome,
        homeDrive,
        scriptPath,
        profilePath,
        description,
        userWorkstations,
        primaryGroupID,
        domain,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaAccount'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Auxilary Account' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3],
        id_samba_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaAccount */

/* eslint-enable */

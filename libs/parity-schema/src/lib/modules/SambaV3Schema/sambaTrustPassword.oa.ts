/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sambaDomainName } from '../SambaV3Schema/sambaDomainName.oa';
import { sambaNTPassword } from '../SambaV3Schema/sambaNTPassword.oa';
import { sambaPwdLastSet } from '../SambaV3Schema/sambaPwdLastSet.oa';
import { sambaSID } from '../SambaV3Schema/sambaSID.oa';
import { sambaTrustFlags } from '../SambaV3Schema/sambaTrustFlags.oa';


/* START_OF_SYMBOL_DEFINITION sambaTrustPassword */
/**
 * @summary sambaTrustPassword
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sambaTrustPassword OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     MUST CONTAIN    {sambaDomainName | sambaNTPassword | sambaTrustFlags}
 *     MAY CONTAIN     {sambaPwdLastSet | sambaSID}
 *     LDAP-NAME       {"sambaTrustPassword"}
 *     LDAP-DESC       "Samba Trust Password"
 *     ID              { 1 3 6 1 4 1 7165 2 2 14 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sambaTrustPassword: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        sambaDomainName,
        sambaNTPassword,
        sambaTrustFlags,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sambaPwdLastSet,
        sambaSID,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sambaTrustPassword'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Samba Trust Password' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 7165, 2, 2, 14,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sambaTrustPassword */

/* eslint-enable */

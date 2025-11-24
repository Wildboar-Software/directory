/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { krb5AccountDisabled } from '../KerberosV5KeyDistributionCenter/krb5AccountDisabled.oa';
import { krb5AccountExpirationTime } from '../KerberosV5KeyDistributionCenter/krb5AccountExpirationTime.oa';
import { krb5AccountLockedOut } from '../KerberosV5KeyDistributionCenter/krb5AccountLockedOut.oa';
import { krb5EncryptionType } from '../KerberosV5KeyDistributionCenter/krb5EncryptionType.oa';
import { krb5KDCFlags } from '../KerberosV5KeyDistributionCenter/krb5KDCFlags.oa';
import { krb5Key } from '../KerberosV5KeyDistributionCenter/krb5Key.oa';
import { krb5KeyVersionNumber } from '../KerberosV5KeyDistributionCenter/krb5KeyVersionNumber.oa';
import { krb5MaxLife } from '../KerberosV5KeyDistributionCenter/krb5MaxLife.oa';
import { krb5MaxRenew } from '../KerberosV5KeyDistributionCenter/krb5MaxRenew.oa';
import { krb5PasswordEnd } from '../KerberosV5KeyDistributionCenter/krb5PasswordEnd.oa';
import { krb5Principal } from '../KerberosV5KeyDistributionCenter/krb5Principal.oa';
import { krb5ValidEnd } from '../KerberosV5KeyDistributionCenter/krb5ValidEnd.oa';
import { krb5ValidStart } from '../KerberosV5KeyDistributionCenter/krb5ValidStart.oa';


/* START_OF_SYMBOL_DEFINITION krb5KDCEntry */
/**
 * @summary krb5KDCEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * krb5KDCEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {krb5Principal}
 *     KIND            auxiliary
 *     MUST CONTAIN    {krb5KeyVersionNumber}
 *     MAY CONTAIN     {
 *         krb5ValidStart
 *         | krb5ValidEnd
 *         | krb5PasswordEnd
 *         | krb5MaxLife
 *         | krb5MaxRenew
 *         | krb5KDCFlags
 *         | krb5EncryptionType
 *         | krb5Key
 *         | krb5AccountDisabled
 *         | krb5AccountLockedOut
 *         | krb5AccountExpirationTime
 *     }
 *     LDAP-NAME       {"krb5KDCEntry"}
 *     ID              { 1 3 6 1 4 1 5322 10 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const krb5KDCEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [krb5Principal] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [krb5KeyVersionNumber] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        krb5ValidStart,
        krb5ValidEnd,
        krb5PasswordEnd,
        krb5MaxLife,
        krb5MaxRenew,
        krb5KDCFlags,
        krb5EncryptionType,
        krb5Key,
        krb5AccountDisabled,
        krb5AccountLockedOut,
        krb5AccountExpirationTime,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['krb5KDCEntry'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 5322, 10, 2, 2,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION krb5KDCEntry */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { gpgFingerprint } from '../LegacyPGPFramework/gpgFingerprint.oa';
import { gpgMailbox } from '../LegacyPGPFramework/gpgMailbox.oa';
import { gpgSubCertID } from '../LegacyPGPFramework/gpgSubCertID.oa';
import { gpgSubFingerprint } from '../LegacyPGPFramework/gpgSubFingerprint.oa';
import { mcafee } from '../LegacyPGPFramework/mcafee.va';
import { pgpCertID } from '../LegacyPGPFramework/pgpCertID.oa';
import { pgpDisabled } from '../LegacyPGPFramework/pgpDisabled.oa';
import { pgpKey } from '../LegacyPGPFramework/pgpKey.oa';
import { pgpKeyCreateTime } from '../LegacyPGPFramework/pgpKeyCreateTime.oa';
import { pgpKeyExpireTime } from '../LegacyPGPFramework/pgpKeyExpireTime.oa';
import { pgpKeyID } from '../LegacyPGPFramework/pgpKeyID.oa';
import { pgpKeySize } from '../LegacyPGPFramework/pgpKeySize.oa';
import { pgpKeyType } from '../LegacyPGPFramework/pgpKeyType.oa';
import { pgpRevoked } from '../LegacyPGPFramework/pgpRevoked.oa';
import { pgpSignerID } from '../LegacyPGPFramework/pgpSignerID.oa';
import { pgpSubKeyID } from '../LegacyPGPFramework/pgpSubKeyID.oa';
import { pgpUserID } from '../LegacyPGPFramework/pgpUserID.oa';


/* START_OF_SYMBOL_DEFINITION pgpKeyInfo */
/**
 * @summary pgpKeyInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pgpKeyInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { pgpCertID | pgpKey }
 *     MAY CONTAIN         {
 *         pgpDisabled
 *         | pgpKeyID
 *         | pgpKeyType
 *         | pgpUserID
 *         | pgpKeyCreateTime
 *         | pgpSignerID
 *         | pgpRevoked
 *         | pgpSubKeyID
 *         | pgpKeySize
 *         | pgpKeyExpireTime
 *         | gpgFingerprint
 *         | gpgSubFingerprint
 *         | gpgSubCertID
 *         | gpgMailbox
 *     }
 *     LDAP-NAME           {"pgpKeyInfo"}
 *     LDAP-DESC           {"An OpenPGP public keyblock"}
 *     ID { mcafee 8 2 24 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pgpKeyInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [pgpCertID, pgpKey] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        pgpDisabled,
        pgpKeyID,
        pgpKeyType,
        pgpUserID,
        pgpKeyCreateTime,
        pgpSignerID,
        pgpRevoked,
        pgpSubKeyID,
        pgpKeySize,
        pgpKeyExpireTime,
        gpgFingerprint,
        gpgSubFingerprint,
        gpgSubCertID,
        gpgMailbox,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pgpKeyInfo'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An OpenPGP public keyblock' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [8, 2, 24],
        mcafee
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pgpKeyInfo */

/* eslint-enable */

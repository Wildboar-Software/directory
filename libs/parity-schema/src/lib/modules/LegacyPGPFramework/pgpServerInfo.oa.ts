/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { mcafee } from '../LegacyPGPFramework/mcafee.va';
import { pgpBaseKeySpaceDN } from '../LegacyPGPFramework/pgpBaseKeySpaceDN.oa';
import { pgpSoftware } from '../LegacyPGPFramework/pgpSoftware.oa';
import { pgpVersion } from '../LegacyPGPFramework/pgpVersion.oa';


/* START_OF_SYMBOL_DEFINITION pgpServerInfo */
/**
 * @summary pgpServerInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pgpServerInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName | pgpBaseKeySpaceDN }
 *     MAY CONTAIN         { pgpSoftware | pgpVersion }
 *     LDAP-NAME           {"pgpServerInfo"}
 *     LDAP-DESC           {"An OpenPGP public keyblock store"}
 *     ID { mcafee 8 2 23 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pgpServerInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        pgpBaseKeySpaceDN,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [pgpSoftware, pgpVersion] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pgpServerInfo'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An OpenPGP public keyblock store' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [8, 2, 23],
        mcafee
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pgpServerInfo */

/* eslint-enable */

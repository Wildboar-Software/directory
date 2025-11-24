/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { directoryString } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';



/* START_OF_SYMBOL_DEFINITION ads_delegateSslTrustManager */
/**
 * @summary ads_delegateSslTrustManager
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ads-delegateSslTrustManager ATTRIBUTE ::= {
 *     WITH SYNTAX                 UnboundedDirectoryString
 *     EQUALITY MATCHING RULE      caseExactMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 directoryString.&id
 *     LDAP-NAME                   {"ads-delegateSslTrustManager"}
 *     LDAP-DESC                   "FQCN of the TrustManager to use to validate the SSL communication"
 *     ID                          { 1 3 6 1 4 1 18060 0 4 1 2 937 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const ads_delegateSslTrustManager: ATTRIBUTE<UnboundedDirectoryString> =
    {
        class: 'ATTRIBUTE',
        decoderFor: {
            '&Type': _decode_UnboundedDirectoryString,
        },
        encoderFor: {
            '&Type': _encode_UnboundedDirectoryString,
        },
        '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
        '&single-valued': true /* OBJECT_FIELD_SETTING */,
        '&ldapSyntax': directoryString['&id'] /* OBJECT_FIELD_SETTING */,
        '&ldapName': ['ads-delegateSslTrustManager'] /* OBJECT_FIELD_SETTING */,
        '&ldapDesc':
            'FQCN of the TrustManager to use to validate the SSL communication' /* OBJECT_FIELD_SETTING */,
        '&id': _OID.fromParts([
            1, 3, 6, 1, 4, 1, 18060, 0, 4, 1, 2, 937,
        ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
        '&Type':
            0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
        '&collective':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&no-user-modification':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&usage':
            userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
        '&obsolete':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    };
/* END_OF_SYMBOL_DEFINITION ads_delegateSslTrustManager */

/* eslint-enable */

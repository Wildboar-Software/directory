/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { octetString } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID, OCTET_STRING } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { pilotAttributeType } from '../Cosine/pilotAttributeType.va';


/* START_OF_SYMBOL_DEFINITION audio */
/**
 * @summary audio
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * audio ATTRIBUTE ::= {
 *     WITH SYNTAX                 OCTET STRING (1..ub-audio)
 *     LDAP-SYNTAX                 octetString.&id
 *     LDAP-NAME                     {"audio"}
 *     LDAP-DESC                    "RFC1274: audio (u-law)."
 *     ID { pilotAttributeType 55 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OCTET_STRING>}
 * @implements {ATTRIBUTE<OCTET_STRING>}
 */
export const audio: ATTRIBUTE<OCTET_STRING> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeOctetString,
    },
    encoderFor: {
        '&Type': $._encodeOctetString,
    },
    '&ldapSyntax': octetString['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['audio'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: audio (u-law).' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [55],
        pilotAttributeType
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION audio */

/* eslint-enable */

/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactIA5Match } from '@wildboar/x500/SelectedAttributeTypes';
import { ia5String } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import {
    AbsoluteFilePath,
    _decode_AbsoluteFilePath,
    _encode_AbsoluteFilePath,
} from '../NIS/AbsoluteFilePath.ta';
import { id_nis_at } from '../NIS/id-nis-at.va';

/* START_OF_SYMBOL_DEFINITION homeDirectory */
/**
 * @summary homeDirectory
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * homeDirectory ATTRIBUTE ::= {
 *     WITH SYNTAX                 AbsoluteFilePath
 *     EQUALITY MATCHING RULE         caseExactIA5Match
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 ia5String.&id
 *     LDAP-NAME                     {"homeDirectory"}
 *     LDAP-DESC                   "The absolute path to the home directory"
 *     ID { id-nis-at 3 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AbsoluteFilePath>}
 * @implements {ATTRIBUTE<AbsoluteFilePath>}
 */
export const homeDirectory: ATTRIBUTE<AbsoluteFilePath> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AbsoluteFilePath,
    },
    encoderFor: {
        '&Type': _encode_AbsoluteFilePath,
    },
    '&equality-match': caseExactIA5Match /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': ia5String['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['homeDirectory'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'The absolute path to the home directory' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3],
        id_nis_at
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION homeDirectory */

/* eslint-enable */

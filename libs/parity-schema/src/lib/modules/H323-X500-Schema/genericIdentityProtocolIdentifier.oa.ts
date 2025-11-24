/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { caseIgnoreSubstringsMatch } from '@wildboar/x500/SelectedAttributeTypes';
import {
    type UnboundedDirectoryString,
    _decode_UnboundedDirectoryString,
    _encode_UnboundedDirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { gi_at } from '../H323-X500-Schema/gi-at.va';



/* START_OF_SYMBOL_DEFINITION genericIdentityProtocolIdentifier */
/**
 * @summary genericIdentityProtocolIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * genericIdentityProtocolIdentifier ATTRIBUTE ::= {
 *   WITH SYNTAX               UnboundedDirectoryString
 *   EQUALITY MATCHING RULE    caseIgnoreMatch
 *   SUBSTRINGS MATCHING RULE  caseIgnoreSubstringsMatch
 *   ID                        {gi-at  1}
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<UnboundedDirectoryString>}
 * @implements {ATTRIBUTE<UnboundedDirectoryString>}
 */
export const genericIdentityProtocolIdentifier: ATTRIBUTE<UnboundedDirectoryString> =
    {
        class: 'ATTRIBUTE',
        decoderFor: {
            '&Type': _decode_UnboundedDirectoryString,
        },
        encoderFor: {
            '&Type': _encode_UnboundedDirectoryString,
        },
        '&equality-match': caseIgnoreMatch /* OBJECT_FIELD_SETTING */,
        '&substrings-match':
            caseIgnoreSubstringsMatch /* OBJECT_FIELD_SETTING */,
        '&id': _OID.fromParts(
            [1],
            gi_at
        ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
        '&Type':
            0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
        '&single-valued':
            false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION genericIdentityProtocolIdentifier */

/* eslint-enable */

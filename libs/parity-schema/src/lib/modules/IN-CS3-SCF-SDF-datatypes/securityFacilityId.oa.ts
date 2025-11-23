/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { objectIdentifierMatch } from '@wildboar/x500/InformationFramework';
import { id_at_securityFacilityId } from '../IN-CS3-object-identifiers/id-at-securityFacilityId.va';
import {
    SF_CODE,
    _decode_SF_CODE,
    _encode_SF_CODE,
} from '../IN-CS3-SCF-SDF-datatypes/SF-CODE.ta';

/* START_OF_SYMBOL_DEFINITION securityFacilityId */
/**
 * @summary securityFacilityId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * securityFacilityId ATTRIBUTE ::= {
 *   WITH SYNTAX SF-CODE EQUALITY MATCHING RULE  objectIdentifierMatch
 *   SINGLE VALUE                                TRUE
 *   ID                                          id-at-securityFacilityId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SF_CODE>}
 * @implements {ATTRIBUTE<SF_CODE>}
 */
export const securityFacilityId: ATTRIBUTE<SF_CODE> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SF_CODE,
    },
    encoderFor: {
        '&Type': _encode_SF_CODE,
    },
    '&equality-match': objectIdentifierMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_securityFacilityId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION securityFacilityId */

/* eslint-enable */

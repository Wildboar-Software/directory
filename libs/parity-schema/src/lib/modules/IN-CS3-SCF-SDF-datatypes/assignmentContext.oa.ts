/* eslint-disable */
import type { CONTEXT } from '@wildboar/x500/InformationFramework';
import {
    type DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import { id_avc_assignment } from '../IN-CS3-object-identifiers/id-avc-assignment.va';


/* START_OF_SYMBOL_DEFINITION assignmentContext */
/**
 * @summary assignmentContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * assignmentContext CONTEXT ::= {
 *   WITH SYNTAX  DistinguishedName
 *   ID           id-avc-assignment
 * }
 * ```
 *
 * @constant
 * @type {CONTEXT<DistinguishedName>}
 * @implements {CONTEXT<DistinguishedName>}
 */
export const assignmentContext: CONTEXT<DistinguishedName> = {
    class: 'CONTEXT',
    decoderFor: {
        '&Type': _decode_DistinguishedName,
        '&Assertion': undefined,
    },
    encoderFor: {
        '&Type': _encode_DistinguishedName,
        '&Assertion': undefined,
    },
    '&id': id_avc_assignment /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&Assertion':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&absentMatch':
        true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION assignmentContext */

/* eslint-enable */

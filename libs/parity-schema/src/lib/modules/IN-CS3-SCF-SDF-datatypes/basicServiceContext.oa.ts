/* eslint-disable */
import { CONTEXT } from '@wildboar/x500/InformationFramework';
import { id_avc_basicService } from '../IN-CS3-object-identifiers/id-avc-basicService.va';
import {
    BasicService,
    _decode_BasicService,
    _encode_BasicService,
} from '../IN-CS3-SCF-SDF-datatypes/BasicService.ta';

/* START_OF_SYMBOL_DEFINITION basicServiceContext */
/**
 * @summary basicServiceContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * basicServiceContext CONTEXT ::= {
 *   WITH SYNTAX  BasicService
 *   ID           id-avc-basicService
 * }
 * ```
 *
 * @constant
 * @type {CONTEXT<BasicService>}
 * @implements {CONTEXT<BasicService>}
 */
export const basicServiceContext: CONTEXT<BasicService> = {
    class: 'CONTEXT',
    decoderFor: {
        '&Type': _decode_BasicService,
        '&Assertion': undefined,
    },
    encoderFor: {
        '&Type': _encode_BasicService,
        '&Assertion': undefined,
    },
    '&id': id_avc_basicService /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&Assertion':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&absentMatch':
        true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION basicServiceContext */

/* eslint-enable */

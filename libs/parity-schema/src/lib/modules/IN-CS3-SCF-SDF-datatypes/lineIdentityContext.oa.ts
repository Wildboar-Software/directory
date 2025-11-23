/* eslint-disable */
import { CONTEXT } from '@wildboar/x500/InformationFramework';
import { id_avc_lineIdentity } from '../IN-CS3-object-identifiers/id-avc-lineIdentity.va';
import {
    IsdnAddress,
    _decode_IsdnAddress,
    _encode_IsdnAddress,
} from '../IN-CS3-SCF-SDF-datatypes/IsdnAddress.ta';

/* START_OF_SYMBOL_DEFINITION lineIdentityContext */
/**
 * @summary lineIdentityContext
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * lineIdentityContext CONTEXT ::= {
 *   WITH SYNTAX  IsdnAddress
 *   ID           id-avc-lineIdentity
 * }
 * ```
 *
 * @constant
 * @type {CONTEXT<IsdnAddress>}
 * @implements {CONTEXT<IsdnAddress>}
 */
export const lineIdentityContext: CONTEXT<IsdnAddress> = {
    class: 'CONTEXT',
    decoderFor: {
        '&Type': _decode_IsdnAddress,
        '&Assertion': undefined,
    },
    encoderFor: {
        '&Type': _encode_IsdnAddress,
        '&Assertion': undefined,
    },
    '&id': id_avc_lineIdentity /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&Assertion':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&absentMatch':
        true /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION lineIdentityContext */

/* eslint-enable */

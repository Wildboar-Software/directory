/* eslint-disable */
import {
    Countersignature,
    _decode_Countersignature,
    _encode_Countersignature,
} from '@wildboar/cms';
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_countersignature } from '../OtherAttributes/id-countersignature.va';


/* START_OF_SYMBOL_DEFINITION countersignature */
/**
 * @summary countersignature
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * countersignature ATTRIBUTE ::= {
 *     WITH SYNTAX         Countersignature
 *     ID                  id-countersignature }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Countersignature>}
 * @implements {ATTRIBUTE<Countersignature>}
 */
export const countersignature: ATTRIBUTE<Countersignature> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Countersignature,
    },
    encoderFor: {
        '&Type': _encode_Countersignature,
    },
    '&id': id_countersignature /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION countersignature */

/* eslint-enable */

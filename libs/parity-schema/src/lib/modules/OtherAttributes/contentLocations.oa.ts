/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_contentLocations } from '../OtherAttributes/id-contentLocations.va';
import {
    type URIs,
    _decode_URIs,
    _encode_URIs,
} from '../OtherAutomaticallyTaggedTypes/URIs.ta';

/* START_OF_SYMBOL_DEFINITION contentLocations */
/**
 * @summary contentLocations
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * contentLocations    ATTRIBUTE ::= {
 *     WITH SYNTAX         URIs
 *     ID                  id-contentLocations }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<URIs>}
 * @implements {ATTRIBUTE<URIs>}
 */
export const contentLocations: ATTRIBUTE<URIs> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_URIs,
    },
    encoderFor: {
        '&Type': _encode_URIs,
    },
    '&id': id_contentLocations /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION contentLocations */

/* eslint-enable */

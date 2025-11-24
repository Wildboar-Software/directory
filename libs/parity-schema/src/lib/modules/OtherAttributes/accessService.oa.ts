/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_at_accessService } from '../OtherAttributes/id-at-accessService.va';
import {
    AccessService,
    _decode_AccessService,
    _encode_AccessService,
} from '../OtherImplicitlyTaggedTypes/AccessService.ta';

export {
    AccessService,
    _decode_AccessService,
    _encode_AccessService,
} from '../OtherImplicitlyTaggedTypes/AccessService.ta';

/* START_OF_SYMBOL_DEFINITION accessService */
/**
 * @summary accessService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accessService ATTRIBUTE ::= {
 *     WITH SYNTAX       AccessService
 *     ID                id-at-accessService }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<AccessService>}
 * @implements {ATTRIBUTE<AccessService>}
 */
export const accessService: ATTRIBUTE<AccessService> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_AccessService,
    },
    encoderFor: {
        '&Type': _encode_AccessService,
    },
    '&id': id_at_accessService /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION accessService */

/* eslint-enable */

/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_ExtensionReq } from '../OtherAttributes/id-ExtensionReq.va';
import {
    ExtensionReq,
    _decode_ExtensionReq,
    _encode_ExtensionReq,
} from '../OtherImplicitlyTaggedTypes/ExtensionReq.ta';

/* START_OF_SYMBOL_DEFINITION extension_req */
/**
 * @summary extension_req
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * extension-req ATTRIBUTE ::= {
 *     WITH SYNTAX         ExtensionReq
 *     ID                  id-ExtensionReq }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ExtensionReq>}
 * @implements {ATTRIBUTE<ExtensionReq>}
 */
export const extension_req: ATTRIBUTE<ExtensionReq> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ExtensionReq,
    },
    encoderFor: {
        '&Type': _encode_ExtensionReq,
    },
    '&id': id_ExtensionReq /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION extension_req */

/* eslint-enable */

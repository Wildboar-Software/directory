/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aa_receiptRequest } from '../ExtendedSecurityServices-2009/id-aa-receiptRequest.va';
import {
    ReceiptRequest,
    _decode_ReceiptRequest,
    _encode_ReceiptRequest,
} from '../ExtendedSecurityServices-2009/ReceiptRequest.ta';

export {
    ReceiptRequest,
    _decode_ReceiptRequest,
    _encode_ReceiptRequest,
} from '../ExtendedSecurityServices-2009/ReceiptRequest.ta';

/* START_OF_SYMBOL_DEFINITION aa_receiptRequest */
/**
 * @summary aa_receiptRequest
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * aa-receiptRequest ATTRIBUTE ::= {
 *     WITH SYNTAX     ReceiptRequest
 *     ID              id-aa-receiptRequest }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<ReceiptRequest>}
 * @implements {ATTRIBUTE<ReceiptRequest>}
 */
export const aa_receiptRequest: ATTRIBUTE<ReceiptRequest> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_ReceiptRequest,
    },
    encoderFor: {
        '&Type': _encode_ReceiptRequest,
    },
    '&id': id_aa_receiptRequest /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION aa_receiptRequest */

/* eslint-enable */

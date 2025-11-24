/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_aca_wlanSSID } from '../OtherAttributes/id-aca-wlanSSID.va';
import {
    SSIDList,
    _decode_SSIDList,
    _encode_SSIDList,
} from '../OtherImplicitlyTaggedTypes/SSIDList.ta';

/* START_OF_SYMBOL_DEFINITION wlanSSID */
/**
 * @summary wlanSSID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * wlanSSID ATTRIBUTE ::= {
 *     WITH SYNTAX         SSIDList
 *     ID                  id-aca-wlanSSID }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<SSIDList>}
 * @implements {ATTRIBUTE<SSIDList>}
 */
export const wlanSSID: ATTRIBUTE<SSIDList> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_SSIDList,
    },
    encoderFor: {
        '&Type': _encode_SSIDList,
    },
    '&id': id_aca_wlanSSID /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION wlanSSID */

/* eslint-enable */

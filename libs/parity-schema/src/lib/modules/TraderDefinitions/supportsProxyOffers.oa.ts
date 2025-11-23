/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BOOLEAN } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_trader_at_supportsProxyOffers } from '../TraderDefinitions/id-trader-at-supportsProxyOffers.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { id_trader_at_supportsProxyOffers } from '../TraderDefinitions/id-trader-at-supportsProxyOffers.va';

/* START_OF_SYMBOL_DEFINITION supportsProxyOffers */
/**
 * @summary supportsProxyOffers
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * supportsProxyOffers ATTRIBUTE ::= {
 *   WITH SYNTAX             BOOLEAN
 *   EQUALITY MATCHING RULE  booleanMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-trader-at-supportsProxyOffers
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export const supportsProxyOffers: ATTRIBUTE<BOOLEAN> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBoolean,
    },
    encoderFor: {
        '&Type': $._encodeBoolean,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_supportsProxyOffers /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION supportsProxyOffers */

/* eslint-enable */

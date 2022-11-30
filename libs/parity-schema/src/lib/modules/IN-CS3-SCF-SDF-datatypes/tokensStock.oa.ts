/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { id_oc_tokensStock } from '../IN-CS3-object-identifiers/id-oc-tokensStock.va';
import { sizeOfRestocking } from './sizeOfRestocking.oa';
import { source } from './source.oa';
import { stock } from './stock.oa';
import { stockId } from './stockId.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { bindLevelIfOK } from './bindLevelIfOK.oa';
export { currentList } from './currentList.oa';
export { failureCounter } from './failureCounter.oa';
export { identifierList } from './identifierList.oa';
export { lockSession } from './lockSession.oa';
export { maxAttempts } from './maxAttempts.oa';
export { secretKey } from './secretKey.oa';
export { securityFacilityId } from './securityFacilityId.oa';

/* START_OF_SYMBOL_DEFINITION tokensStock */
/**
 * @summary tokensStock
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tokensStock OBJECT-CLASS ::= {
 *   KIND          abstract
 *   MUST CONTAIN  {stockId | stock}
 *   MAY CONTAIN   {source | sizeOfRestocking}
 *   ID            id-oc-tokensStock
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const tokensStock: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [stockId, stock] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        source,
        sizeOfRestocking,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_tokensStock /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION tokensStock */

/* eslint-enable */

/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { defFollowPolicy } from '../TraderDefinitions/defFollowPolicy.oa';
import { defHopCount } from '../TraderDefinitions/defHopCount.oa';
import { defMatchCard } from '../TraderDefinitions/defMatchCard.oa';
import { defReturnCard } from '../TraderDefinitions/defReturnCard.oa';
import { defSearchCard } from '../TraderDefinitions/defSearchCard.oa';
import { dsaName } from '../TraderDefinitions/dsaName.oa';
import { id_trader_oc_traderEntry } from '../TraderDefinitions/id-trader-oc-traderEntry.va';
import { maxFollowPolicy } from '../TraderDefinitions/maxFollowPolicy.oa';
import { maxHopCount } from '../TraderDefinitions/maxHopCount.oa';
import { maxLinkFollowPolicy } from '../TraderDefinitions/maxLinkFollowPolicy.oa';
import { maxList } from '../TraderDefinitions/maxList.oa';
import { maxMatchCard } from '../TraderDefinitions/maxMatchCard.oa';
import { maxReturnCard } from '../TraderDefinitions/maxReturnCard.oa';
import { maxSearchCard } from '../TraderDefinitions/maxSearchCard.oa';
import { requestIdStem } from '../TraderDefinitions/requestIdStem.oa';
import { supportsDynamicProperties } from '../TraderDefinitions/supportsDynamicProperties.oa';
import { supportsModifiableProperties } from '../TraderDefinitions/supportsModifiableProperties.oa';
import { supportsProxyOffers } from '../TraderDefinitions/supportsProxyOffers.oa';
import { traderInterface } from '../TraderDefinitions/traderInterface.oa';
import { typeRepos } from '../TraderDefinitions/typeRepos.oa';
export { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
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
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { defFollowPolicy } from '../TraderDefinitions/defFollowPolicy.oa';
export { defHopCount } from '../TraderDefinitions/defHopCount.oa';
export { defMatchCard } from '../TraderDefinitions/defMatchCard.oa';
export { defReturnCard } from '../TraderDefinitions/defReturnCard.oa';
export { defSearchCard } from '../TraderDefinitions/defSearchCard.oa';
export { dsaName } from '../TraderDefinitions/dsaName.oa';
export { id_trader_oc_traderEntry } from '../TraderDefinitions/id-trader-oc-traderEntry.va';
export { maxFollowPolicy } from '../TraderDefinitions/maxFollowPolicy.oa';
export { maxHopCount } from '../TraderDefinitions/maxHopCount.oa';
export { maxLinkFollowPolicy } from '../TraderDefinitions/maxLinkFollowPolicy.oa';
export { maxList } from '../TraderDefinitions/maxList.oa';
export { maxMatchCard } from '../TraderDefinitions/maxMatchCard.oa';
export { maxReturnCard } from '../TraderDefinitions/maxReturnCard.oa';
export { maxSearchCard } from '../TraderDefinitions/maxSearchCard.oa';
export { requestIdStem } from '../TraderDefinitions/requestIdStem.oa';
export { supportsDynamicProperties } from '../TraderDefinitions/supportsDynamicProperties.oa';
export { supportsModifiableProperties } from '../TraderDefinitions/supportsModifiableProperties.oa';
export { supportsProxyOffers } from '../TraderDefinitions/supportsProxyOffers.oa';
export { traderInterface } from '../TraderDefinitions/traderInterface.oa';
export { typeRepos } from '../TraderDefinitions/typeRepos.oa';

/* START_OF_SYMBOL_DEFINITION traderEntry */
/**
 * @summary traderEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * traderEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN
 *     {commonName | traderInterface | dsaName | typeRepos | defSearchCard |
 *       maxSearchCard | defMatchCard | maxMatchCard | defReturnCard |
 *       maxReturnCard | defHopCount | maxHopCount | defFollowPolicy |
 *       maxFollowPolicy | maxLinkFollowPolicy | supportsModifiableProperties |
 *       supportsDynamicProperties | supportsProxyOffers | maxList |
 *       requestIdStem}
 *   MAY CONTAIN   {description | userPassword}
 *   ID            id-trader-oc-traderEntry
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const traderEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        traderInterface,
        dsaName,
        typeRepos,
        defSearchCard,
        maxSearchCard,
        defMatchCard,
        maxMatchCard,
        defReturnCard,
        maxReturnCard,
        defHopCount,
        maxHopCount,
        defFollowPolicy,
        maxFollowPolicy,
        maxLinkFollowPolicy,
        supportsModifiableProperties,
        supportsDynamicProperties,
        supportsProxyOffers,
        maxList,
        requestIdStem,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        userPassword,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_traderEntry /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION traderEntry */

/* eslint-enable */

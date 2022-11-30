/* eslint-disable */
import { userPassword } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa';
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { surname } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa';
import { id_oc_userProfile } from '../UPT-DataModel/id-oc-userProfile.va';
import { pui } from '../UPT-DataModel/pui.oa';
import { userCredit } from '../UPT-DataModel/userCredit.oa';
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
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
export { surname } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa';
export { id_oc_userProfile } from '../UPT-DataModel/id-oc-userProfile.va';
export { pui } from '../UPT-DataModel/pui.oa';
export { userCredit } from '../UPT-DataModel/userCredit.oa';

/* START_OF_SYMBOL_DEFINITION userProfile */
/**
 * @summary userProfile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * userProfile OBJECT-CLASS ::= {
 *   MUST CONTAIN  {pui}
 *   MAY CONTAIN
 *     {description | commonName | surname | seeAlso | userCredit | userPassword
 *       | --as defined in Recommendation X.509
 *        specialPassword | variablePassword | allowedServiceFeatures |
 *       callInfoRecords | activeChargingService | nbOfFailedAuthentications}
 *   ID            id-oc-userProfile
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const userProfile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [pui] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        description,
        commonName,
        surname,
        seeAlso,
        userCredit,
        userPassword,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_userProfile /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION userProfile */

/* eslint-enable */

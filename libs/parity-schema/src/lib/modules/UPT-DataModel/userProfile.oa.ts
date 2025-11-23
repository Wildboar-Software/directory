/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
import { surname } from '@wildboar/x500/SelectedAttributeTypes';
import { id_oc_userProfile } from '../UPT-DataModel/id-oc-userProfile.va';
import { pui } from '../UPT-DataModel/pui.oa';
import { userCredit } from '../UPT-DataModel/userCredit.oa';
export { userPassword } from '@wildboar/x500/AuthenticationFramework';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { seeAlso } from '@wildboar/x500/SelectedAttributeTypes';
export { surname } from '@wildboar/x500/SelectedAttributeTypes';
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

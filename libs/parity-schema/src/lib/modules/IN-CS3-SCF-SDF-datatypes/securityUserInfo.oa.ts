/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { id_oc_securityUserInfo } from '../IN-CS3-object-identifiers/id-oc-securityUserInfo.va';
import { bindLevelIfOK } from '../IN-CS3-SCF-SDF-datatypes/bindLevelIfOK.oa';
import { currentList } from '../IN-CS3-SCF-SDF-datatypes/currentList.oa';
import { failureCounter } from '../IN-CS3-SCF-SDF-datatypes/failureCounter.oa';
import { identifierList } from '../IN-CS3-SCF-SDF-datatypes/identifierList.oa';
import { lockSession } from '../IN-CS3-SCF-SDF-datatypes/lockSession.oa';
import { maxAttempts } from '../IN-CS3-SCF-SDF-datatypes/maxAttempts.oa';
import { secretKey } from '../IN-CS3-SCF-SDF-datatypes/secretKey.oa';
import { securityFacilityId } from '../IN-CS3-SCF-SDF-datatypes/securityFacilityId.oa';
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
export { bindLevelIfOK } from '../IN-CS3-SCF-SDF-datatypes/bindLevelIfOK.oa';
export { currentList } from '../IN-CS3-SCF-SDF-datatypes/currentList.oa';
export { failureCounter } from '../IN-CS3-SCF-SDF-datatypes/failureCounter.oa';
export { identifierList } from '../IN-CS3-SCF-SDF-datatypes/identifierList.oa';
export { lockSession } from '../IN-CS3-SCF-SDF-datatypes/lockSession.oa';
export { maxAttempts } from '../IN-CS3-SCF-SDF-datatypes/maxAttempts.oa';
export { secretKey } from '../IN-CS3-SCF-SDF-datatypes/secretKey.oa';
export { securityFacilityId } from '../IN-CS3-SCF-SDF-datatypes/securityFacilityId.oa';

/* START_OF_SYMBOL_DEFINITION securityUserInfo */
/**
 * @summary securityUserInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * securityUserInfo OBJECT-CLASS ::= {
 *   MUST CONTAIN  {securityFacilityId | secretKey | identifierList}
 *   MAY CONTAIN
 *     {bindLevelIfOK | currentList | failureCounter | lockSession | maxAttempts}
 *   ID            id-oc-securityUserInfo
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const securityUserInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [
        securityFacilityId,
        secretKey,
        identifierList,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        bindLevelIfOK,
        currentList,
        failureCounter,
        lockSession,
        maxAttempts,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_securityUserInfo /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION securityUserInfo */

/* eslint-enable */

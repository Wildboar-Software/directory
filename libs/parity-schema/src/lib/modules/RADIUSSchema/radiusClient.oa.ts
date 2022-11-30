/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
import { radiusClientComment } from '../RADIUSSchema/radiusClientComment.oa';
import { radiusClientIdentifier } from '../RADIUSSchema/radiusClientIdentifier.oa';
import { radiusClientRequireMa } from '../RADIUSSchema/radiusClientRequireMa.oa';
import { radiusClientSecret } from '../RADIUSSchema/radiusClientSecret.oa';
import { radiusClientShortname } from '../RADIUSSchema/radiusClientShortname.oa';
import { radiusClientType } from '../RADIUSSchema/radiusClientType.oa';
import { radiusClientVirtualServer } from '../RADIUSSchema/radiusClientVirtualServer.oa';
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
export { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';
export { radiusClientComment } from '../RADIUSSchema/radiusClientComment.oa';
export { radiusClientIdentifier } from '../RADIUSSchema/radiusClientIdentifier.oa';
export { radiusClientRequireMa } from '../RADIUSSchema/radiusClientRequireMa.oa';
export { radiusClientSecret } from '../RADIUSSchema/radiusClientSecret.oa';
export { radiusClientShortname } from '../RADIUSSchema/radiusClientShortname.oa';
export { radiusClientType } from '../RADIUSSchema/radiusClientType.oa';
export { radiusClientVirtualServer } from '../RADIUSSchema/radiusClientVirtualServer.oa';

/* START_OF_SYMBOL_DEFINITION radiusClient */
/**
 * @summary radiusClient
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * radiusClient OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { radiusClientIdentifier | radiusClientSecret }
 *     MAY CONTAIN         {
 *         radiusClientShortname
 *         | radiusClientVirtualServer
 *         | radiusClientType
 *         | radiusClientRequireMa
 *         | radiusClientComment
 *     }
 *     LDAP-NAME           { "radiusClient" }
 *     LDAP-DESC           "radiusClient object class"
 *     ID                  { id-at-freeRadius 4 1 1 1 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const radiusClient: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        radiusClientIdentifier,
        radiusClientSecret,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        radiusClientShortname,
        radiusClientVirtualServer,
        radiusClientType,
        radiusClientRequireMa,
        radiusClientComment,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['radiusClient'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'radiusClient object class' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [4, 1, 1, 1, 1],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusClient */

/* eslint-enable */

/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { info } from '../Cosine/info.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
import { audio } from './audio.oa';
import { dITRedirect } from './dITRedirect.oa';
import { manager } from './manager.oa';
import { uniqueIdentifier } from './uniqueIdentifier.oa';
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
export { info } from '../Cosine/info.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION pilotObject */
/**
 * @summary pilotObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotObject OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     MAY CONTAIN {
 *         info
 *         -- | photo
 *         | manager
 *         | uniqueIdentifier
 *         -- | lastModifiedTime
 *         -- | lastModifiedBy
 *         | dITRedirect
 *         | audio
 *     }
 *     LDAP-NAME {"pilotObject"}
 *     LDAP-DESC "RFC1274: pilot object"
 *     ID { pilotObjectClass 3 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const pilotObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        info,
        manager,
        uniqueIdentifier,
        dITRedirect,
        audio,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC1274: pilot object' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [3],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotObject */

/* eslint-enable */

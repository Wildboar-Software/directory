/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { audio } from '../Cosine/audio.oa';
import { dITRedirect } from '../Cosine/dITRedirect.oa';
import { info } from '../Cosine/info.oa';
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
export { top } from '@wildboar/x500/InformationFramework';
export { audio } from '../Cosine/audio.oa';
export { dITRedirect } from '../Cosine/dITRedirect.oa';
export { info } from '../Cosine/info.oa';

/* START_OF_SYMBOL_DEFINITION pilotObject */
/**
 * @summary pilotObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * pilotObject OBJECT-CLASS ::= {
 *     SUBCLASS OF         {top}
 *     KIND                structural
 *     MAY CONTAIN         {
 *         audio
 *         | dITRedirect
 *         | info
 *         | jpegPhoto
 *         -- | lastModifiedBy
 *         -- | lastModifiedTime
 *         | manager
 *         -- | photo
 *         | uniqueIdentifier
 *     }
 *     LDAP-NAME           { "pilotObject" }
 *     ID                  { 0 9 2342 19200300 100 4 3 }
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
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        audio,
        dITRedirect,
        info,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['pilotObject'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        0, 9, 2342, 19200300, 100, 4, 3,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION pilotObject */

/* eslint-enable */

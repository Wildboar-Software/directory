/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { calCalAdrURI } from '../RFC2739Calendar/calCalAdrURI.oa';
import { calCalURI } from '../RFC2739Calendar/calCalURI.oa';
import { calCAPURI } from '../RFC2739Calendar/calCAPURI.oa';
import { calFBURL } from '../RFC2739Calendar/calFBURL.oa';
import { calOtherCalAdrURIs } from '../RFC2739Calendar/calOtherCalAdrURIs.oa';
import { calOtherCalURIs } from '../RFC2739Calendar/calOtherCalURIs.oa';
import { calOtherFBURLs } from '../RFC2739Calendar/calOtherFBURLs.oa';
import { msoc } from '../RFC2739Calendar/msoc.va';
import { calOtherCAPURIs } from './calOtherCAPURIs.oa';
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
export { calCalAdrURI } from '../RFC2739Calendar/calCalAdrURI.oa';
export { calCalURI } from '../RFC2739Calendar/calCalURI.oa';
export { calCAPURI } from '../RFC2739Calendar/calCAPURI.oa';
export { calFBURL } from '../RFC2739Calendar/calFBURL.oa';
export { calOtherCalAdrURIs } from '../RFC2739Calendar/calOtherCalAdrURIs.oa';
export { calOtherCalURIs } from '../RFC2739Calendar/calOtherCalURIs.oa';
export { calOtherFBURLs } from '../RFC2739Calendar/calOtherFBURLs.oa';
export { msoc } from '../RFC2739Calendar/msoc.va';

/* START_OF_SYMBOL_DEFINITION calEntry */
/**
 * @summary calEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * calEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MAY CONTAIN {
 *         calCalURI
 *         | calFBURL
 *         | calCAPURI
 *         | calCalAdrURI
 *         | calOtherCalURIs
 *         | calOtherFBURLs
 *         | calOtherCAPURIs
 *         | calOtherCalAdrURIs
 *     }
 *     LDAP-NAME       {"calEntry"}
 *     LDAP-DESC       "Calendering and free/busy information"
 *     ID              { msoc 87 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const calEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        calCalURI,
        calFBURL,
        calCAPURI,
        calCalAdrURI,
        calOtherCalURIs,
        calOtherFBURLs,
        calOtherCAPURIs,
        calOtherCalAdrURIs,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['calEntry'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Calendering and free/busy information' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [87],
        msoc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION calEntry */

/* eslint-enable */

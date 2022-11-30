/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
import { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
import { fedfsFslUuid } from '../FedFSSchema/fedfsFslUuid.oa';
import { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';
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
export { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
export { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
export { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
export { fedfsFslUuid } from '../FedFSSchema/fedfsFslUuid.oa';
export { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';

/* START_OF_SYMBOL_DEFINITION fedfsFsl */
/**
 * @summary fedfsFsl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsFsl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {fedfsFslUuid | fedfsFsnUuid}
 *     MAY CONTAIN     {fedfsAnnotation | fedfsDescr}
 *     LDAP-NAME       {"fedfsFsl"}
 *     LDAP-DESC       "A physical location of a fileset"
 *     ID              { daniel-ellard 1 1003 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const fedfsFsl: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        fedfsFslUuid,
        fedfsFsnUuid,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        fedfsAnnotation,
        fedfsDescr,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsFsl'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A physical location of a fileset' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [1, 1003],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsl */

/* eslint-enable */

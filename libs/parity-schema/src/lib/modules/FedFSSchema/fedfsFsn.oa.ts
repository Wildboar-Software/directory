/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
import { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
import { fedfsFsnTTL } from '../FedFSSchema/fedfsFsnTTL.oa';
import { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';
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
export { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
export { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
export { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
export { fedfsFsnTTL } from '../FedFSSchema/fedfsFsnTTL.oa';
export { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';

/* START_OF_SYMBOL_DEFINITION fedfsFsn */
/**
 * @summary fedfsFsn
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsFsn OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {fedfsFsnUuid | fedfsFsnTTL}
 *     MAY CONTAIN     {fedfsAnnotation | fedfsDescr}
 *     LDAP-NAME       {"fedfsFsn"}
 *     LDAP-DESC       "Represents a fileset"
 *     ID              { daniel-ellard 1 1002 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const fedfsFsn: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        fedfsFsnUuid,
        fedfsFsnTTL,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        fedfsAnnotation,
        fedfsDescr,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsFsn'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Represents a fileset' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 1002],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsn */

/* eslint-enable */

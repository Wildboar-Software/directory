/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
import { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
import { fedfsNceDN } from '../FedFSSchema/fedfsNceDN.oa';
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
export { fedfsNceDN } from '../FedFSSchema/fedfsNceDN.oa';

/* START_OF_SYMBOL_DEFINITION fedfsNsdbContainerInfo */
/**
 * @summary fedfsNsdbContainerInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsNsdbContainerInfo OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {fedfsNceDN}
 *     MAY CONTAIN     {fedfsAnnotation | fedfsDescr}
 *     LDAP-NAME       {"fedfsNsdbContainerInfo"}
 *     LDAP-DESC       "Describes NCE location"
 *     ID              { daniel-ellard 1 1001 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const fedfsNsdbContainerInfo: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [fedfsNceDN] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        fedfsAnnotation,
        fedfsDescr,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsNsdbContainerInfo'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Describes NCE location' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 1001],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsNsdbContainerInfo */

/* eslint-enable */

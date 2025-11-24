/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';


/* START_OF_SYMBOL_DEFINITION uidObject */
/**
 * @summary uidObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uidObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {uid}
 *     LDAP-NAME       {"uidObject"}
 *     LDAP-DESC       "RFC2377: uid object"
 *     ID              { 1 3 6 1 1 3 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uidObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uidObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'RFC2377: uid object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 1, 3, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uidObject */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { javaClassName } from '../Java/javaClassName.oa';
import { javaClassNames } from '../Java/javaClassNames.oa';
import { javaCodebase } from '../Java/javaCodebase.oa';
import { javaDoc } from '../Java/javaDoc.oa';


/* START_OF_SYMBOL_DEFINITION javaObject */
/**
 * @summary javaObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * javaObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {javaClassName}
 *     MAY CONTAIN     {javaClassNames | javaCodebase | javaDoc | description}
 *     LDAP-NAME       {"javaObject"}
 *     LDAP-DESC       "Java object representation"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const javaObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [javaClassName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        javaClassNames,
        javaCodebase,
        javaDoc,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['javaObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Java object representation' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 4,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION javaObject */

/* eslint-enable */

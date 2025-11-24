/* eslint-disable */
import { alias } from '@wildboar/x500/InformationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { id_oc_userProfileAlias } from '../UPT-DataModel/id-oc-userProfileAlias.va';
import { uptNumber } from '../UPT-DataModel/uptNumber.oa';


/* START_OF_SYMBOL_DEFINITION userProfileAlias */
/**
 * @summary userProfileAlias
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * userProfileAlias OBJECT-CLASS ::= {
 *   SUBCLASS OF   {alias}
 *   MUST CONTAIN  {uptNumber}
 *   MAY CONTAIN   {description}
 *   ID            id-oc-userProfileAlias
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const userProfileAlias: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [alias] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uptNumber] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_userProfileAlias /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION userProfileAlias */

/* eslint-enable */

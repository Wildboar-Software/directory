/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { organization } from '@wildboar/x500/SelectedObjectClasses';
import { id_oc_uptProvider } from '../UPT-DataModel/id-oc-uptProvider.va';
import { providerId } from '../UPT-DataModel/providerId.oa';


/* START_OF_SYMBOL_DEFINITION uptProvider */
/**
 * @summary uptProvider
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uptProvider OBJECT-CLASS ::= {
 *   SUBCLASS OF   {organization}
 *   MUST CONTAIN  {providerId}
 *   MAY CONTAIN   {description}
 *   ID            id-oc-uptProvider
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const uptProvider: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organization] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [providerId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_uptProvider /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uptProvider */

/* eslint-enable */

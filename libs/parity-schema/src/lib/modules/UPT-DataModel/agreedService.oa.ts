/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { id_oc_agreement } from '../UPT-DataModel/id-oc-agreement.va';
import { providedLocations } from '../UPT-DataModel/providedLocations.oa';
import { providedServiceId } from '../UPT-DataModel/providedServiceId.oa';


/* START_OF_SYMBOL_DEFINITION agreedService */
/**
 * @summary agreedService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * agreedService OBJECT-CLASS ::= {
 *   MUST CONTAIN  {providedServiceId}
 *   MAY CONTAIN   {providedLocations | description}
 *   ID            id-oc-agreement
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const agreedService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [providedServiceId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        providedLocations,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_agreement /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION agreedService */

/* eslint-enable */

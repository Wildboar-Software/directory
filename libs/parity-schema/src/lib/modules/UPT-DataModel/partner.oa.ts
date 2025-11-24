/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { id_oc_partner } from '../UPT-DataModel/id-oc-partner.va';
import { providerId } from '../UPT-DataModel/providerId.oa';


/* START_OF_SYMBOL_DEFINITION partner */
/**
 * @summary partner
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * partner OBJECT-CLASS ::= {
 *   MUST CONTAIN  {providerId}
 *   MAY CONTAIN   {description}
 *   ID            id-oc-partner
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const partner: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [providerId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_partner /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION partner */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { allowedDestinations } from '../UPT-DataModel/allowedDestinations.oa';
import { id_oc_callingUptUser } from '../UPT-DataModel/id-oc-callingUptUser.va';


/* START_OF_SYMBOL_DEFINITION callingUptUser */
/**
 * @summary callingUptUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * callingUptUser OBJECT-CLASS ::= {
 *   MUST CONTAIN  {name | allowedDestinations
 *                   -- callRecords??--}
 *   MAY CONTAIN   {description}
 *   ID            id-oc-callingUptUser
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const callingUptUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&MandatoryAttributes': [
        name,
        allowedDestinations,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_callingUptUser /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION callingUptUser */

/* eslint-enable */

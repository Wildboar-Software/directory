/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { organizationalUnit } from '@wildboar/x500/SelectedObjectClasses';
import { id_oc_administrativeUnit } from '../UPT-DataModel/id-oc-administrativeUnit.va';


/* START_OF_SYMBOL_DEFINITION administrativeUnit */
/**
 * @summary administrativeUnit
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * administrativeUnit OBJECT-CLASS ::= {
 *   SUBCLASS OF  {organizationalUnit}
 *   ID           id-oc-administrativeUnit
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const administrativeUnit: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [organizationalUnit] /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_administrativeUnit /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION administrativeUnit */

/* eslint-enable */

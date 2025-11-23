/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { integerMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_at_providedServiceId } from '../UPT-DataModel/id-at-providedServiceId.va';
import {
    Service,
    _decode_Service,
    _encode_Service,
} from '../UPT-DataModel/Service.ta';

/* START_OF_SYMBOL_DEFINITION providedServiceId */
/**
 * @summary providedServiceId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * providedServiceId ATTRIBUTE ::= {
 *   WITH SYNTAX             Service
 *   EQUALITY MATCHING RULE  integerMatch
 *   SINGLE VALUE            TRUE
 *   ID                      id-at-providedServiceId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<Service>}
 * @implements {ATTRIBUTE<Service>}
 */
export const providedServiceId: ATTRIBUTE<Service> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_Service,
    },
    encoderFor: {
        '&Type': _encode_Service,
    },
    '&equality-match': integerMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_at_providedServiceId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION providedServiceId */

/* eslint-enable */

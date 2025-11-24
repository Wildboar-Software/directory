/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { id_trader_oc_interfaceEntry } from '../TraderDefinitions/id-trader-oc-interfaceEntry.va';
import { interfaceReference } from '../TraderDefinitions/interfaceReference.oa';
import { interfaceType } from '../TraderDefinitions/interfaceType.oa';


/* START_OF_SYMBOL_DEFINITION interfaceEntry */
/**
 * @summary interfaceEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * interfaceEntry OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   KIND          auxiliary
 *   MUST CONTAIN  {interfaceReference | interfaceType}
 *   ID            id-trader-oc-interfaceEntry
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const interfaceEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        interfaceReference,
        interfaceType,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_interfaceEntry /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION interfaceEntry */

/* eslint-enable */

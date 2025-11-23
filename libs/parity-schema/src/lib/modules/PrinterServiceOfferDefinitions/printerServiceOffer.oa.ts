/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { colourCapable } from '../PrinterServiceOfferDefinitions/colourCapable.oa';
import { costPerPage } from '../PrinterServiceOfferDefinitions/costPerPage.oa';
import { dotsPerInch } from '../PrinterServiceOfferDefinitions/dotsPerInch.oa';
import { driverName } from '../PrinterServiceOfferDefinitions/driverName.oa';
import { id_trader_oc_serviceOffer_printer } from '../PrinterServiceOfferDefinitions/id-trader-oc-serviceOffer-printer.va';
import { languagesSupported } from '../PrinterServiceOfferDefinitions/languagesSupported.oa';
import { locationBuilding } from '../PrinterServiceOfferDefinitions/locationBuilding.oa';
import { locationRoom } from '../PrinterServiceOfferDefinitions/locationRoom.oa';
import { pageSize } from '../PrinterServiceOfferDefinitions/pageSize.oa';
import { pagesPerMinute } from '../PrinterServiceOfferDefinitions/pagesPerMinute.oa';
import { printerType } from '../PrinterServiceOfferDefinitions/printerType.oa';
import { queueLength } from '../PrinterServiceOfferDefinitions/queueLength.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/InformationFramework';
export { top } from '@wildboar/x500/InformationFramework';
export { colourCapable } from '../PrinterServiceOfferDefinitions/colourCapable.oa';
export { costPerPage } from '../PrinterServiceOfferDefinitions/costPerPage.oa';
export { dotsPerInch } from '../PrinterServiceOfferDefinitions/dotsPerInch.oa';
export { driverName } from '../PrinterServiceOfferDefinitions/driverName.oa';
export { id_trader_oc_serviceOffer_printer } from '../PrinterServiceOfferDefinitions/id-trader-oc-serviceOffer-printer.va';
export { languagesSupported } from '../PrinterServiceOfferDefinitions/languagesSupported.oa';
export { locationBuilding } from '../PrinterServiceOfferDefinitions/locationBuilding.oa';
export { locationRoom } from '../PrinterServiceOfferDefinitions/locationRoom.oa';
export { pageSize } from '../PrinterServiceOfferDefinitions/pageSize.oa';
export { pagesPerMinute } from '../PrinterServiceOfferDefinitions/pagesPerMinute.oa';
export { printerType } from '../PrinterServiceOfferDefinitions/printerType.oa';
export { queueLength } from '../PrinterServiceOfferDefinitions/queueLength.oa';

/* START_OF_SYMBOL_DEFINITION printerServiceOffer */
/**
 * @summary printerServiceOffer
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printerServiceOffer OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   KIND          auxiliary
 *   MUST CONTAIN  {printerType}
 *   MAY CONTAIN
 *     {locationRoom | locationBuilding | costPerPage | languagesSupported |
 *       pagesPerMinute | pageSize | dotsPerInch | colourCapable | driverName |
 *       queueLength}
 *   ID            id-trader-oc-serviceOffer-printer
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const printerServiceOffer: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [printerType] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        locationRoom,
        locationBuilding,
        costPerPage,
        languagesSupported,
        pagesPerMinute,
        pageSize,
        dotsPerInch,
        colourCapable,
        driverName,
        queueLength,
    ] /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_oc_serviceOffer_printer /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerServiceOffer */

/* eslint-enable */

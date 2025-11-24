/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { distinguishedName } from '@wildboar/x500/SelectedAttributeTypes';
import { id_trader_at_proxyLookUpInterfaceId } from '../TraderDefinitions/id-trader-at-proxyLookUpInterfaceId.va';


/* START_OF_SYMBOL_DEFINITION proxyLookUpInterfaceId */
/**
 * @summary proxyLookUpInterfaceId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * proxyLookUpInterfaceId ATTRIBUTE ::= {
 *   SUBTYPE OF    distinguishedName
 *   SINGLE VALUE  TRUE
 *   ID            id-trader-at-proxyLookUpInterfaceId
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const proxyLookUpInterfaceId: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': distinguishedName /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_proxyLookUpInterfaceId /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION proxyLookUpInterfaceId */

/* eslint-enable */

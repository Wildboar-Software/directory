/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseExactMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_trader_at_interfaceReference } from '../TraderDefinitions/id-trader-at-interfaceReference.va';
import {
    InterfaceId,
    _decode_InterfaceId,
    _encode_InterfaceId,
} from '../TraderDefinitions/InterfaceId.ta';

/* START_OF_SYMBOL_DEFINITION interfaceReference */
/**
 * @summary interfaceReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * interfaceReference ATTRIBUTE ::= {
 *   WITH SYNTAX             InterfaceId
 *   EQUALITY MATCHING RULE  caseExactMatch
 *   ID                      id-trader-at-interfaceReference
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<InterfaceId>}
 * @implements {ATTRIBUTE<InterfaceId>}
 */
export const interfaceReference: ATTRIBUTE<InterfaceId> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_InterfaceId,
    },
    encoderFor: {
        '&Type': _encode_InterfaceId,
    },
    '&equality-match': caseExactMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_interfaceReference /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION interfaceReference */

/* eslint-enable */

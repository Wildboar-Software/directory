/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { objectIdentifierMatch } from '@wildboar/x500/InformationFramework';
import { id_trader_at_interfaceType } from '../TraderDefinitions/id-trader-at-interfaceType.va';
import {
    InterfaceTypeName,
    _decode_InterfaceTypeName,
    _encode_InterfaceTypeName,
} from '../TraderDefinitions/InterfaceTypeName.ta';

/* START_OF_SYMBOL_DEFINITION interfaceType */
/**
 * @summary interfaceType
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * interfaceType ATTRIBUTE ::= {
 *   WITH SYNTAX             InterfaceTypeName
 *   EQUALITY MATCHING RULE  objectIdentifierMatch
 *   ID                      id-trader-at-interfaceType
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<InterfaceTypeName>}
 * @implements {ATTRIBUTE<InterfaceTypeName>}
 */
export const interfaceType: ATTRIBUTE<InterfaceTypeName> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_InterfaceTypeName,
    },
    encoderFor: {
        '&Type': _encode_InterfaceTypeName,
    },
    '&equality-match': objectIdentifierMatch /* OBJECT_FIELD_SETTING */,
    '&id': id_trader_at_interfaceType /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION interfaceType */

/* eslint-enable */

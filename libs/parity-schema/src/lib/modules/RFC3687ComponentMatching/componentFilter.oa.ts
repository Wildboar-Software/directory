/* eslint-disable */
import { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
import {
    ComponentFilter,
    _decode_ComponentFilter,
    _encode_ComponentFilter,
} from '../RFC3687ComponentMatching/ComponentFilter.ta';
import { id_lsx_componentFilter } from '../RFC3687ComponentMatching/id-lsx-componentFilter.va';

/* START_OF_SYMBOL_DEFINITION componentFilter */
/**
 * @summary componentFilter
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * componentFilter SYNTAX-NAME ::= {
 *     LDAP-DESC               "ComponentFilter"
 *     DIRECTORY SYNTAX        ComponentFilter
 *     ID                      id-lsx-componentFilter
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME}
 * @implements {SYNTAX_NAME}
 */
export const componentFilter: SYNTAX_NAME<ComponentFilter> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_ComponentFilter,
    },
    encoderFor: {
        '&Type': _encode_ComponentFilter,
    },
    '&Type': 0 as never,
    '&id': id_lsx_componentFilter,
    '&ldapDesc': 'ComponentFilter',
};
/* END_OF_SYMBOL_DEFINITION componentFilter */

/* eslint-enable */

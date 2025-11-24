/* eslint-disable */
import type { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
import {
    type UUID,
    _decode_UUID,
    _encode_UUID,
} from '@wildboar/x500/SelectedAttributeTypes';
import { id_lsx_uuid } from '../UUID/id-lsx-uuid.va';


/* START_OF_SYMBOL_DEFINITION uuid */
/**
 * @summary uuid
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uuid SYNTAX-NAME ::= {
 *     LDAP-DESC               "UUID"
 *     DIRECTORY SYNTAX        UUID
 *     ID                      id-lsx-uuid
 * }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME<UUID>}
 * @implements {SYNTAX_NAME<UUID>}
 */
export const uuid: SYNTAX_NAME<UUID> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_UUID,
    },
    encoderFor: {
        '&Type': _encode_UUID,
    },
    '&ldapDesc': 'UUID' /* OBJECT_FIELD_SETTING */,
    '&id': id_lsx_uuid /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uuid */

/* eslint-enable */

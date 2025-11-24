/* eslint-disable */
import type { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import {
    BootParameterSyntax,
    _decode_BootParameterSyntax,
    _encode_BootParameterSyntax,
} from '../NIS/BootParameterSyntax.ta';
import { id_nis_lsx } from '../NIS/id-nis-lsx.va';
export {
    BootParameterSyntax,
    _decode_BootParameterSyntax,
    _encode_BootParameterSyntax,
} from '../NIS/BootParameterSyntax.ta';

/* START_OF_SYMBOL_DEFINITION bootParameterSyntax */
/**
 * @summary bootParameterSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * bootParameterSyntax SYNTAX-NAME ::= {
 *     LDAP-DESC         "Boot parameter"
 *     DIRECTORY SYNTAX  BootParameterSyntax
 *     ID                { id-nis-lsx 1 } }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME<BootParameterSyntax>}
 * @implements {SYNTAX_NAME<BootParameterSyntax>}
 */
export const bootParameterSyntax: SYNTAX_NAME<BootParameterSyntax> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_BootParameterSyntax,
    },
    encoderFor: {
        '&Type': _encode_BootParameterSyntax,
    },
    '&ldapDesc': 'Boot parameter' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        id_nis_lsx
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION bootParameterSyntax */

/* eslint-enable */

/* eslint-disable */
import type { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_lsx } from '../NIS/id-nis-lsx.va';
import {
    NISNetgroupTripleSyntax,
    _decode_NISNetgroupTripleSyntax,
    _encode_NISNetgroupTripleSyntax,
} from '../NIS/NISNetgroupTripleSyntax.ta';
export {
    NISNetgroupTripleSyntax,
    _decode_NISNetgroupTripleSyntax,
    _encode_NISNetgroupTripleSyntax,
} from '../NIS/NISNetgroupTripleSyntax.ta';

/* START_OF_SYMBOL_DEFINITION nisNetgroupTripleSyntax */
/**
 * @summary nisNetgroupTripleSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisNetgroupTripleSyntax SYNTAX-NAME ::= {
 *     LDAP-DESC         "NIS netgroup triple"
 *     DIRECTORY SYNTAX  NISNetgroupTripleSyntax
 *     ID                { id-nis-lsx 0 } }
 * ```
 *
 * @constant
 * @type {SYNTAX_NAME<NISNetgroupTripleSyntax>}
 * @implements {SYNTAX_NAME<NISNetgroupTripleSyntax>}
 */
export const nisNetgroupTripleSyntax: SYNTAX_NAME<NISNetgroupTripleSyntax> = {
    class: 'SYNTAX-NAME',
    decoderFor: {
        '&Type': _decode_NISNetgroupTripleSyntax,
    },
    encoderFor: {
        '&Type': _encode_NISNetgroupTripleSyntax,
    },
    '&ldapDesc': 'NIS netgroup triple' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [0],
        id_nis_lsx
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisNetgroupTripleSyntax */

/* eslint-enable */

/* eslint-disable */
import { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
import {
    DkgExtensionDataSyntax,
    _decode_DkgExtensionDataSyntax,
    _encode_DkgExtensionDataSyntax,
} from '../TAI/DkgExtensionDataSyntax.ta';
import { id_tai_ce_dgkExtensionData } from '../TAI/id-tai-ce-dgkExtensionData.va';
export { EXTENSION } from '@wildboar/x500/src/lib/modules/AuthenticationFramework/EXTENSION.oca';
export {
    DkgExtensionDataSyntax,
    _decode_DkgExtensionDataSyntax,
    _encode_DkgExtensionDataSyntax,
} from '../TAI/DkgExtensionDataSyntax.ta';
export { id_tai_ce_dgkExtensionData } from '../TAI/id-tai-ce-dgkExtensionData.va';

/* START_OF_SYMBOL_DEFINITION dkgExtensionData */
/**
 * @summary dkgExtensionData
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * dkgExtensionData EXTENSION ::= {
 *   SYNTAX         DkgExtensionDataSyntax
 *   IDENTIFIED BY  id-tai-ce-dgkExtensionData
 * }
 * ```
 *
 * @constant
 * @type {EXTENSION<DkgExtensionDataSyntax>}
 * @implements {EXTENSION<DkgExtensionDataSyntax>}
 */
export const dkgExtensionData: EXTENSION<DkgExtensionDataSyntax> = {
    class: 'EXTENSION',
    decoderFor: {
        '&ExtnType': _decode_DkgExtensionDataSyntax,
    },
    encoderFor: {
        '&ExtnType': _encode_DkgExtensionDataSyntax,
    },
    '&id': id_tai_ce_dgkExtensionData /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&ExtnType':
        0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION dkgExtensionData */

/* eslint-enable */

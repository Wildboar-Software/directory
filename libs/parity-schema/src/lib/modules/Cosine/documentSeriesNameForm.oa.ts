/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { documentSeries } from '../Cosine/documentSeries.oa';
import { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION documentSeriesNameForm */
/**
 * @summary documentSeriesNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * documentSeriesNameForm NAME-FORM ::= {
 *     NAMES                documentSeries
 *     WITH ATTRIBUTES        {commonName}
 *     LDAP-NAME            {"documentSeriesNameForm"}
 *     ID                    { id-nf 56 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const documentSeriesNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': documentSeries /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['documentSeriesNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [56],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION documentSeriesNameForm */

/* eslint-enable */

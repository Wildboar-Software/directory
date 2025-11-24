/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { fedfsFsn } from '../FedFSSchema/fedfsFsn.oa';
import { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';
import { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION fedfsFsnNameForm */
/**
 * @summary fedfsFsnNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsFsnNameForm NAME-FORM ::= {
 *     NAMES                fedfsFsn
 *     WITH ATTRIBUTES        {fedfsFsnUuid}
 *     LDAP-NAME            {"fedfsFsnNameForm"}
 *     ID                    { id-nf 8 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const fedfsFsnNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': fedfsFsn /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [fedfsFsnUuid] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsFsnNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [8],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsnNameForm */

/* eslint-enable */

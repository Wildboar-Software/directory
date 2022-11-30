/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { fedfsFsn } from '../FedFSSchema/fedfsFsn.oa';
import { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { fedfsFsn } from '../FedFSSchema/fedfsFsn.oa';
export { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';
export { id_nf } from '../Wildboar/id-nf.va';

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
    '&id': new _OID(
        [8],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsnNameForm */

/* eslint-enable */

/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { fedfsFslUuid } from '../FedFSSchema/fedfsFslUuid.oa';
import { fedfsNfsFsl } from '../FedFSSchema/fedfsNfsFsl.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { fedfsFslUuid } from '../FedFSSchema/fedfsFslUuid.oa';
export { fedfsNfsFsl } from '../FedFSSchema/fedfsNfsFsl.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION fedfsNfsFslNameForm */
/**
 * @summary fedfsNfsFslNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsNfsFslNameForm NAME-FORM ::= {
 *     NAMES                fedfsNfsFsl
 *     WITH ATTRIBUTES        {fedfsFslUuid}
 *     LDAP-NAME            {"fedfsNfsFslNameForm"}
 *     ID                    { id-nf 9 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const fedfsNfsFslNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': fedfsNfsFsl /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [fedfsFslUuid] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsNfsFslNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [9],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsNfsFslNameForm */

/* eslint-enable */

/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { provider } from '../RFC6109CertifiedElectronicMail/provider.oa';
import { providerName } from '../RFC6109CertifiedElectronicMail/providerName.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { provider } from '../RFC6109CertifiedElectronicMail/provider.oa';
export { providerName } from '../RFC6109CertifiedElectronicMail/providerName.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION providerNameForm */
/**
 * @summary providerNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * providerNameForm NAME-FORM ::= {
 *     NAMES                provider
 *     WITH ATTRIBUTES        {providerName}
 *     LDAP-NAME            {"providerNameForm"}
 *     ID                    { id-nf 7 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const providerNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': provider /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [providerName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['providerNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [7],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION providerNameForm */

/* eslint-enable */

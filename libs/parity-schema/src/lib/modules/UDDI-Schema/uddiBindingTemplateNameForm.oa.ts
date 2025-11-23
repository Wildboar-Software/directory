/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiBindingKey } from '../UDDI-Schema/uddiBindingKey.oa';
import { uddiBindingTemplate } from '../UDDI-Schema/uddiBindingTemplate.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiBindingKey } from '../UDDI-Schema/uddiBindingKey.oa';
export { uddiBindingTemplate } from '../UDDI-Schema/uddiBindingTemplate.oa';

/* START_OF_SYMBOL_DEFINITION uddiBindingTemplateNameForm */
/**
 * @summary uddiBindingTemplateNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBindingTemplateNameForm NAME-FORM ::= {
 *     NAMES               uddiBindingTemplate
 *     WITH ATTRIBUTES     { uddiBindingKey }
 *     LDAP-NAME           {"uddiBindingTemplateNameForm"}
 *     ID                  { id-uddi 15 5 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiBindingTemplateNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiBindingTemplate /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiBindingKey] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBindingTemplateNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 5],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBindingTemplateNameForm */

/* eslint-enable */

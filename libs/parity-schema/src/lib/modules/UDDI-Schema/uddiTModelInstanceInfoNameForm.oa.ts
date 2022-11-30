/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiTModelInstanceInfo } from '../UDDI-Schema/uddiTModelInstanceInfo.oa';
import { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiTModelInstanceInfo } from '../UDDI-Schema/uddiTModelInstanceInfo.oa';
export { uddiTModelKey } from '../UDDI-Schema/uddiTModelKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiTModelInstanceInfoNameForm */
/**
 * @summary uddiTModelInstanceInfoNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiTModelInstanceInfoNameForm NAME-FORM ::= {
 *     NAMES               uddiTModelInstanceInfo
 *     WITH ATTRIBUTES     { uddiTModelKey }
 *     LDAP-NAME           {"uddiTModelInstanceInfoNameForm"}
 *     ID                  { id-uddi 15 6 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiTModelInstanceInfoNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiTModelInstanceInfo /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiTModelKey] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiTModelInstanceInfoNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [15, 6],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiTModelInstanceInfoNameForm */

/* eslint-enable */

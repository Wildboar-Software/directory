/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiBusinessEntity } from '../UDDI-Schema/uddiBusinessEntity.oa';
import { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { id_uddi } from '../UDDI-Schema/id-uddi.va';
export { uddiBusinessEntity } from '../UDDI-Schema/uddiBusinessEntity.oa';
export { uddiBusinessKey } from '../UDDI-Schema/uddiBusinessKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiBusinessEntityNameForm */
/**
 * @summary uddiBusinessEntityNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessEntityNameForm NAME-FORM ::= {
 *     NAMES               uddiBusinessEntity
 *     WITH ATTRIBUTES     { uddiBusinessKey }
 *     LDAP-NAME           {"uddiBusinessEntityNameForm"}
 *     ID                  { id-uddi 15 1 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiBusinessEntityNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiBusinessEntity /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiBusinessKey] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBusinessEntityNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 1],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessEntityNameForm */

/* eslint-enable */

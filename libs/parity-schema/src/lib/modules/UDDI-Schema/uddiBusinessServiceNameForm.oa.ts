/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';
import { uddiBusinessService } from '../UDDI-Schema/uddiBusinessService.oa';
import { uddiServiceKey } from '../UDDI-Schema/uddiServiceKey.oa';

/* START_OF_SYMBOL_DEFINITION uddiBusinessServiceNameForm */
/**
 * @summary uddiBusinessServiceNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiBusinessServiceNameForm NAME-FORM ::= {
 *     NAMES               uddiBusinessService
 *     WITH ATTRIBUTES     { uddiServiceKey }
 *     LDAP-NAME           {"uddiBusinessServiceNameForm"}
 *     ID                  { id-uddi 15 4 } }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const uddiBusinessServiceNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': uddiBusinessService /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uddiServiceKey] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiBusinessServiceNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [15, 4],
        id_uddi
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION uddiBusinessServiceNameForm */

/* eslint-enable */

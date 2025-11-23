/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { printer_name } from '../RFC7612Printer/printer-name.oa';
import { printer_uuid } from '../RFC7612Printer/printer-uuid.oa';
import { printerService } from '../RFC7612Printer/printerService.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { printer_name } from '../RFC7612Printer/printer-name.oa';
export { printer_uuid } from '../RFC7612Printer/printer-uuid.oa';
export { printerService } from '../RFC7612Printer/printerService.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION printerServiceNameForm */
/**
 * @summary printerServiceNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * printerServiceNameForm NAME-FORM ::= {
 *     NAMES               printerService
 *     WITH ATTRIBUTES     {printer-name} -- Comes from the parent abstract class.
 *     AND OPTIONALLY      {printer-uuid}
 *     LDAP-NAME           {"printerServiceNameForm"}
 *     LDAP-DESC           "Name form for a printer service."
 *     ID                  { id-nf 4 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const printerServiceNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': printerService /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [printer_name] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [printer_uuid] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['printerServiceNameForm'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Name form for a printer service.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION printerServiceNameForm */

/* eslint-enable */

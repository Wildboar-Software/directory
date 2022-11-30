/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { textTableEntry } from '../TableFramework/textTableEntry.oa';
import { textTableKey } from '../TableFramework/textTableKey.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { textTableEntry } from '../TableFramework/textTableEntry.oa';
export { textTableKey } from '../TableFramework/textTableKey.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION textTableEntryNameForm */
/**
 * @summary textTableEntryNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * textTableEntryNameForm NAME-FORM ::= {
 *     NAMES               textTableEntry
 *     WITH ATTRIBUTES     {textTableKey}
 *     LDAP-NAME           {"textTableEntryNameForm"}
 *     LDAP-DESC           "Name form for a text table entry."
 *     ID                  { id-nf 6 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const textTableEntryNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': textTableEntry /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [textTableKey] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['textTableEntryNameForm'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Name form for a text table entry.' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION textTableEntryNameForm */

/* eslint-enable */

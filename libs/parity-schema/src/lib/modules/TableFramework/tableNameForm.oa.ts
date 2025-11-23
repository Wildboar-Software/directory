/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { table } from '../TableFramework/table.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { table } from '../TableFramework/table.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION tableNameForm */
/**
 * @summary tableNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * tableNameForm NAME-FORM ::= {
 *     NAMES               table
 *     WITH ATTRIBUTES     {commonName}
 *     LDAP-NAME           {"tableNameForm"}
 *     LDAP-DESC           "Name form for a table."
 *     ID                  { id-nf 5 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const tableNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': table /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['tableNameForm'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Name form for a table.' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [5],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION tableNameForm */

/* eslint-enable */

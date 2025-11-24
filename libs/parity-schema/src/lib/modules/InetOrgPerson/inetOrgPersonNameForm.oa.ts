/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { inetOrgPerson } from '../InetOrgPerson/inetOrgPerson.oa';
import { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION inetOrgPersonNameForm */
/**
 * @summary inetOrgPersonNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * inetOrgPersonNameForm NAME-FORM ::= {
 *     NAMES                inetOrgPerson
 *     WITH ATTRIBUTES        {commonName}
 *     LDAP-NAME            {"inetOrgPersonNameForm"}
 *     ID                    { id-nf 10 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const inetOrgPersonNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': inetOrgPerson /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['inetOrgPersonNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [10],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION inetOrgPersonNameForm */

/* eslint-enable */

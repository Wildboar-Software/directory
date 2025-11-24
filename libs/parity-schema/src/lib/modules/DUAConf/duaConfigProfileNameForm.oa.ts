/* eslint-disable */
import type { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { duaConfigProfile } from '../DUAConf/duaConfigProfile.oa';
import { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION duaConfigProfileNameForm */
/**
 * @summary duaConfigProfileNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * duaConfigProfileNameForm NAME-FORM ::= {
 *     NAMES                duaConfigProfile
 *     WITH ATTRIBUTES        {commonName}
 *     LDAP-NAME            {"duaConfigProfileNameForm"}
 *     ID                    { id-nf 3 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const duaConfigProfileNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': duaConfigProfile /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['duaConfigProfileNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [3],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION duaConfigProfileNameForm */

/* eslint-enable */

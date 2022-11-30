/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { account } from '../Cosine/account.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { uid } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa';
export { account } from '../Cosine/account.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION accountNameForm */
/**
 * @summary accountNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * accountNameForm NAME-FORM ::= {
 *     NAMES                account
 *     WITH ATTRIBUTES        {uid}
 *     LDAP-NAME            {"accountNameForm"}
 *     ID                    { id-nf 53 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const accountNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': account /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [uid] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['accountNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [53],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION accountNameForm */

/* eslint-enable */

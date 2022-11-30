/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { document } from '../Cosine/document.oa';
import { documentIdentifier } from '../Cosine/documentIdentifier.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { document } from '../Cosine/document.oa';
export { documentIdentifier } from '../Cosine/documentIdentifier.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION documentNameForm */
/**
 * @summary documentNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * documentNameForm NAME-FORM ::= {
 *     NAMES                document
 *     WITH ATTRIBUTES        {documentIdentifier}
 *     LDAP-NAME            {"documentNameForm"}
 *     ID                    { id-nf 54 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const documentNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': document /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [documentIdentifier] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['documentNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [54],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION documentNameForm */

/* eslint-enable */

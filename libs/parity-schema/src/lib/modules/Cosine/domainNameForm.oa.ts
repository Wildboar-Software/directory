/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
import { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { domain } from '../Cosine/domain.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { NAME_FORM } from '@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export { dc } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa';
export { domain } from '../Cosine/domain.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION domainNameForm */
/**
 * @summary domainNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * domainNameForm NAME-FORM ::= {
 *     NAMES                domain
 *     WITH ATTRIBUTES        {dc}
 *     LDAP-NAME            {"domainNameForm"}
 *     ID                    { id-nf 57 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const domainNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': domain /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [dc] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['domainNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [57],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION domainNameForm */

/* eslint-enable */

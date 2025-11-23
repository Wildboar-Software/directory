/* eslint-disable */
import { NAME_FORM } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { room } from '../Cosine/room.oa';
import { id_nf } from '../Wildboar/id-nf.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { NAME_FORM } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
export { commonName } from '@wildboar/x500/SelectedAttributeTypes';
export { room } from '../Cosine/room.oa';
export { id_nf } from '../Wildboar/id-nf.va';

/* START_OF_SYMBOL_DEFINITION roomNameForm */
/**
 * @summary roomNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * roomNameForm NAME-FORM ::= {
 *     NAMES                room
 *     WITH ATTRIBUTES        {commonName}
 *     LDAP-NAME            {"roomNameForm"}
 *     ID                    { id-nf 55 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export const roomNameForm: NAME_FORM = {
    class: 'NAME-FORM',
    decoderFor: {},
    encoderFor: {},
    '&namedObjectClass': room /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['roomNameForm'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [55],
        id_nf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION roomNameForm */

/* eslint-enable */

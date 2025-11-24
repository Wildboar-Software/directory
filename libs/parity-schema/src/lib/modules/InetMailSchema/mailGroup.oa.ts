/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { member } from '@wildboar/x500/SelectedAttributeTypes';
import { mail } from '../Cosine/mail.oa';
import { id_oc_mailGroup } from '../InetMailSchema/id-oc-mailGroup.va';
import { mailRoutingAddress } from '../InetMailSchema/mailRoutingAddress.oa';


/* START_OF_SYMBOL_DEFINITION mailGroup */
/**
 * @summary mailGroup
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mailGroup OBJECT-CLASS ::= {
 *     KIND            structural
 *     MUST CONTAIN    {commonName | mail}
 *     MAY CONTAIN     {mailRoutingAddress | member | description}
 *     LDAP-NAME       {"mailGroup"}
 *     LDAP-DESC       "E-Mail Group"
 *     ID              id-oc-mailGroup
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const mailGroup: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName, mail] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        mailRoutingAddress,
        member,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mailGroup'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'E-Mail Group' /* OBJECT_FIELD_SETTING */,
    '&id': id_oc_mailGroup /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mailGroup */

/* eslint-enable */

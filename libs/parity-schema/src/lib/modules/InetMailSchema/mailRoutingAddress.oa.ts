/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { mail } from '../Cosine/mail.oa';
import { id_at_mailRoutingAddress } from '../InetMailSchema/id-at-mailRoutingAddress.va';


/* START_OF_SYMBOL_DEFINITION mailRoutingAddress */
/**
 * @summary mailRoutingAddress
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mailRoutingAddress ATTRIBUTE ::= {
 *     SUBTYPE OF                  mail
 *     LDAP-NAME                     {"mailRoutingAddress"}
 *     ID                          id-at-mailRoutingAddress
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const mailRoutingAddress: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': mail /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mailRoutingAddress'] /* OBJECT_FIELD_SETTING */,
    '&id': id_at_mailRoutingAddress /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mailRoutingAddress */

/* eslint-enable */

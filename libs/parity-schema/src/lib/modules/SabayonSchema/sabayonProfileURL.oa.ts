/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';


/* START_OF_SYMBOL_DEFINITION sabayonProfileURL */
/**
 * @summary sabayonProfileURL
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sabayonProfileURL ATTRIBUTE ::= {
 *     SUBTYPE OF                  labeledURI
 *     LDAP-NAME                   { "sabayonProfileURL" }
 *     LDAP-DESC                   "The URL of a sabayon profile"
 *     ID                          { 1 3 6 1 4 1 2312 4 3 3 1 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const sabayonProfileURL: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': labeledURI /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sabayonProfileURL'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'The URL of a sabayon profile' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 2312, 4, 3, 3, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION sabayonProfileURL */

/* eslint-enable */

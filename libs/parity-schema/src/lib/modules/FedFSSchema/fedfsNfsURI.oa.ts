/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { labeledURI } from '../OpenLDAPCoreSchema/labeledURI.oa';


/* START_OF_SYMBOL_DEFINITION fedfsNfsURI */
/**
 * @summary fedfsNfsURI
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsNfsURI ATTRIBUTE ::= {
 *     SUBTYPE OF                  labeledURI
 *     SINGLE VALUE                TRUE
 *     LDAP-NAME                     {"fedfsNfsURI"}
 *     LDAP-DESC                   "Location of fileset"
 *     ID                          { daniel-ellard 1 120 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const fedfsNfsURI: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': labeledURI /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsNfsURI'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Location of fileset' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 120],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&usage':
        userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsNfsURI */

/* eslint-enable */

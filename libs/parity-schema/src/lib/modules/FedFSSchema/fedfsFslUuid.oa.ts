/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsUuid } from '../FedFSSchema/fedfsUuid.oa';


/* START_OF_SYMBOL_DEFINITION fedfsFslUuid */
/**
 * @summary fedfsFslUuid
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsFslUuid ATTRIBUTE ::= {
 *     SUBTYPE OF                  fedfsUuid
 *     SINGLE VALUE                TRUE
 *     LDAP-NAME                     {"fedfsFslUuid"}
 *     LDAP-DESC                   "UUID of an FSL"
 *     ID                          { daniel-ellard 1 8 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const fedfsFslUuid: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': fedfsUuid /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsFslUuid'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'UUID of an FSL' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 8],
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
/* END_OF_SYMBOL_DEFINITION fedfsFslUuid */

/* eslint-enable */

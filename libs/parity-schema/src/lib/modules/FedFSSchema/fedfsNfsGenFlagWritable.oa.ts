/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { boolean_ } from '@wildboar/x500/SelectedAttributeTypes';
import { booleanMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { BOOLEAN, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';


/* START_OF_SYMBOL_DEFINITION fedfsNfsGenFlagWritable */
/**
 * @summary fedfsNfsGenFlagWritable
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsNfsGenFlagWritable ATTRIBUTE ::= {
 *     WITH SYNTAX                 BOOLEAN
 *     EQUALITY MATCHING RULE         booleanMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 boolean.&id
 *     LDAP-NAME                     {"fedfsNfsGenFlagWritable"}
 *     LDAP-DESC                   "Indicates if the file system is writable"
 *     ID                          { daniel-ellard 1 104 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<BOOLEAN>}
 * @implements {ATTRIBUTE<BOOLEAN>}
 */
export const fedfsNfsGenFlagWritable: ATTRIBUTE<BOOLEAN> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeBoolean,
    },
    encoderFor: {
        '&Type': $._encodeBoolean,
    },
    '&equality-match': booleanMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': boolean_['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsNfsGenFlagWritable'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Indicates if the file system is writable' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 104],
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
/* END_OF_SYMBOL_DEFINITION fedfsNfsGenFlagWritable */

/* eslint-enable */

/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { name } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export {
    AttributeUsage,
    AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */,
    AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */,
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_AttributeUsage,
    _encode_AttributeUsage,
    _enum_for_AttributeUsage,
} from '@wildboar/x500/InformationFramework';
export { MATCHING_RULE } from '@wildboar/x500/InformationFramework';
export { SYNTAX_NAME } from '@wildboar/x500/InformationFramework';
export { caseIgnoreOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
export { name } from '@wildboar/x500/SelectedAttributeTypes';
export { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';

/* START_OF_SYMBOL_DEFINITION fedfsAnnotation */
/**
 * @summary fedfsAnnotation
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsAnnotation ATTRIBUTE ::= {
 *     SUBTYPE OF                  name
 *     ORDERING MATCHING RULE      caseIgnoreOrderingMatch
 *     LDAP-NAME                     {"fedfsAnnotation"}
 *     LDAP-DESC                   "Annotation of an object"
 *     ID                          { daniel-ellard 1 12 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE}
 * @implements {ATTRIBUTE}
 */
export const fedfsAnnotation: ATTRIBUTE = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': undefined,
    },
    encoderFor: {
        '&Type': undefined,
    },
    '&derivation': name /* OBJECT_FIELD_SETTING */,
    '&ordering-match': caseIgnoreOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsAnnotation'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Annotation of an object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 12],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION fedfsAnnotation */

/* eslint-enable */

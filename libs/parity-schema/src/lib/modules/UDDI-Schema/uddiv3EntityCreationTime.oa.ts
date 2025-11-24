/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { generalizedTime } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { generalizedTimeOrderingMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { GeneralizedTime, ObjectIdentifier as _OID } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { id_uddi } from '../UDDI-Schema/id-uddi.va';


/* START_OF_SYMBOL_DEFINITION uddiv3EntityCreationTime */
/**
 * @summary uddiv3EntityCreationTime
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * uddiv3EntityCreationTime ATTRIBUTE ::= {
 *     WITH SYNTAX                 GeneralizedTime
 *     EQUALITY MATCHING RULE      generalizedTimeMatch
 *     ORDERING MATCHING RULE      generalizedTimeOrderingMatch
 *     SINGLE VALUE                TRUE
 *     LDAP-SYNTAX                 generalizedTime.&id
 *     LDAP-NAME                   {"uddiv3EntityCreationTime"}
 *     LDAP-DESC                   "UDDIv3 Entity Creation Time"
 *     ID                          { id-uddi 4 45 }
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<GeneralizedTime>}
 * @implements {ATTRIBUTE<GeneralizedTime>}
 */
export const uddiv3EntityCreationTime: ATTRIBUTE<GeneralizedTime> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeGeneralizedTime,
    },
    encoderFor: {
        '&Type': $._encodeGeneralizedTime,
    },
    '&equality-match': generalizedTimeMatch /* OBJECT_FIELD_SETTING */,
    '&ordering-match': generalizedTimeOrderingMatch /* OBJECT_FIELD_SETTING */,
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&ldapSyntax': generalizedTime['&id'] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['uddiv3EntityCreationTime'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'UDDIv3 Entity Creation Time' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 45],
        id_uddi
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
/* END_OF_SYMBOL_DEFINITION uddiv3EntityCreationTime */

/* eslint-enable */

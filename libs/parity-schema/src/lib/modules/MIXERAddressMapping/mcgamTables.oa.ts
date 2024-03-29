/* eslint-disable */
import { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
import * as $ from 'asn1-ts/dist/node/functional';
import { at_mcgam_tables } from '../MIXERAddressMapping/at-mcgam-tables.va';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
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
} from '@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta';
export {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta';
export { MATCHING_RULE } from '@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca';
export { SYNTAX_NAME } from '@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca';
export { at_mcgam_tables } from '../MIXERAddressMapping/at-mcgam-tables.va';

/* START_OF_SYMBOL_DEFINITION mcgamTables */
/**
 * @summary mcgamTables
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mcgamTables ATTRIBUTE ::= {
 *     WITH SYNTAX         SEQUENCE OF DistinguishedName
 *     SINGLE VALUE        TRUE
 *     ID                  at-mcgam-tables }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<DistinguishedName[]>}
 * @implements {ATTRIBUTE<DistinguishedName[]>}
 */
export const mcgamTables: ATTRIBUTE<DistinguishedName[]> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': $._decodeSequenceOf<DistinguishedName>(
            () => _decode_DistinguishedName
        ),
    },
    encoderFor: {
        '&Type': $._encodeSequenceOf<DistinguishedName>(
            () => _encode_DistinguishedName,
            $.BER
        ),
    },
    '&single-valued': true /* OBJECT_FIELD_SETTING */,
    '&id': at_mcgam_tables /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
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
/* END_OF_SYMBOL_DEFINITION mcgamTables */

/* eslint-enable */

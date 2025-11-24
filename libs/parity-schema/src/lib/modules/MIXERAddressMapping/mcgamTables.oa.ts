/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import {
    type DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from '@wildboar/x500/InformationFramework';
import * as $ from '@wildboar/asn1/functional';
import { at_mcgam_tables } from '../MIXERAddressMapping/at-mcgam-tables.va';



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

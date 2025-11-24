/* eslint-disable */
import type { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
import {
    directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { objectIdentifierFirstComponentMatch } from '@wildboar/x500/SelectedAttributeTypes';
import { id_soa_methodRuleUse } from '../IN-CS3-object-identifiers/id-soa-methodRuleUse.va';
import {
    MethodUseDescription,
    _decode_MethodUseDescription,
    _encode_MethodUseDescription,
} from '../IN-CS3-SCF-SDF-datatypes/MethodUseDescription.ta';

export {
    MethodUseDescription,
    _decode_MethodUseDescription,
    _encode_MethodUseDescription,
} from '../IN-CS3-SCF-SDF-datatypes/MethodUseDescription.ta';

/* START_OF_SYMBOL_DEFINITION methodUse */
/**
 * @summary methodUse
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * methodUse ATTRIBUTE ::= {
 *   WITH SYNTAX             MethodUseDescription
 *   EQUALITY MATCHING RULE  objectIdentifierFirstComponentMatch
 *   USAGE                   directoryOperation
 *   ID                      id-soa-methodRuleUse
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<MethodUseDescription>}
 * @implements {ATTRIBUTE<MethodUseDescription>}
 */
export const methodUse: ATTRIBUTE<MethodUseDescription> = {
    class: 'ATTRIBUTE',
    decoderFor: {
        '&Type': _decode_MethodUseDescription,
    },
    encoderFor: {
        '&Type': _encode_MethodUseDescription,
    },
    '&equality-match':
        objectIdentifierFirstComponentMatch /* OBJECT_FIELD_SETTING */,
    '&usage': directoryOperation /* OBJECT_FIELD_SETTING */,
    '&id': id_soa_methodRuleUse /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&Type': 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    '&single-valued':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&collective':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&dummy': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&no-user-modification':
        false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    '&obsolete': false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION methodUse */

/* eslint-enable */

/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { oncRpcNumber } from '../NIS/oncRpcNumber.oa';


/* START_OF_SYMBOL_DEFINITION oncRpc */
/**
 * @summary oncRpc
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * oncRpc OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | oncRpcNumber}
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"oncRpc"}
 *     LDAP-DESC        "Abstraction of an ONC/RPC binding"
 *     ID                { id-nis-oc 5 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const oncRpc: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        oncRpcNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['oncRpc'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Abstraction of an ONC/RPC binding' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [5],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION oncRpc */

/* eslint-enable */

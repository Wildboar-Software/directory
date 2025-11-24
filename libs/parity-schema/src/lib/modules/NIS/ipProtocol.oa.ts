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
import { ipProtocolNumber } from '../NIS/ipProtocolNumber.oa';


/* START_OF_SYMBOL_DEFINITION ipProtocol */
/**
 * @summary ipProtocol
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipProtocol OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {commonName | ipProtocolNumber}
 *     MAY CONTAIN        {description}
 *     LDAP-NAME        {"ipProtocol"}
 *     LDAP-DESC        "Abstraction of an IP protocol"
 *     ID                { id-nis-oc 4 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipProtocol: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipProtocolNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [description] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipProtocol'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Abstraction of an IP protocol' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipProtocol */

/* eslint-enable */

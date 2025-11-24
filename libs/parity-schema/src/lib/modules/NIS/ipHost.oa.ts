/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { localityName } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { manager } from '../Cosine/manager.oa';
import { id_nis_oc } from '../NIS/id-nis-oc.va';
import { ipHostNumber } from '../NIS/ipHostNumber.oa';


/* START_OF_SYMBOL_DEFINITION ipHost */
/**
 * @summary ipHost
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ipHost OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {commonName | ipHostNumber}
 *     MAY CONTAIN        {localityName | description | manager}
 *     LDAP-NAME        {"ipHost"}
 *     LDAP-DESC        "Abstraction of a host, an IP device"
 *     ID                { id-nis-oc 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const ipHost: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        commonName,
        ipHostNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        localityName,
        description,
        manager,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['ipHost'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Abstraction of a host, an IP device' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [6],
        id_nis_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION ipHost */

/* eslint-enable */

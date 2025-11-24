/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { nisDomain } from '../RFC2307bis/nisDomain.oa';


/* START_OF_SYMBOL_DEFINITION nisDomainObject */
/**
 * @summary nisDomainObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * nisDomainObject OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {nisDomain}
 *     LDAP-NAME       {"nisDomainObject"}
 *     LDAP-DESC       "Associates a NIS domain with a naming context"
 *     ID              { 1 3 6 1 1 1 2 15 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const nisDomainObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [nisDomain] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['nisDomainObject'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'Associates a NIS domain with a naming context' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 1, 1, 2, 15,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION nisDomainObject */

/* eslint-enable */

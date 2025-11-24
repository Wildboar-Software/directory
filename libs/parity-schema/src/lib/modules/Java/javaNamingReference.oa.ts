/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { javaFactory } from '../Java/javaFactory.oa';
import { javaObject } from '../Java/javaObject.oa';
import { javaReferenceAddress } from '../Java/javaReferenceAddress.oa';


/* START_OF_SYMBOL_DEFINITION javaNamingReference */
/**
 * @summary javaNamingReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * javaNamingReference OBJECT-CLASS ::= {
 *     SUBCLASS OF     {javaObject}
 *     KIND            auxiliary
 *     MAY CONTAIN     {javaReferenceAddress | javaFactory}
 *     LDAP-NAME       {"javaNamingReference"}
 *     LDAP-DESC       "JNDI reference"
 *     ID              { 1 3 6 1 4 1 42 2 27 4 2 7 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const javaNamingReference: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [javaObject] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        javaReferenceAddress,
        javaFactory,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['javaNamingReference'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'JNDI reference' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 42, 2, 27, 4, 2, 7,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION javaNamingReference */

/* eslint-enable */

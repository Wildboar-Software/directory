/* eslint-disable */
import { userPassword } from '@wildboar/x500/AuthenticationFramework';
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { uid } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_at_freeRadius } from '../RADIUSSchema/id-at-freeRadius.va';


/* START_OF_SYMBOL_DEFINITION radiusObjectProfile */
/**
 * @summary radiusObjectProfile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * radiusObjectProfile OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         { uid | userPassword | description }
 *     LDAP-NAME           { "radiusObjectProfile" }
 *     LDAP-DESC           "A Container Objectclass to be used for creating radius profile object"
 *     ID                  { id-at-freeRadius 4 3 2 2 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const radiusObjectProfile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        uid,
        userPassword,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['radiusObjectProfile'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'A Container Objectclass to be used for creating radius profile object' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [4, 3, 2, 2],
        id_at_freeRadius
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION radiusObjectProfile */

/* eslint-enable */

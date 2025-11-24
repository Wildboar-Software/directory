/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { commonName } from '@wildboar/x500/SelectedAttributeTypes';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { sabayonProfileURL } from '../SabayonSchema/sabayonProfileURL.oa';


/* START_OF_SYMBOL_DEFINITION sabayonProfile */
/**
 * @summary sabayonProfile
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sabayonProfile OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         { sabayonProfileURL | description }
 *     LDAP-NAME           { "sabayonProfile" }
 *     LDAP-DESC           "sabayon profile"
 *     ID                  { 1 3 6 1 4 1 2312 4 3 4 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sabayonProfile: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sabayonProfileURL,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sabayonProfile'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'sabayon profile' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts([
        1, 3, 6, 1, 4, 1, 2312, 4, 3, 4, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sabayonProfile */

/* eslint-enable */

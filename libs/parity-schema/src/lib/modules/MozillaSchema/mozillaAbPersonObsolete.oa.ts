/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { friendlyCountryName } from '../Cosine/friendlyCountryName.oa';
import { inetOrgPerson } from '../InetOrgPerson/inetOrgPerson.oa';
import { custom1 } from '../MozillaSchema/custom1.oa';
import { custom2 } from '../MozillaSchema/custom2.oa';
import { custom3 } from '../MozillaSchema/custom3.oa';
import { custom4 } from '../MozillaSchema/custom4.oa';
import { homeurl } from '../MozillaSchema/homeurl.oa';
import { mozillaHomeCountryName } from '../MozillaSchema/mozillaHomeCountryName.oa';
import { mozillaHomeFriendlyCountryName } from '../MozillaSchema/mozillaHomeFriendlyCountryName.oa';
import { mozillaHomeLocalityName } from '../MozillaSchema/mozillaHomeLocalityName.oa';
import { mozillaHomePostalAddress2 } from '../MozillaSchema/mozillaHomePostalAddress2.oa';
import { mozillaHomePostalCode } from '../MozillaSchema/mozillaHomePostalCode.oa';
import { mozillaHomeState } from '../MozillaSchema/mozillaHomeState.oa';
import { mozillaPostalAddress2 } from '../MozillaSchema/mozillaPostalAddress2.oa';
import { mozillaSecondEmail } from '../MozillaSchema/mozillaSecondEmail.oa';
import { nsAIMid } from '../MozillaSchema/nsAIMid.oa';
import { workurl } from '../MozillaSchema/workurl.oa';
import { xmozillanickname } from '../MozillaSchema/xmozillanickname.oa';
import { xmozillausehtmlmail } from '../MozillaSchema/xmozillausehtmlmail.oa';
export { ATTRIBUTE } from '@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca';
export { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
export {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    ObjectClassKind,
    ObjectClassKind_abstract /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_auxiliary /* IMPORTED_LONG_ENUMERATION_ITEM */,
    ObjectClassKind_structural /* IMPORTED_LONG_ENUMERATION_ITEM */,
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
    _decode_ObjectClassKind,
    _encode_ObjectClassKind,
    _enum_for_ObjectClassKind,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
export { countryName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa';
export { friendlyCountryName } from '../Cosine/friendlyCountryName.oa';
export { custom1 } from '../MozillaSchema/custom1.oa';
export { custom2 } from '../MozillaSchema/custom2.oa';
export { custom3 } from '../MozillaSchema/custom3.oa';
export { custom4 } from '../MozillaSchema/custom4.oa';
export { homeurl } from '../MozillaSchema/homeurl.oa';
export { mozillaHomeCountryName } from '../MozillaSchema/mozillaHomeCountryName.oa';
export { mozillaHomeFriendlyCountryName } from '../MozillaSchema/mozillaHomeFriendlyCountryName.oa';
export { mozillaHomeLocalityName } from '../MozillaSchema/mozillaHomeLocalityName.oa';
export { mozillaHomePostalAddress2 } from '../MozillaSchema/mozillaHomePostalAddress2.oa';
export { mozillaHomePostalCode } from '../MozillaSchema/mozillaHomePostalCode.oa';
export { mozillaHomeState } from '../MozillaSchema/mozillaHomeState.oa';
export { mozillaPostalAddress2 } from '../MozillaSchema/mozillaPostalAddress2.oa';
export { mozillaSecondEmail } from '../MozillaSchema/mozillaSecondEmail.oa';
export { nsAIMid } from '../MozillaSchema/nsAIMid.oa';
export { workurl } from '../MozillaSchema/workurl.oa';
export { xmozillanickname } from '../MozillaSchema/xmozillanickname.oa';
export { xmozillausehtmlmail } from '../MozillaSchema/xmozillausehtmlmail.oa';

/* START_OF_SYMBOL_DEFINITION mozillaAbPersonObsolete */
/**
 * @summary mozillaAbPersonObsolete
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * mozillaAbPersonObsolete OBJECT-CLASS ::= {
 *     SUBCLASS OF     {inetOrgPerson}
 *     KIND            structural
 *     MAY CONTAIN     {
 *         xmozillanickname
 *         | xmozillausehtmlmail
 *         | mozillaSecondEmail
 *         | mozillaPostalAddress2
 *         | mozillaHomePostalAddress2
 *         | mozillaHomeLocalityName
 *         | mozillaHomeState
 *         | mozillaHomePostalCode
 *         | mozillaHomeCountryName
 *         | mozillaHomeFriendlyCountryName
 *         | homeurl
 *         | workurl
 *         | custom1
 *         | custom2
 *         | custom3
 *         | custom4
 *         | nsAIMid
 *         | countryName
 *         | friendlyCountryName
 *     }
 *     LDAP-NAME       {"mozillaAbPersonObsolete"}
 *     ID              { 1 3 6 1 4 1 13769 2 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const mozillaAbPersonObsolete: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [inetOrgPerson] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        xmozillanickname,
        xmozillausehtmlmail,
        mozillaSecondEmail,
        mozillaPostalAddress2,
        mozillaHomePostalAddress2,
        mozillaHomeLocalityName,
        mozillaHomeState,
        mozillaHomePostalCode,
        mozillaHomeCountryName,
        mozillaHomeFriendlyCountryName,
        homeurl,
        workurl,
        custom1,
        custom2,
        custom3,
        custom4,
        nsAIMid,
        countryName,
        friendlyCountryName,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['mozillaAbPersonObsolete'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID([
        1, 3, 6, 1, 4, 1, 13769, 2, 2, 1,
    ]) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION mozillaAbPersonObsolete */

/* eslint-enable */

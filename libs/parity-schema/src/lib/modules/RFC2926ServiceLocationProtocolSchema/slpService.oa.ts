/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { description } from '@wildboar/x500/SelectedAttributeTypes';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { id_james_kempf } from '../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va';
import { service_advert_attribute_authenticator } from '../RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa';
import { service_advert_scopes } from '../RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa';
import { service_advert_service_type } from '../RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa';
import { service_advert_url_authenticator } from '../RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa';
import { template_major_version_number } from '../RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa';
import { template_minor_version_number } from '../RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa';
import { template_url_syntax } from '../RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa';
export { ATTRIBUTE } from '@wildboar/x500/InformationFramework';
export { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
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
} from '@wildboar/x500/InformationFramework';
export { description } from '@wildboar/x500/SelectedAttributeTypes';
export { id_james_kempf } from '../RFC2926ServiceLocationProtocolSchema/id-james-kempf.va';
export { service_advert_attribute_authenticator } from '../RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa';
export { service_advert_scopes } from '../RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa';
export { service_advert_service_type } from '../RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa';
export { service_advert_url_authenticator } from '../RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa';
export { template_major_version_number } from '../RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa';
export { template_minor_version_number } from '../RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa';
export { template_url_syntax } from '../RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa';

/* START_OF_SYMBOL_DEFINITION slpService */
/**
 * @summary slpService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * slpService OBJECT-CLASS ::= {
 *     SUBCLASS OF { top }
 *     KIND                abstract
 *     MUST CONTAIN {
 *         template-major-version-number
 *         | template-minor-version-number
 *         | description
 *         | template-url-syntax
 *         | service-advert-service-type
 *         | service-advert-scopes
 *     }
 *     MAY CONTAIN {
 *         service-advert-url-authenticator
 *         | service-advert-attribute-authenticator
 *     }
 *     LDAP-NAME { "slpService" }
 *     LDAP-DESC           "authentication password mix in class"
 *     ID { id-james-kempf 2 27 6 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const slpService: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        template_major_version_number,
        template_minor_version_number,
        description,
        template_url_syntax,
        service_advert_service_type,
        service_advert_scopes,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        service_advert_url_authenticator,
        service_advert_attribute_authenticator,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['slpService'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc':
        'authentication password mix in class' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [2, 27, 6, 2, 1],
        id_james_kempf
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION slpService */

/* eslint-enable */

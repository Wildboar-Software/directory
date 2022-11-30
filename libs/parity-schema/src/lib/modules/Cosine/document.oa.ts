/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
import { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
import { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
import { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { documentAuthor } from '../Cosine/documentAuthor.oa';
import { documentIdentifier } from '../Cosine/documentIdentifier.oa';
import { documentLocation } from '../Cosine/documentLocation.oa';
import { documentPublisher } from '../Cosine/documentPublisher.oa';
import { documentTitle } from '../Cosine/documentTitle.oa';
import { documentVersion } from '../Cosine/documentVersion.oa';
import { pilotObjectClass } from '../Cosine/pilotObjectClass.va';
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
export { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
export { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
export { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
export { localityName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa';
export { organizationalUnitName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa';
export { organizationName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa';
export { seeAlso } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/seeAlso.oa';
export { documentAuthor } from '../Cosine/documentAuthor.oa';
export { documentIdentifier } from '../Cosine/documentIdentifier.oa';
export { documentLocation } from '../Cosine/documentLocation.oa';
export { documentPublisher } from '../Cosine/documentPublisher.oa';
export { documentTitle } from '../Cosine/documentTitle.oa';
export { documentVersion } from '../Cosine/documentVersion.oa';
export { pilotObjectClass } from '../Cosine/pilotObjectClass.va';

/* START_OF_SYMBOL_DEFINITION document */
/**
 * @summary document
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * document OBJECT-CLASS ::= {
 *     SUBCLASS OF {top}
 *     KIND structural
 *     MUST CONTAIN {
 *         documentIdentifier
 *     }
 *     MAY CONTAIN {
 *         commonName
 *         | description
 *         | seeAlso
 *         | localityName
 *         | organizationName
 *         | organizationalUnitName
 *         | documentTitle
 *         | documentVersion
 *         | documentAuthor
 *         | documentLocation
 *         | documentPublisher
 *     }
 *     LDAP-NAME {"document"}
 *     ID { pilotObjectClass 6 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const document: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [documentIdentifier] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        commonName,
        description,
        seeAlso,
        localityName,
        organizationName,
        organizationalUnitName,
        documentTitle,
        documentVersion,
        documentAuthor,
        documentLocation,
        documentPublisher,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['document'] /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [6],
        pilotObjectClass
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION document */

/* eslint-enable */

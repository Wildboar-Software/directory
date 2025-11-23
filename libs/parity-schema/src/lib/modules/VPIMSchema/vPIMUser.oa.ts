/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    auxiliary /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';
import { vPIMExtendedAbsenceStatus } from '../VPIMSchema/vPIMExtendedAbsenceStatus.oa';
import { vPIMMaxMessageSize } from '../VPIMSchema/vPIMMaxMessageSize.oa';
import { vPIMRfc822Mailbox } from '../VPIMSchema/vPIMRfc822Mailbox.oa';
import { vPIMSpokenName } from '../VPIMSchema/vPIMSpokenName.oa';
import { vPIMSubMailboxes } from '../VPIMSchema/vPIMSubMailboxes.oa';
import { vPIMSupportedAudioMediaTypes } from '../VPIMSchema/vPIMSupportedAudioMediaTypes.oa';
import { vPIMSupportedMessageContext } from '../VPIMSchema/vPIMSupportedMessageContext.oa';
import { vPIMSupportedUABehaviors } from '../VPIMSchema/vPIMSupportedUABehaviors.oa';
import { vPIMTelephoneNumber } from '../VPIMSchema/vPIMTelephoneNumber.oa';
import { vPIMTextName } from '../VPIMSchema/vPIMTextName.oa';
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
export { top } from '@wildboar/x500/InformationFramework';
export { iana_assigned_oid } from '../VPIMSchema/iana-assigned-oid.va';
export { vPIMExtendedAbsenceStatus } from '../VPIMSchema/vPIMExtendedAbsenceStatus.oa';
export { vPIMMaxMessageSize } from '../VPIMSchema/vPIMMaxMessageSize.oa';
export { vPIMRfc822Mailbox } from '../VPIMSchema/vPIMRfc822Mailbox.oa';
export { vPIMSpokenName } from '../VPIMSchema/vPIMSpokenName.oa';
export { vPIMSubMailboxes } from '../VPIMSchema/vPIMSubMailboxes.oa';
export { vPIMSupportedAudioMediaTypes } from '../VPIMSchema/vPIMSupportedAudioMediaTypes.oa';
export { vPIMSupportedMessageContext } from '../VPIMSchema/vPIMSupportedMessageContext.oa';
export { vPIMSupportedUABehaviors } from '../VPIMSchema/vPIMSupportedUABehaviors.oa';
export { vPIMTelephoneNumber } from '../VPIMSchema/vPIMTelephoneNumber.oa';
export { vPIMTextName } from '../VPIMSchema/vPIMTextName.oa';

/* START_OF_SYMBOL_DEFINITION vPIMUser */
/**
 * @summary vPIMUser
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * vPIMUser OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            auxiliary
 *     MUST CONTAIN    {vPIMRfc822Mailbox | vPIMTelephoneNumber}
 *     MAY CONTAIN     {
 *         vPIMSpokenName
 *         | vPIMSupportedUABehaviors
 *         | vPIMSupportedAudioMediaTypes
 *         | vPIMSupportedMessageContext
 *         | vPIMTextName
 *         | vPIMExtendedAbsenceStatus
 *         | vPIMMaxMessageSize
 *         | vPIMSubMailboxes
 *     }
 *     LDAP-NAME       {"vPIMUser"}
 *     ID              { iana-assigned-oid 1 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const vPIMUser: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': auxiliary /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        vPIMRfc822Mailbox,
        vPIMTelephoneNumber,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        vPIMSpokenName,
        vPIMSupportedUABehaviors,
        vPIMSupportedAudioMediaTypes,
        vPIMSupportedMessageContext,
        vPIMTextName,
        vPIMExtendedAbsenceStatus,
        vPIMMaxMessageSize,
        vPIMSubMailboxes,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['vPIMUser'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 1],
        iana_assigned_oid
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION vPIMUser */

/* eslint-enable */

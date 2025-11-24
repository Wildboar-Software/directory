/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { co_oc } from '../H323-X500-Schema/co-oc.va';
import { commOwner } from '../H323-X500-Schema/commOwner.oa';
import { commPrivate } from '../H323-X500-Schema/commPrivate.oa';
import { commUniqueId } from '../H323-X500-Schema/commUniqueId.oa';


/* START_OF_SYMBOL_DEFINITION commObject */
/**
 * @summary commObject
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * commObject OBJECT-CLASS ::= {
 *   SUBCLASS OF   {top}
 *   MUST CONTAIN  {commUniqueId}
 *   MAY CONTAIN   {commOwner | commPrivate}
 *   ID            {co-oc  1}
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const commObject: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commUniqueId] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [commOwner, commPrivate] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        co_oc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION commObject */

/* eslint-enable */

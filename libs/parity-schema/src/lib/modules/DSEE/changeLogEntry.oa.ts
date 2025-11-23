/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { changeNumber } from '../DSEE/changeNumber.oa';
import { changes } from '../DSEE/changes.oa';
import { changeTime } from '../DSEE/changeTime.oa';
import { changeType } from '../DSEE/changeType.oa';
import { deleteOldRdn } from '../DSEE/deleteOldRdn.oa';
import { newRdn } from '../DSEE/newRdn.oa';
import { newSuperior } from '../DSEE/newSuperior.oa';
import { nsdsoc } from '../DSEE/nsdsoc.va';
import { targetDn } from '../DSEE/targetDn.oa';
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
export { changeNumber } from '../DSEE/changeNumber.oa';
export { changes } from '../DSEE/changes.oa';
export { changeTime } from '../DSEE/changeTime.oa';
export { changeType } from '../DSEE/changeType.oa';
export { deleteOldRdn } from '../DSEE/deleteOldRdn.oa';
export { newRdn } from '../DSEE/newRdn.oa';
export { newSuperior } from '../DSEE/newSuperior.oa';
export { nsdsoc } from '../DSEE/nsdsoc.va';
export { targetDn } from '../DSEE/targetDn.oa';

/* START_OF_SYMBOL_DEFINITION changeLogEntry */
/**
 * @summary changeLogEntry
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * changeLogEntry OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            structural
 *     MUST CONTAIN    {targetDn | changeTime | changeNumber | changeType}
 *     MAY CONTAIN        {changes | newRdn | deleteOldRdn | newSuperior}
 *     LDAP-NAME        {"changeLogEntry"}
 *     ID                { nsdsoc 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const changeLogEntry: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        targetDn,
        changeTime,
        changeNumber,
        changeType,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        changes,
        newRdn,
        deleteOldRdn,
        newSuperior,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['changeLogEntry'] /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1],
        nsdsoc
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION changeLogEntry */

/* eslint-enable */

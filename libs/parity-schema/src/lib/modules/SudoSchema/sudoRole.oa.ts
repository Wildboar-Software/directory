/* eslint-disable */
import { OBJECT_CLASS } from '@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta';
import { top } from '@wildboar/x500/src/lib/modules/InformationFramework/top.oa';
import { commonName } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa';
import { description } from '@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa';
import { ObjectIdentifier as _OID } from 'asn1-ts';
import { id_aaron_spangler } from '../SudoSchema/id-aaron-spangler.va';
import { sudoCommand } from '../SudoSchema/sudoCommand.oa';
import { sudoHost } from '../SudoSchema/sudoHost.oa';
import { sudoNotAfter } from '../SudoSchema/sudoNotAfter.oa';
import { sudoNotBefore } from '../SudoSchema/sudoNotBefore.oa';
import { sudoOption } from '../SudoSchema/sudoOption.oa';
import { sudoOrder } from '../SudoSchema/sudoOrder.oa';
import { sudoRunAs } from '../SudoSchema/sudoRunAs.oa';
import { sudoRunAsGroup } from '../SudoSchema/sudoRunAsGroup.oa';
import { sudoRunAsUser } from '../SudoSchema/sudoRunAsUser.oa';
import { sudoUser } from '../SudoSchema/sudoUser.oa';
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
export { id_aaron_spangler } from '../SudoSchema/id-aaron-spangler.va';
export { sudoCommand } from '../SudoSchema/sudoCommand.oa';
export { sudoHost } from '../SudoSchema/sudoHost.oa';
export { sudoNotAfter } from '../SudoSchema/sudoNotAfter.oa';
export { sudoNotBefore } from '../SudoSchema/sudoNotBefore.oa';
export { sudoOption } from '../SudoSchema/sudoOption.oa';
export { sudoOrder } from '../SudoSchema/sudoOrder.oa';
export { sudoRunAs } from '../SudoSchema/sudoRunAs.oa';
export { sudoRunAsGroup } from '../SudoSchema/sudoRunAsGroup.oa';
export { sudoRunAsUser } from '../SudoSchema/sudoRunAsUser.oa';
export { sudoUser } from '../SudoSchema/sudoUser.oa';

/* START_OF_SYMBOL_DEFINITION sudoRole */
/**
 * @summary sudoRole
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * sudoRole OBJECT-CLASS ::= {
 *     SUBCLASS OF         { top }
 *     KIND                structural
 *     MUST CONTAIN        { commonName }
 *     MAY CONTAIN         {
 *         sudoUser
 *         | sudoHost
 *         | sudoCommand
 *         | sudoRunAs
 *         | sudoRunAsUser
 *         | sudoRunAsGroup
 *         | sudoOption
 *         | sudoNotBefore
 *         | sudoNotAfter
 *         | sudoOrder
 *         | description
 *     }
 *     LDAP-NAME           { "sudoRole" }
 *     LDAP-DESC           "Sudoer Entries"
 *     ID                  { id-aaron-spangler 9 2 1 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const sudoRole: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [commonName] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        sudoUser,
        sudoHost,
        sudoCommand,
        sudoRunAs,
        sudoRunAsUser,
        sudoRunAsGroup,
        sudoOption,
        sudoNotBefore,
        sudoNotAfter,
        sudoOrder,
        description,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['sudoRole'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'Sudoer Entries' /* OBJECT_FIELD_SETTING */,
    '&id': new _OID(
        [9, 2, 1],
        id_aaron_spangler
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION sudoRole */

/* eslint-enable */

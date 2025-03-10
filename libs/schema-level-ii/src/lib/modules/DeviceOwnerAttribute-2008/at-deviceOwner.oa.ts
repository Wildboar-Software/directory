/* eslint-disable */
import { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
import { userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { objectIdentifierMatch } from "@wildboar/x500/src/lib/modules/InformationFramework/objectIdentifierMatch.oa";
import { oid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oid.oa";
import {
    OBJECT_IDENTIFIER
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { id_deviceOwner } from "../DeviceOwnerAttribute-2008/id-deviceOwner.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { _decode_AttributeUsage, _encode_AttributeUsage, _enum_for_AttributeUsage, AttributeUsage, AttributeUsage_directoryOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_distributedOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_dSAOperation /* IMPORTED_LONG_ENUMERATION_ITEM */, AttributeUsage_userApplications /* IMPORTED_LONG_ENUMERATION_ITEM */, directoryOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, distributedOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, dSAOperation /* IMPORTED_SHORT_ENUMERATION_ITEM */, userApplications /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { SYNTAX_NAME } from "@wildboar/x500/src/lib/modules/InformationFramework/SYNTAX-NAME.oca";
export { objectIdentifierMatch } from "@wildboar/x500/src/lib/modules/InformationFramework/objectIdentifierMatch.oa";
export { oid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oid.oa";
export { id_deviceOwner } from "../DeviceOwnerAttribute-2008/id-deviceOwner.va";


/* START_OF_SYMBOL_DEFINITION at_deviceOwner */
/**
 * @summary at_deviceOwner
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * at-deviceOwner ATTRIBUTE ::= {
 *     WITH SYNTAX             OBJECT IDENTIFIER
 *     EQUALITY MATCHING RULE  objectIdentifierMatch
 *     LDAP-SYNTAX             oid.&id
 *     LDAP-NAME               {"deviceOwner"}
 *     LDAP-DESC               "Device Owner per IETF RFC 5916"
 *     ID                      id-deviceOwner
 * }
 * ```
 *
 * @constant
 * @type {ATTRIBUTE<OBJECT_IDENTIFIER>}
 * @implements {ATTRIBUTE<OBJECT_IDENTIFIER>}
 */
export
const at_deviceOwner: ATTRIBUTE<OBJECT_IDENTIFIER> = {
    class: "ATTRIBUTE",
    decoderFor: {
        "&Type": $._decodeObjectIdentifier,
    },
    encoderFor: {
        "&Type": $._encodeObjectIdentifier,
    },
    "&equality-match": objectIdentifierMatch /* OBJECT_FIELD_SETTING */,
    "&ldapSyntax": oid["&id"] /* OBJECT_FIELD_SETTING */,
    "&ldapName": [ "deviceOwner" ] /* OBJECT_FIELD_SETTING */,
    "&ldapDesc": "Device Owner per IETF RFC 5916" /* OBJECT_FIELD_SETTING */,
    "&id": id_deviceOwner /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
    "&Type": 0 as never /* OBJECT_FIELD_SETTING OBJECT_TYPE_FIELD_SETTING */,
    "&single-valued": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&collective": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&dummy": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&no-user-modification": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&usage": userApplications /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
    "&obsolete": false /* OBJECT_FIELD_SETTING DEFAULT_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION at_deviceOwner */

/* eslint-enable */

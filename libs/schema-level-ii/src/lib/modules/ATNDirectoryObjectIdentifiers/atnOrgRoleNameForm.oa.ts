/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { id_nf_atnOrgRoleNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgRoleNameForm.va";
import { atn_organizational_role } from "./atn-organizational-role.oa";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { id_nf_atnOrgRoleNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgRoleNameForm.va";

/* START_OF_SYMBOL_DEFINITION atnOrgRoleNameForm */
/**
 * @summary atnOrgRoleNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnOrgRoleNameForm NAME-FORM ::= {
 *     NAMES               atn-organizational-role
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnOrgRoleNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnOrgRoleNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_organizational_role /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnOrgRoleNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnOrgRoleNameForm */

/* eslint-enable */

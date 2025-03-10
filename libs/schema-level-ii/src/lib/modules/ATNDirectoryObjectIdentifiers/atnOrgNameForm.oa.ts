/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import { atn_organization } from "../ATNDirectoryObjectIdentifiers/atn-organization.oa";
import { id_nf_atnOrgNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgNameForm.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { organizationName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
export { atn_organization } from "../ATNDirectoryObjectIdentifiers/atn-organization.oa";
export { id_nf_atnOrgNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgNameForm.va";


/* START_OF_SYMBOL_DEFINITION atnOrgNameForm */
/**
 * @summary atnOrgNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnOrgNameForm NAME-FORM ::= {
 *     NAMES               atn-organization
 *     WITH ATTRIBUTES     {organizationName}
 *     ID                  id-nf-atnOrgNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnOrgNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_organization /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ organizationName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnOrgNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnOrgNameForm */

/* eslint-enable */

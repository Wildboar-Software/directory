/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { id_nf_atnAmhsDLNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAmhsDLNameForm.va";
import { atn_amhs_distribution_list } from "./atn-amhs-distribution-list.oa";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { id_nf_atnAmhsDLNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAmhsDLNameForm.va";

/* START_OF_SYMBOL_DEFINITION atnAmhsDLNameForm */
/**
 * @summary atnAmhsDLNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnAmhsDLNameForm NAME-FORM ::= {
 *     NAMES               atn-amhs-distributionList
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnAmhsDLNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnAmhsDLNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_amhs_distribution_list /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnAmhsDLNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnAmhsDLNameForm */

/* eslint-enable */

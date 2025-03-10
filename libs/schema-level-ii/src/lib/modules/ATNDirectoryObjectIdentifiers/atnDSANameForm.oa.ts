/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { atn_dSA } from "../ATNDirectoryObjectIdentifiers/atn-dSA.oa";
import { id_nf_atnDSANameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnDSANameForm.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
export { atn_dSA } from "../ATNDirectoryObjectIdentifiers/atn-dSA.oa";
export { id_nf_atnDSANameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnDSANameForm.va";


/* START_OF_SYMBOL_DEFINITION atnDSANameForm */
/**
 * @summary atnDSANameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnDSANameForm NAME-FORM ::= {
 *     NAMES               atn-dSA
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnDSANameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnDSANameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_dSA /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnDSANameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnDSANameForm */

/* eslint-enable */

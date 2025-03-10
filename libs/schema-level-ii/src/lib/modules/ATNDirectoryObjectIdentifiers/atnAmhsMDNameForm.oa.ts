/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { atn_amhsMD } from "../ATNDirectoryObjectIdentifiers/atn-amhsMD.oa";
import { id_nf_atnAmhsMDNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAmhsMDNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnAmhsMDNameForm */
/**
 * @summary atnAmhsMDNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnAmhsMDNameForm NAME-FORM ::= {
 *     NAMES               atn-amhsMD
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnAmhsMDNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnAmhsMDNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_amhsMD /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnAmhsMDNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnAmhsMDNameForm */

/* eslint-enable */

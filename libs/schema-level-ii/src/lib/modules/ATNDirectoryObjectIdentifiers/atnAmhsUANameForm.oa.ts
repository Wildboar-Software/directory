/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/InformationFramework";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import { id_nf_atnAmhsUANameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAmhsUANameForm.va";
import { atn_amhs_user_agent } from "./atn-amhs-user-agent.oa";



/* START_OF_SYMBOL_DEFINITION atnAmhsUANameForm */
/**
 * @summary atnAmhsUANameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnAmhsUANameForm NAME-FORM ::= {
 *     NAMES               atn-amhs-useragent
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnAmhsUANameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnAmhsUANameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_amhs_user_agent /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnAmhsUANameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnAmhsUANameForm */

/* eslint-enable */

/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { id_nf_atnAmhsGatewayNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAmhsGatewayNameForm.va";
import { atn_AmhsGateway } from "./atn-AmhsGateway.oa";



/* START_OF_SYMBOL_DEFINITION atnAmhsGatewayNameForm */
/**
 * @summary atnAmhsGatewayNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnAmhsGatewayNameForm NAME-FORM ::= {
 *     NAMES               atn-amhs-gateway
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnAmhsGatewayNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnAmhsGatewayNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_AmhsGateway /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnAmhsGatewayNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnAmhsGatewayNameForm */

/* eslint-enable */

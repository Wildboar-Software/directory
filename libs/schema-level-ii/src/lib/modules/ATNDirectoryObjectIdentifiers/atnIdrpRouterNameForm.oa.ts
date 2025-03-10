/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { atn_idrp_router } from "../ATNDirectoryObjectIdentifiers/atn-idrp-router.oa";
import { id_nf_atnIdrpRouterNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnIdrpRouterNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnIdrpRouterNameForm */
/**
 * @summary atnIdrpRouterNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnIdrpRouterNameForm NAME-FORM ::= {
 *     NAMES               atn-idrp-router
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnIdrpRouterNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnIdrpRouterNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_idrp_router /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnIdrpRouterNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnIdrpRouterNameForm */

/* eslint-enable */

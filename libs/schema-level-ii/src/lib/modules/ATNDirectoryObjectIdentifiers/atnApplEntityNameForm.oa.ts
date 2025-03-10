/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { atn_application_entity } from "../ATNDirectoryObjectIdentifiers/atn-application-entity.oa";
import { id_nf_atnApplEntityNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnApplEntityNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnApplEntityNameForm */
/**
 * @summary atnApplEntityNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnApplEntityNameForm NAME-FORM ::= {
 *     NAMES               atn-application-entity
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnApplEntityNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnApplEntityNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_application_entity /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnApplEntityNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnApplEntityNameForm */

/* eslint-enable */

/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { atn_facility_name } from "../ATNDirectoryObjectIdentifiers/atn-facility-name.oa";
import { atn_facility } from "../ATNDirectoryObjectIdentifiers/atn-facility.oa";
import { id_nf_atnFacilityNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnFacilityNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnFacilityNameForm */
/**
 * @summary atnFacilityNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnFacilityNameForm NAME-FORM ::= {
 *     NAMES               atn-facility
 *     WITH ATTRIBUTES     {atn-facility-name}
 *     ID                  id-nf-atnFacilityNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnFacilityNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_facility /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_facility_name, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnFacilityNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnFacilityNameForm */

/* eslint-enable */

/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { atn_aircraft } from "../ATNDirectoryObjectIdentifiers/atn-aircraft.oa";
import { atn_aircraftIDName } from "../ATNDirectoryObjectIdentifiers/atn-aircraftIDName.oa";
import { id_nf_atnAircraftNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAircraftNameForm.va";
export { ATTRIBUTE } from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";
export { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
export { OBJECT_CLASS } from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
export { atn_aircraft } from "../ATNDirectoryObjectIdentifiers/atn-aircraft.oa";
export { atn_aircraftIDName } from "../ATNDirectoryObjectIdentifiers/atn-aircraftIDName.oa";
export { id_nf_atnAircraftNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnAircraftNameForm.va";


/* START_OF_SYMBOL_DEFINITION atnAircraftNameForm */
/**
 * @summary atnAircraftNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnAircraftNameForm NAME-FORM ::= {
 *     NAMES               atn-aircraft
 *     WITH ATTRIBUTES     {atn-aircraftIDName}
 *     ID                  id-nf-atnAircraftNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnAircraftNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_aircraft /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ atn_aircraftIDName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnAircraftNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnAircraftNameForm */

/* eslint-enable */

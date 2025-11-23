/* eslint-disable */
import { NAME_FORM } from "@wildboar/x500/InformationFramework";
import { organizationalUnitName } from "@wildboar/x500/SelectedAttributeTypes";
import { atn_organizational_unit } from "../ATNDirectoryObjectIdentifiers/atn-organizational-unit.oa";
import { id_nf_atnOrgUnitNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgUnitNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnOrgUnitNameForm */
/**
 * @summary atnOrgUnitNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnOrgUnitNameForm NAME-FORM ::= {
 *     NAMES               atn-organizational-unit
 *     WITH ATTRIBUTES     {organizationalUnitName}
 *     ID                  id-nf-atnOrgUnitNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnOrgUnitNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_organizational_unit /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ organizationalUnitName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnOrgUnitNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnOrgUnitNameForm */

/* eslint-enable */

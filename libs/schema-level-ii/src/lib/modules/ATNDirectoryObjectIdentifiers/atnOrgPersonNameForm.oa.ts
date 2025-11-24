/* eslint-disable */
import type { NAME_FORM } from "@wildboar/x500/InformationFramework";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import { atn_organizational_person } from "../ATNDirectoryObjectIdentifiers/atn-organizational-person.oa";
import { id_nf_atnOrgPersonNameForm } from "../ATNDirectoryObjectIdentifiers/id-nf-atnOrgPersonNameForm.va";




/* START_OF_SYMBOL_DEFINITION atnOrgPersonNameForm */
/**
 * @summary atnOrgPersonNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * atnOrgPersonNameForm NAME-FORM ::= {
 *     NAMES               atn-organizational-person
 *     WITH ATTRIBUTES     {commonName}
 *     ID                  id-nf-atnOrgPersonNameForm
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const atnOrgPersonNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {
    },
    encoderFor: {
    },
    "&namedObjectClass": atn_organizational_person /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [ commonName, ] /* OBJECT_FIELD_SETTING */,
    "&id": id_nf_atnOrgPersonNameForm /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION atnOrgPersonNameForm */

/* eslint-enable */

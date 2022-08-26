import type { NAME_FORM } from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { ObjectIdentifier } from "asn1-ts";
import { id_nf } from "../Wildboar/id-nf.va";
import { groupOfEntries } from "./groupOfEntries.oa";

/* START_OF_SYMBOL_DEFINITION groupOfEntriesNameForm */
/**
 * @summary groupOfEntriesNameForm
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * groupOfEntriesNameForm NAME-FORM ::= {
 *     NAMES				groupOfEntries
 *     WITH ATTRIBUTES		{commonName}
 *     LDAP-NAME			{"groupOfEntriesNameForm"}
 *     ID					{ id-nf 50 }
 * }
 * ```
 *
 * @constant
 * @type {NAME_FORM}
 * @implements {NAME_FORM}
 */
export
const groupOfEntriesNameForm: NAME_FORM = {
    class: "NAME-FORM",
    decoderFor: {},
    encoderFor: {},
    "&namedObjectClass": groupOfEntries /* OBJECT_FIELD_SETTING */,
    "&MandatoryAttributes": [commonName] /* OBJECT_FIELD_SETTING */,
    "&ldapName": ["groupOfEntriesNameForm"] /* OBJECT_FIELD_SETTING */,
    "&id": new ObjectIdentifier([ 50 ], id_nf) /* OBJECT_FIELD_SETTING *//* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION groupOfEntriesNameForm */

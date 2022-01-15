import type { OBJECT_IDENTIFIER } from "asn1-ts";
import { id_at_objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import {
    id_aca_entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-entryACI.va";

/**
 * @summary Array of object identifiers for attribute types that are always permitted in an entry.
 * @description
 * To be clear, by "entry," I mean a DSE of type entry, subentry, or alias.
 *
 * @constant
 */
export
const attributeTypesPermittedForEveryEntry: OBJECT_IDENTIFIER[] = [
    id_at_objectClass,
    id_aca_entryACI,
];

export default attributeTypesPermittedForEveryEntry;

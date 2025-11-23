import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { id_at_objectClass } from "@wildboar/x500/InformationFramework";
import {
    id_aca_entryACI,
} from "@wildboar/x500/BasicAccessControl";

/**
 * @summary Array of object identifiers for attribute types that are always permitted in an entry.
 * @description
 *
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

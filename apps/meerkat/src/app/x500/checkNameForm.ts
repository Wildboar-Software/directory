import type { IndexableOID } from "../types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";

// TODO: Move into @wildboar/x500
export
function checkNameForm (
    rdn: RDN,
    mandatories?: OBJECT_IDENTIFIER[],
    optionals?: OBJECT_IDENTIFIER[],
): boolean {
    const unsatisfiedMandatories: Set<IndexableOID> = new Set(mandatories?.map((m) => m.toString()));
    for (const atav of rdn) {
        unsatisfiedMandatories.delete(atav.type_.toString());
    }
    if (unsatisfiedMandatories.size > 0) {
        return false;
    }
    const permittedTypes: Set<IndexableOID> = new Set(
        ...mandatories?.map((m) => m.toString()) ?? [],
        ...optionals?.map((o) => o.toString()) ?? [],
    );
    for (const atav of rdn) {
        if (!permittedTypes.has(atav.type_.toString())) {
            return false;
        }
    }
    return true;
}

export default checkNameForm;

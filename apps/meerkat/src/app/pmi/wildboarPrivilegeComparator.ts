import { AttributeType } from "@wildboar/x500/InformationFramework";
import type { PrivilegeComparator } from "../types/index.js";
import { ASN1Element, TRUE_BIT } from "@wildboar/asn1";
import {
    clearance,
    Clearance,
    ClassList,
} from "@wildboar/x500/EnhancedSecurity";
import { compareElements } from "@wildboar/x500";

function classListPrivilegeLevel (classList: ClassList | undefined): number {
    const bits = classList ?? Clearance._default_value_for_classList;
    for (let i = bits.length - 1; i >= 0; i--) {
        if (bits[i] === TRUE_BIT) {
            return i;
        }
    }
    return -1;
}

// TODO: Test the heck out of this.
export
const wildboarPrivilegeComparator: PrivilegeComparator = (
    attr_type: AttributeType,
    a: ASN1Element,
    b: ASN1Element,
): number | undefined | null => {
    if (!attr_type.isEqualTo(clearance["&id"])) {
        // This comparator only recognizes the clearance attribute.
        return undefined;
    }
    const ad = clearance.decoderFor["&Type"]!(a);
    const bd = clearance.decoderFor["&Type"]!(b);
    if (!ad.policyId.isEqualTo(bd.policyId)) {
        return null;
    }
    const scas = ad.securityCategories ?? [];
    const scbs = bd.securityCategories ?? [];
    if (scas.length !== scbs.length) {
        // Differing number of security categories before dedupe.
        return null;
    }
    const scamap = new Map(scas.map((sc) => [sc.type_.toString(), sc]));
    const scbmap = new Map(scbs.map((sc) => [sc.type_.toString(), sc]));
    if (scamap.size !== scbmap.size) {
        // Differing number of security categories after dedupe.
        return null;
    }
    // We sort so the OIDs are in the same order. a[i] should === b[i].
    const akeys = Array.from(scamap.keys()).sort();
    const bkeys = Array.from(scbmap.keys()).sort();
    for (let i = 0; i < akeys.length; i++) {
        const akey = akeys[i];
        const bkey = bkeys[i];
        if (akey !== bkey) {
            // The security categories differ by an OID.
            return null;
        }
        const ascat = scamap.get(akey);
        const bscat = scbmap.get(bkey);
        if (!ascat || !bscat) {
            return null;
        }
        if (!compareElements(ascat.value, bscat.value)) {
            // The security categories differ by a value.
            return null;
        }
    }
    // The security categories matched so far. Now we compare the classList.
    return classListPrivilegeLevel(ad.classList) - classListPrivilegeLevel(bd.classList);
}

export default wildboarPrivilegeComparator;

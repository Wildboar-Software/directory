import { AttributeType } from "@wildboar/x500/InformationFramework";
import type { PrivilegeComparator } from "../types/index.js";
import { ASN1Element } from "@wildboar/asn1";
import { compareElements } from "@wildboar/x500";

export
const defaultPrivilegeComparator: PrivilegeComparator = (
    _attr_type: AttributeType,
    a: ASN1Element,
    b: ASN1Element,
): number | undefined | null => {
    if (compareElements(a, b)) {
        return 0;
    } else {
        return undefined;
    }
}

export default defaultPrivilegeComparator;

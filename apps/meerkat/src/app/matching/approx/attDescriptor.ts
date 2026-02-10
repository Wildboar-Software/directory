import { Buffer } from "node:buffer";
import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    AttributeDescriptorSyntax,
    _decode_AttributeDescriptorSyntax,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { directoryStringToString } from "@wildboar/x500";

export
const attDescriptor: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: AttributeDescriptorSyntax = _decode_AttributeDescriptorSyntax(assertion);
    const v: AttributeDescriptorSyntax = _decode_AttributeDescriptorSyntax(value);

    if (a.identifier.toString() !== v.identifier.toString()) {
        return false;
    }

    if (Buffer.compare(a.attributeSyntax, v.attributeSyntax)) {
        return false;
    }

    if (a.name && (a.name.trim().toLowerCase() !== v.name?.trim().toLowerCase())) {
        return false;
    }

    if (a.description && (a.description.trim().toLowerCase() !== v.description?.trim().toLowerCase())) {
        return false;
    }

    if (a.dominationRule.privilegePolicy.isEqualTo(v.dominationRule.privilegePolicy)) {
        return false;
    }

    const aPol = a.dominationRule.privPolSyntax;
    const vPol = v.dominationRule.privPolSyntax;

    if (
        ("content" in aPol)
        && ("content" in vPol)
        && (
            directoryStringToString(aPol.content).trim().toLowerCase()
            !== directoryStringToString(vPol.content).trim().toLowerCase()
        )
    ) {
        return false;
    }

    // dominationRule.privPolSyntax.pointer will not be checked for a match.

    return true;
}

export default attDescriptor;

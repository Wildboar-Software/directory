import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    id_ce_acceptableCertPolicies,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    AcceptableCertPoliciesSyntax,
    _decode_AcceptableCertPoliciesSyntax,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    AttributeCertificate,
    _decode_AttributeCertificate,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import type {
    Extension,
} from "@wildboar/x500/AuthenticationFramework";
import { DERElement } from "@wildboar/asn1";
import most from "../../utils/most.js";

export
const acceptableCertPoliciesMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: AcceptableCertPoliciesSyntax = _decode_AcceptableCertPoliciesSyntax(assertion);
    const v: AttributeCertificate = _decode_AttributeCertificate(value);
    const ext: Extension | undefined = v.toBeSigned.extensions
        ?.find((ext: Extension): boolean => ext.extnId.isEqualTo(id_ce_acceptableCertPolicies));
    if (!ext) {
        return false;
    }
    const el: DERElement = new DERElement();
    el.fromBytes(ext.extnValue);
    const storedValue: AcceptableCertPoliciesSyntax = _decode_AcceptableCertPoliciesSyntax(el);
    const storedPolicies: Set<string> = new Set(storedValue.map((oid) => oid.toString()));
    return most(a, (oid: OBJECT_IDENTIFIER) => storedPolicies.has(oid.toString()));
}

export default acceptableCertPoliciesMatch;

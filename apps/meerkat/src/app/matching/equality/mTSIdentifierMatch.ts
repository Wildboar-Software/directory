import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_MTSIdentifier,
} from "@wildboar/x400/MTSAbstractService";

// MTSIdentifier ::= [APPLICATION 4]  SEQUENCE {
//     global-domain-identifier  GlobalDomainIdentifier,
//     local-identifier          LocalIdentifier
//   }

// LocalIdentifier ::= IA5String(SIZE (1..ub-local-id-length))

// GlobalDomainIdentifier ::= [APPLICATION 3]  SEQUENCE {
//     country-name                CountryName,
//     administration-domain-name  AdministrationDomainName,
//     private-domain-identifier   PrivateDomainIdentifier OPTIONAL
// }

// AdministrationDomainName ::= [APPLICATION 2]  CHOICE {
//     numeric    NumericString(SIZE (0..ub-domain-name-length)),
//     printable  PrintableString(SIZE (0..ub-domain-name-length))
// }

// PrivateDomainIdentifier ::= CHOICE {
//     numeric    NumericString(SIZE (1..ub-domain-name-length)),
//     printable  PrintableString(SIZE (1..ub-domain-name-length))
// }


export
const mTSIdentifierMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_MTSIdentifier(assertion);
    const v = _decode_MTSIdentifier(value);
    const aglob = a.global_domain_identifier;
    const vglob = v.global_domain_identifier;

    // Country Comparison
    // TODO: Support translation between ISO-3166 CC and X.121 DCC Code
    const aCountry = ("x121_dcc_code" in aglob.country_name)
        ? aglob.country_name.x121_dcc_code.trim().replace(/\s+/g, "")
        : aglob.country_name.iso_3166_alpha2_code.slice(0, 2); // TODO: Slice(0,2) all usage of ISO-3166 codes.
    const vCountry = ("x121_dcc_code" in vglob.country_name)
        ? vglob.country_name.x121_dcc_code.trim().replace(/\s+/g, "")
        : vglob.country_name.iso_3166_alpha2_code.slice(0, 2); // TODO: Slice(0,2) all usage of ISO-3166 codes.
    if (aCountry !== vCountry) {
        return false;
    }

    // Administration Domain Name Comparison
    const aadn = aglob.administration_domain_name;
    const vadn = vglob.administration_domain_name;
    const aadnStr = ("numeric" in aadn)
        ? aadn.numeric.trim().replace(/\s+/g, "")
        : aadn.printable.replace(/\s+/g, " ");
    const vadnStr = ("numeric" in vadn)
        ? vadn.numeric.trim().replace(/\s+/g, "")
        : vadn.printable.replace(/\s+/g, " ");;
    if (aadnStr.toUpperCase() !== vadnStr.toUpperCase()) {
        return false;
    }

    // Private Domain Identifier Comparison
    if (aglob.private_domain_identifier) {
        const apdn = aglob.administration_domain_name;
        const vpdn = vglob.administration_domain_name;
        const apdnStr = ("numeric" in apdn)
            ? apdn.numeric.trim().replace(/\s+/g, "")
            : apdn.printable.replace(/\s+/g, " ");
        const vpdnStr = ("numeric" in vpdn)
            ? vpdn.numeric.trim().replace(/\s+/g, "")
            : vpdn.printable.replace(/\s+/g, " ");
        if (apdnStr.toUpperCase() !== vpdnStr.toUpperCase()) {
            return false;
        }
    }

    // Local Identifier Comparison
    if (
        a.local_identifier.trim().replace(/\s+/g, " ").toUpperCase()
        !== v.local_identifier.trim().replace(/\s+/g, " ").toUpperCase()
    ) {
        return false;
    }

    return true;
}

export default mTSIdentifierMatch;

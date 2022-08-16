import type { Context } from "@wildboar/meerkat-types";
import type { ASN1Element } from "asn1-ts";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import { _decode_ORName } from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORName.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import {
    _decode_ORAddress,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORAddress.ta";
import { orAddressesMatch } from "./orAddressUtilities";

export
function getORNameExactMatcher (ctx: Context): EqualityMatcher {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return(
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        // If the two values are byte-for-byte equal, return.
        if (!Buffer.compare(assertion.value, value.value)) {
            return true;
        }
        const a = _decode_ORName(assertion);
        const v = _decode_ORName(value);
        const directoryNameAsserted: boolean = !!a.directory_name;
        const directoryNamePresent: boolean = !!v.directory_name;
        const orAddressAsserted: boolean = !!(
            a.built_in_domain_defined_attributes?.length
            || a.extension_attributes?.length
            || a.built_in_standard_attributes.administration_domain_name
            || a.built_in_standard_attributes.country_name
            || a.built_in_standard_attributes.network_address
            || a.built_in_standard_attributes.numeric_user_identifier
            || a.built_in_standard_attributes.organization_name
            || a.built_in_standard_attributes.organizational_unit_names
            || a.built_in_standard_attributes.personal_name
            || a.built_in_standard_attributes.private_domain_name
            || a.built_in_standard_attributes.terminal_identifier
        );
        const orAddressPresent: boolean = !!(
            v.built_in_domain_defined_attributes?.length
            || v.extension_attributes?.length
            || v.built_in_standard_attributes.administration_domain_name
            || v.built_in_standard_attributes.country_name
            || v.built_in_standard_attributes.network_address
            || v.built_in_standard_attributes.numeric_user_identifier
            || v.built_in_standard_attributes.organization_name
            || v.built_in_standard_attributes.organizational_unit_names
            || v.built_in_standard_attributes.personal_name
            || v.built_in_standard_attributes.private_domain_name
            || v.built_in_standard_attributes.terminal_identifier
        );
        if (directoryNameAsserted && !directoryNamePresent) {
            return false;
        }
        if (orAddressAsserted && !orAddressPresent) {
            return false;
        }
        if (directoryNameAsserted) {
            const v = _decode_ORName(value);
            if (!v.directory_name) {
                return false;
            }
            const namesMatch = compareDistinguishedName(
                a.directory_name!.rdnSequence,
                v.directory_name.rdnSequence,
                namingMatcher,
            );
            if (!namesMatch) {
                return false;
            }
            const a2 = _decode_ORAddress(assertion);
            const v2 = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
            return orAddressesMatch(a2, v2);
        }
        if (orAddressAsserted) {
            const a2 = _decode_ORAddress(assertion);
            const v2 = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
            return orAddressesMatch(a2, v2);
        }
        return true;
    };
}

export default getORNameExactMatcher;

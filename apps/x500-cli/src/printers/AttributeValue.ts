import type { ASN1Element } from "@wildboar/asn1";
import type { Context, AttributeInfo } from "../types.js";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import printValue from "./Value.js";
import { dn } from "@wildboar/x500/SelectedAttributeTypes";
import stringifyDN from "../utils/stringifyDN.js";
import { getLDAPSyntax } from "../getLDAPSyntax.js";

export
function printAttributeValue (
    ctx: Context,
    value: ASN1Element,
    spec?: AttributeInfo,
): string {
    const ldapSyntax = spec && getLDAPSyntax(ctx, spec.id);
    if (ldapSyntax?.id.isEqualTo(dn["&id"])) {
        const dn_ = _decode_DistinguishedName(value);
        return stringifyDN(ctx, dn_);
    }
    if (spec?.valuePrinter) {
        const printed = spec.valuePrinter(ctx, value);
        return printed ?? printValue(value);
    } else {
        return printValue(value);
    }
}

export default printAttributeValue;

import type { ASN1Element } from "asn1-ts";
import type { Context, AttributeInfo } from "../types";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printValue from "./Value";
import { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
import stringifyDN from "../utils/stringifyDN";
import { getLDAPSyntax } from "../getLDAPSyntax";

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

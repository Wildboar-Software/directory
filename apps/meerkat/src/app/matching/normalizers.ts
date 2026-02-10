import { Buffer } from "node:buffer";
import type { Context, ValueNormalizer } from "../types/index.js";
import { ASN1Element, ASN1TagClass, ASN1UniversalType, BERElement } from "@wildboar/asn1";
import { directoryStringToString, getDateFromTime } from "@wildboar/x500";
import { prepString } from "@wildboar/x500";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_AttributeTypeAndValue,
} from "@wildboar/pki-stub";
import {
    _decode_PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import getEqualityNormalizer from "../x500/getEqualityNormalizer.js";
import { _decode_Time } from "@wildboar/x500/AuthenticationFramework";
import {
    _decode_AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";

export const caseIgnoreMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const str = _decode_UnboundedDirectoryString(value);
    return prepString(directoryStringToString(str).toUpperCase());
};

export const caseExactMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const str = _decode_UnboundedDirectoryString(value);
    return prepString(directoryStringToString(str));
};

export const booleanMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.boolean ? "TRUE" : "FALSE";
};

export const integerMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.integer.toString();
};

export const objectIdentifierMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.objectIdentifier.toString();
};

export const bitStringMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const bits = Array.from(value.bitString);
    const buf = Buffer.allocUnsafe(bits.length);
    for (let i = 0; i < bits.length; i++) {
        buf[i] = bits[i] ? 0x31 : 0x30;
    }
    return buf.toString("latin1");
};

export const generalizedTimeMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const date = value.generalizedTime;
    const year: string = date.getUTCFullYear().toString();
    const month: string = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");
    const hour: string = date.getUTCHours().toString().padStart(2, "0");
    const minute: string = date.getUTCMinutes().toString().padStart(2, "0");
    const second: string = date.getUTCSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}Z`;
};

export const utcTimeMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const date = value.generalizedTime;
    let year: string = date.getUTCFullYear().toString();
    year = (year.substring(year.length - 2, year.length)); // Will fail if you supply a <2 digit date.
    const month: string = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");
    const hour: string = date.getUTCHours().toString().padStart(2, "0");
    const minute: string = date.getUTCMinutes().toString().padStart(2, "0");
    const second: string = date.getUTCSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}Z`;
};

export const octetStringMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const oct = value.octetString;
    return Buffer.from(
        oct.buffer,
        oct.byteOffset,
        oct.byteLength,
    ).toString("base64");
};

export const numericStringMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.numericString.replace(/\s+/g, "");
};

export const telephoneNumberMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.printableString.replace(/\D+/g, ""); // Delete all non-digits.
};

export const dnsNameMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.utf8String.toLowerCase();
};

export const intEmailMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.utf8String.toLowerCase();
};

export const jidMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.utf8String.toLowerCase();
};

export const directoryStringFirstComponentMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const first_component = value.sequence[0];
    if (!first_component) {
        return undefined;
    }
    return caseIgnoreMatch(ctx, first_component);
};

export const integerFirstComponentMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const first_component = value.sequence[0];
    if (!first_component) {
        return undefined;
    }
    return integerMatch(ctx, first_component);
};

export const objectIdentifierFirstComponentMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const first_component = value.sequence[0];
    if (!first_component) {
        return undefined;
    }
    return objectIdentifierMatch(ctx, first_component);
};

export const caseIgnoreListMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const substrs: string[] = [];
    for (const el of value.sequence) {
        substrs.push(el.utf8String.replace(/\r?\n/g, "\n"));
    }
    return substrs.join("\n");
};

export const caseIgnoreIA5Match: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return prepString(value.ia5String.toUpperCase());
};

export const caseExactIA5Match: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return prepString(value.ia5String);
};

export const rdnMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const atav_els = value.set;
    const atav_strs: string[] = [];
    for (const el of atav_els) {
        const atav = _decode_AttributeTypeAndValue(el);
        const normalized_value: string | undefined = getEqualityNormalizer(ctx)(atav.type_)?.(ctx, atav.value);
        if (!normalized_value) {
            return undefined;
        }
        const value_str = normalized_value
            .replace(/\+/g, "\\+")
            .replace(/,/g, "\\,");
        atav_strs.push(`${atav.type_.toString()}=${value_str}`);
    }
    return atav_strs.sort().join("+");
};

export const distinguishedNameMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const dn = value.sequence;
    const rdns: string[] = [];
    for (const rdn of dn) {
        const normalized_rdn = rdnMatch(ctx, rdn);
        if (!normalized_rdn) {
            return undefined;
        }
        rdns.push(normalized_rdn);
    }
    return rdns.join(",");
};

export const uuidMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const oct = value.octetString;
    return Buffer.from(
        oct.buffer,
        oct.byteOffset,
        oct.byteLength,
    ).toString("base64");
};

export const dualStringMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const els = value.sequence;
    if (els.length < 2) {
        return undefined;
    }
    const str1 = caseExactMatch(ctx, els[0])?.replace(/\x03/, "");
    const str2 = caseExactMatch(ctx, els[1])?.replace(/\x03/, "");
    if (!str1 || !str2) {
        return undefined;
    }
    return `${str1}\x03${str2}`;
};

export const accessPointMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const name_el = value.sequence[0]?.inner;
    if (!name_el) {
        return undefined;
    }
    return distinguishedNameMatch(ctx, name_el);
};

export const masterAndShadowAccessPointsMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const mosap_els = value.set;
    const dn_strs: string[] = [];
    for (const el of mosap_els) {
        const name_el = el.sequence[0]?.inner;
        if (!name_el) {
            return undefined;
        }
        const str = distinguishedNameMatch(ctx, name_el);
        if (!str) {
            return undefined;
        }
        dn_strs.push(str.replace(/|/g, "\\|"));
    }
    return dn_strs.sort().join("|");
};

export const presentationAddressMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const paddr = _decode_PresentationAddress(value);
    const p = paddr.pSelector;
    const s = paddr.sSelector;
    const t = paddr.tSelector;
    const naddrs = paddr.nAddresses;
    const pstr = p
        ? Buffer.from(p.buffer, p.byteOffset, p.byteLength).toString("base64")
        : "?";
    const sstr = s
        ? Buffer.from(s.buffer, s.byteOffset, s.byteLength).toString("base64")
        : "?";
    const tstr = t
        ? Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("base64")
        : "?";
    const nstrs: string[] = [];
    for (const naddr of naddrs) {
        const nstr = Buffer.from(
            naddr.buffer,
            naddr.byteOffset,
            naddr.byteLength,
        ).toString("base64");
        nstrs.push(nstr);
    }
    return `${pstr}:${sstr}:${tstr}:${nstrs.sort().join(",")}`;
};

export const protocolInformationMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    // const pinfo = _decode_ProtocolInformation(value);
    const el = new BERElement();
    el.fromBytes(value.value);
    const naddr = el.octetString;
    return Buffer.from(naddr.buffer, naddr.byteOffset, naddr.byteLength).toString("base64");
};

export const uUIDPairMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const els = value.sequence;
    if (els.length < 2) {
        return undefined;
    }
    const str1 = uuidMatch(ctx, els[0]);
    const str2 = uuidMatch(ctx, els[1]);
    if (!str1 || !str2) {
        return undefined;
    }
    return `${str1}:${str2}`;
};

export const facsimileNumberMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const tel_el = value.sequence[0];
    if (!tel_el) {
        return undefined;
    }
    return telephoneNumberMatch(ctx, tel_el);
};

export const signingTimeMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const date = getDateFromTime(_decode_Time(value));
    const year: string = date.getUTCFullYear().toString();
    const month: string = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");
    const hour: string = date.getUTCHours().toString().padStart(2, "0");
    const minute: string = date.getUTCMinutes().toString().padStart(2, "0");
    const second: string = date.getUTCSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}Z`;
};

export const pkcs9CaseIgnoreMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    if (value.tagClass !== ASN1TagClass.universal) {
        return value.utf8String.toUpperCase();
    }
    else if (value.tagNumber === ASN1UniversalType.ia5String) {
        return value.ia5String.toUpperCase();
    }
    else if (value.tagNumber === ASN1UniversalType.generalString) {
        return value.generalString.toUpperCase();
    }
    const str = _decode_UnboundedDirectoryString(value);
    return directoryStringToString(str).toUpperCase();
};

export const algorithmIdentifierMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const algid_el = value.sequence[0];
    if (!algid_el) {
        return undefined;
    }
    const algid = _decode_AlgorithmIdentifier(algid_el);
    if (!algid.parameters) {
        return algid.algorithm.toString();
    }
    const param_bytes = algid.parameters.toBytes();
    const param_buf = Buffer.from(
        param_bytes.buffer,
        param_bytes.byteOffset,
        param_bytes.byteLength,
    );
    return `${algid.algorithm.toString()}:${param_buf.toString("base64")}`;
};

export const pwdEncAlgMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const algid = _decode_AlgorithmIdentifier(value);
    if (!algid.parameters) {
        return algid.algorithm.toString();
    }
    const param_bytes = algid.parameters.toBytes();
    const param_buf = Buffer.from(
        param_bytes.buffer,
        param_bytes.byteOffset,
        param_bytes.byteLength,
    );
    return `${algid.algorithm.toString()}:${param_buf.toString("base64")}`;
};

export const policyMatch: ValueNormalizer = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    return value.sequence[0]?.objectIdentifier.toString();
};

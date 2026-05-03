import {
    ASN1UniversalType,
    ASN1Element,
    ASN1TagClass,
    packBits,
} from "@wildboar/asn1";
import { prepString, directoryStringToString } from "@wildboar/x500";
import {
    _decode_UnboundedDirectoryString,
    urnC,
    uiiInUrn,
    telephoneNumber,
    facsimileTelephoneNumber,
    postalAddress,
    registeredAddress,
    intEmail,
    dnsName,
    uUIDPair,
} from "@wildboar/x500/SelectedAttributeTypes";
import type { AttributeType } from "@wildboar/x500/InformationFramework";
import { domainToASCII } from "node:url";

// TODO: Move this module to @wildboar/x500

function dumbAttributeValueIndexer (value: ASN1Element): string {
    return "#" + Buffer.from(value.toBytes()).toString("hex");
}

const DS_STRING_TAGS = new Set([
    ASN1UniversalType.printableString,
    ASN1UniversalType.utf8String,
    ASN1UniversalType.teletexString,
    ASN1UniversalType.bmpString,
    ASN1UniversalType.universalString,
]);

const TELEPHONE_OIDS = new Set([
    telephoneNumber["&id"].toString(),
    "0.9.2342.19200300.100.1.20", // homePhone in COSINE
    "0.9.2342.19200300.100.1.41", // mobileTelephoneNumber in COSINE
    "0.9.2342.19200300.100.1.42", // pagerTelephoneNumber in COSINE
]);

const POSTAL_OIDS = new Set([
    postalAddress["&id"].toString(),
    registeredAddress["&id"].toString(),
    "0.9.2342.19200300.100.1.39", // homePostalAddress in COSINE
]);

function getEmailAddressKey (s: string): string | undefined {
    const sep = s.lastIndexOf("@");
    if (sep < 0) {
        return undefined;
    }
    const localPart = prepString(s.slice(0, sep))?.toLowerCase();
    if (!localPart) {
        return undefined;
    }
    const domainPart = s.slice(sep + 1);
    const normalizedDomain = domainToASCII(domainPart).toLowerCase();
    return (localPart + "@" + normalizedDomain);
}

function hex(b: Uint8Array): string {
    return Buffer.from(b.buffer, b.byteOffset, b.byteLength).toString("hex");
}

// TODO: Does Meerkat DSA actually prevent you from using DN values in a DN?

/**
 * @summary Normalize most values used in distinguished names for comparison
 * @description
 *
 * This function takes an attribute type and value, as would appear in a
 * distinguished name, and converts the value to a string such that two values
 * that match according to that attribute type's defined equality matching rules
 * will also produce identical strings. Therefore, this function gives you a way
 * to compare many-to-many attribute types and values efficiently; you can
 * run the values through this function, insert them into a `Set<string>` and
 * efficiently check for duplicates / matches by seeing if each produced string
 * is already present.
 *
 * This function does not handle values that are themselves encodings of
 * distinguished names, since attribute values having a distinguished name
 * syntax are forbidden from appearing in distinguished names.
 *
 * This function is imperfect, because it could never recognize all attribute
 * types that could ever be defined, but it is good enough for 99% of use cases,
 * especially when values are DER-encoded, owing in part to the fact that the
 * overwhelming majority of string values are compared using the
 * `caseIgnoreMatch` rule (even then, a few exceptions, such as `urnC` are
 * hard-coded to be compared using `caseExactMatch`).
 *
 * There is hard-coded handling for some known telephone number and fax number
 * types, but even if unrecognized, printable strings are compared as telephone
 * numbers if they both start with a plus sign and look like phone numbers by
 * other criteria.
 *
 * To clarify, this function is not a suitable replacement for full attribute
 * value matching: it is only suitable for stringifying distinguished names for
 * efficient many-to-many comparison.
 *
 * This function does not catch errors at all.
 *
 * @param type_ The attribute type
 * @param value The attribute value
 * @returns A `string` which will be the same for two matching values or
 *  `undefined` if a directory string value contains a prohibited character or
 *  if the attribute value is malformed in some other way.
 * @function
 */
export
function getDistinguishedValueKey (type_: AttributeType, value: ASN1Element): string | undefined {
    if (value.tagClass !== ASN1TagClass.universal) {
        return dumbAttributeValueIndexer(value);
    }
    const typestr = type_.toString();
    if (POSTAL_OIDS.has(typestr)) {
        const lines = value.sequence
            .map((line) => {
                const ds = _decode_UnboundedDirectoryString(line);
                const s = directoryStringToString(ds);
                return prepString(s)?.toUpperCase().replaceAll("$", "\\$");
            });
        if (lines.some((line) => typeof line === "undefined")) {
            return undefined; // There was a prohibited character.
        }
        return lines.join("$");
    }

    if (type_.isEqualTo(facsimileTelephoneNumber["&id"])) {
        const tel = value.sequence[0].printableString;
        return tel?.replaceAll("-", "");
    }
    if (type_.isEqualTo(uUIDPair["&id"])) {
        const seq = value.sequence;
        const issuer = seq[0].octetString;
        const subject = seq[1].octetString;
        if ((issuer.length !== 16) || (subject.length !== 16)) {
            return undefined;
        }
        return hex(issuer) + ":" + hex(subject);
    }
    // NOTE: jidMatch requires basically octet-by-octet equality between values. Nothing done here.
    // TODO: uriMatch is not handled here. It is just too complicated.
    if (DS_STRING_TAGS.has(value.tagNumber)) {
        if (type_.isEqualTo(intEmail["&id"])) {
            const s = value.utf8String.trim();
            return getEmailAddressKey(s);
        }
        if (type_.isEqualTo(dnsName["&id"])) {
            const s = value.utf8String.trim();
            return domainToASCII(s).toLowerCase();
        }
        const ds = _decode_UnboundedDirectoryString(value);
        const s = directoryStringToString(ds).trim();
        const isTelephoneNumber = TELEPHONE_OIDS.has(typestr);
        const looksLikeTelephoneNumber = !isTelephoneNumber && (
            value.tagNumber === ASN1UniversalType.printableString
            && s.startsWith("+")
            && s.length >= 3 // Must include +, a country code (1 digit), and subscriber number (1 digit)
            && s.length <= 32 // E.164 limits to 15, but X.500 limits to 32.
        );
        // This looks like a phone number. Compare using telephoneNumbeMatch.
        if (isTelephoneNumber || looksLikeTelephoneNumber) {
            const tn = s.replaceAll("-", "").replaceAll(" ", "");
            if (tn.length <= 15 && /\d+/.test(tn.slice(1))) {
                // If all digits, compare as a telephone number.
                return tn;
            }
        }
        const looksLikeEmailAddress = (s.indexOf("@") > 0) && (s.length >= 3);
        if (looksLikeEmailAddress) {
            return getEmailAddressKey(s);
        }
        const ps = prepString(s);
        if (type_.isEqualTo(urnC["&id"]) || type_.isEqualTo(uiiInUrn["&id"])) {
            return ps;
        }
        return ps?.toLowerCase();
    }
    if (value.tagNumber === ASN1UniversalType.ia5String) {
        const s = value.ia5String;
        const ps = prepString(s);
        return ps?.toLowerCase();
    }
    if (value.tagNumber === ASN1UniversalType.numericString) {
        const s = value.numericString;
        return s.trim().replaceAll(" ", "");
    }
    if (
        value.tagNumber === ASN1UniversalType.generalizedTime
        || value.tagNumber === ASN1UniversalType.utcTime
    ) {
        const t = value.tagNumber === ASN1UniversalType.utcTime
            ? value.utcTime.toISOString()
            : value.generalizedTime.toISOString();
        const periodIdx = t.indexOf(".");
        if (periodIdx === -1) {
            return t;
        }
        // generalizedTimeMatch compares only up to seconds.
        return t.slice(0, periodIdx);
    }
    if (value.tagNumber === ASN1UniversalType.bitString) {
        const bs = value.bitString;
        const packed = packBits(bs);
        return (
            bs.length
            + ":"
            + hex(packed)
        );
    }
    if (value.tagNumber === ASN1UniversalType.octetString) {
        const os = value.octetString;
        return hex(os);
    }
    /* All remaining types are either unrecognized, have no common X.500
    directory usage, or are encoded the exact same way between BER, CER, and
    DER serializations. */
    return dumbAttributeValueIndexer(value);
}

export default getDistinguishedValueKey;

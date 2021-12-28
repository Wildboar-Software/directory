import {
    ASN1Element,
    ASN1UniversalType,
    ASN1TagClass,
    BIT_STRING,
    OCTET_STRING,
    RELATIVE_OID,
    TIME_OF_DAY,
    packBits,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import {
    Context,
    SortKey,
} from "@wildboar/meerkat-types";

/**
 * @description
 *
 * You might be wondering why the blank buffer begins with the most significant
 * byte unset (assuming it is big-endian). This is because, outside of MySQL,
 * unsigned integers are not supported. To work across multiple database, all
 * of these values must be able to fit within signed big integers. With that in
 * mind, you _could_ theoretically try to use the seven bits following the most
 * significant bit, but it would mean that, to sort properly, you'd have to
 * shift every byte over by one bit, which would be a far worse outcome. Seven
 * bytes are generally enough to differentiate values of a given type.
 *
 * @returns
 */
function createBlankBigIntBuffer (): Buffer {
    return Buffer.from([ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
}

function calculateSortKeyForBitString (bits: BIT_STRING): SortKey {
    const buf = createBlankBigIntBuffer();
    buf.set(packBits(bits).slice(0, 7), 1);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForOctetString (octetString: OCTET_STRING): SortKey {
    const buf = createBlankBigIntBuffer();
    buf.set(octetString.slice(0, 7), 1);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForObjectIdentifier (el: ASN1Element): SortKey {
    const oid = el.objectIdentifier;
    const nodes = oid.nodes;
    const buf = createBlankBigIntBuffer();
    buf.set(el.value.slice(0, 7), 1);
    buf.writeUInt16BE(Math.min(nodes[nodes.length - 2], 65535), 4);
    buf.writeUInt16BE(Math.min(nodes[nodes.length - 1], 65535), 6);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForROID (roid: RELATIVE_OID): SortKey {
    const buf = createBlankBigIntBuffer();
    buf[1] = Math.max(roid[0], 0xFF);
    roid
        .slice(1, 4)
        .forEach((arc, i) => {
            buf.writeUInt16BE(Math.min(arc, 65535), i * 2);
        });
    return buf.readBigUInt64BE();
}

function calculateSortKeyForReal (el: ASN1Element): SortKey {
    const buf = createBlankBigIntBuffer();
    buf.set(el.value.slice(0, 7), 1);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForString (str: string): SortKey {
    const buf = createBlankBigIntBuffer();
    buf.set(Buffer.from(str.toUpperCase(), "utf-8").slice(0, 7), 1);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForNumericString (str: string): SortKey {
    const buf = createBlankBigIntBuffer();
    const normalized = str.replace(/\s+/, "");
    buf.set(Buffer.from(normalized, "utf-8").slice(0, 7), 1);
    return buf.readBigUInt64BE();
}

function calculateSortKeyForTimeOfDay (tod: TIME_OF_DAY): SortKey {
    return BigInt(
        (tod.getUTCHours() << 16)
        + (tod.getUTCMinutes() << 8)
        + tod.getUTCSeconds()
    );
}

export
function calculateSortKey (
    ctx: Context,
    type_: OBJECT_IDENTIFIER,
    element: ASN1Element,
): SortKey {
    const spec = ctx.attributeTypes.get(type_.toString());
    const omrOID = spec?.orderingMatchingRule;
    const omr = omrOID
        ? ctx.orderingMatchingRules.get(omrOID.toString())
        : undefined;
    if (omr?.sortKeyGetter) {
        return omr.sortKeyGetter(element);
    }
    if (element.tagClass !== ASN1TagClass.universal) {
        return null;
    }
    try {
        switch (element.tagNumber) {
            case (ASN1UniversalType.endOfContent): return null;
            case (ASN1UniversalType.boolean): return BigInt(element.boolean ? 1 : 0);
            case (ASN1UniversalType.integer): return BigInt(element.integer);
            case (ASN1UniversalType.bitString): return calculateSortKeyForBitString(element.bitString);
            case (ASN1UniversalType.octetString): return calculateSortKeyForOctetString(element.octetString);
            case (ASN1UniversalType.nill): return null;
            case (ASN1UniversalType.objectIdentifier): return calculateSortKeyForObjectIdentifier(element);
            case (ASN1UniversalType.objectDescriptor): return calculateSortKeyForString(element.objectDescriptor);
            case (ASN1UniversalType.external): return null;
            case (ASN1UniversalType.realNumber): return calculateSortKeyForReal(element);
            case (ASN1UniversalType.enumerated): return BigInt(element.enumerated);
            case (ASN1UniversalType.embeddedPDV): return null;
            case (ASN1UniversalType.utf8String): return calculateSortKeyForString(element.utf8String);
            case (ASN1UniversalType.relativeOID): return calculateSortKeyForROID(element.relativeObjectIdentifier);
            case (ASN1UniversalType.time): return calculateSortKeyForString(element.time);
            case (ASN1UniversalType.sequence): return null;
            case (ASN1UniversalType.set): return null;
            case (ASN1UniversalType.numericString): return calculateSortKeyForNumericString(element.numericString);
            case (ASN1UniversalType.printableString): return calculateSortKeyForString(element.printableString);
            case (ASN1UniversalType.teletexString): return calculateSortKeyForOctetString(element.teletexString);
            case (ASN1UniversalType.videotexString): return calculateSortKeyForOctetString(element.videotexString);
            case (ASN1UniversalType.ia5String): return calculateSortKeyForString(element.ia5String);
            case (ASN1UniversalType.utcTime): return BigInt(element.utcTime.valueOf());
            case (ASN1UniversalType.generalizedTime): return BigInt(element.generalizedTime.valueOf());
            case (ASN1UniversalType.graphicString): return calculateSortKeyForString(element.graphicString);
            case (ASN1UniversalType.visibleString): return calculateSortKeyForString(element.visibleString);
            case (ASN1UniversalType.generalString): return calculateSortKeyForString(element.generalString);
            case (ASN1UniversalType.universalString): return calculateSortKeyForString(element.universalString);
            case (ASN1UniversalType.characterString): return null;
            case (ASN1UniversalType.bmpString): return calculateSortKeyForString(element.bmpString);
            case (ASN1UniversalType.date): return BigInt(element.date.valueOf());
            case (ASN1UniversalType.timeOfDay): return calculateSortKeyForTimeOfDay(element.timeOfDay);
            case (ASN1UniversalType.dateTime): return BigInt(element.dateTime.valueOf());
            case (ASN1UniversalType.duration): return calculateSortKeyForString(element.duration.toString());
            case (ASN1UniversalType.oidIRI): return calculateSortKeyForString(element.oidIRI);
            case (ASN1UniversalType.roidIRI): return calculateSortKeyForString(element.relativeOIDIRI);
            default: {
                return null;
            }
        }
    } catch (e) {
        return null;
    }
}

export default calculateSortKey;

import {
    ASN1Element,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
} from "asn1-ts";


export
function printValue (value: ASN1Element): string {
    if (value.tagClass === ASN1TagClass.universal) {
        switch (value.tagNumber) {
        case (ASN1UniversalType.endOfContent): return "END-OF-CONTENT";
        case (ASN1UniversalType.boolean): return (value.boolean ? "TRUE" : "FALSE");
        case (ASN1UniversalType.integer): return value.integer.toString();
        case (ASN1UniversalType.bitString):
            return `'${Array
                .from(value.bitString)
                .map((num) => num.toString())
                .join("")
            }'B`;
        case (ASN1UniversalType.octetString):
            return `'${Array
                .from(value.octetString)
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("")
            }'H`;
        case (ASN1UniversalType.nill): return "NULL";
        case (ASN1UniversalType.objectIdentifier): return value.objectIdentifier.toString();
        case (ASN1UniversalType.objectDescriptor): return `"${value.objectDescriptor}"`;
        case (ASN1UniversalType.external): return "EXTERNAL";
        case (ASN1UniversalType.realNumber): return value.real.toString();
        case (ASN1UniversalType.enumerated): return value.enumerated.toString();
        case (ASN1UniversalType.embeddedPDV): return "EMBEDDED PDV";
        case (ASN1UniversalType.utf8String): return `"${value.utf8String}"`;
        case (ASN1UniversalType.relativeOID): return value.relativeObjectIdentifier.join(".");
        case (ASN1UniversalType.time): return `"${value.time}"`;
        case (ASN1UniversalType.sequence): return ("{ " + value.sequence
            .map((el) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString()))
            .join(" , ") + " }");
        case (ASN1UniversalType.set): return ("{ " + value.set
            .map((el) => (el.name.length ? `${el.name} ${el.toString()}` : el.toString()))
            .join(" , ") + " }");
        case (ASN1UniversalType.numericString): return `"${value.numericString}"`;
        case (ASN1UniversalType.printableString): return `"${value.printableString}"`;
        case (ASN1UniversalType.teletexString): return "TeletexString";
        case (ASN1UniversalType.videotexString): return "VideotexString";
        case (ASN1UniversalType.ia5String): return `"${value.ia5String}"`;
        case (ASN1UniversalType.utcTime): return `"${value.utcTime.toISOString()}"`;
        case (ASN1UniversalType.generalizedTime): return `"${value.generalizedTime.toISOString()}"`;
        case (ASN1UniversalType.graphicString): return `"${value.graphicString}"`;
        case (ASN1UniversalType.visibleString): return `"${value.visibleString}"`;
        case (ASN1UniversalType.generalString): return `"${value.generalString}"`;
        case (ASN1UniversalType.universalString): return `"${value.universalString}"`;
        case (ASN1UniversalType.characterString): return "CHARACTER STRING";
        case (ASN1UniversalType.bmpString): return `"${value.bmpString}"`;
        case (ASN1UniversalType.date): return `"${value.date.toISOString()}"`;
        case (ASN1UniversalType.timeOfDay): {
            const tod = value.timeOfDay;
            return `"${tod.getUTCHours()}:${tod.getUTCMinutes()}:${tod.getUTCSeconds()}"`;
        }
        case (ASN1UniversalType.dateTime): return `"${value.dateTime.toISOString()}"`;
        case (ASN1UniversalType.duration): return value.duration.toString();
        case (ASN1UniversalType.oidIRI): return value.oidIRI;
        case (ASN1UniversalType.roidIRI): return value.relativeOIDIRI;
        default: {
            return `[UNIV ${value.tagNumber}]: ${value.value.toString()}`;
        }
        }
    } else if (value.construction === ASN1Construction.constructed) {
        const inner = value.components;
        if (inner.length === 1) {
            return inner[0].toString();
        } else {
            return "{ " + inner.map((el) => el.toString()).join(", ") + " }";
        }
    } else if (value.tagClass === ASN1TagClass.context) {
        return `[CTXT ${value.tagNumber}]: ${value.value.toString()}`;
    } else if (value.tagClass === ASN1TagClass.private) {
        return `[PRIV ${value.tagNumber}]: ${value.value.toString()}`;
    } else {
        return `[APPL ${value.tagNumber}]: ${value.value.toString()}`;
    }
}

export default printValue;

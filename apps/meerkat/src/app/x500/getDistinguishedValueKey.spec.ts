import { ASN1UniversalType, ASN1Element, ASN1TagClass, DERElement, ASN1Construction, ObjectIdentifier, BERElement } from "@wildboar/asn1";
import { prepString, directoryStringToString } from "@wildboar/x500";
import {
    _decode_UnboundedDirectoryString,
    commonName,
    postalAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import { getDistinguishedValueKey } from "./getDistinguishedValueKey.js";
import { _encodeGeneralizedTime, _encodePrintableString, DER } from "@wildboar/asn1/functional";

describe("getDistinguishedValueKey", () => {

    it("compares two directory string values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            "hi mom",
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            " HI \t\r\n  MOM \r\n ",
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            "hi, mom!",
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two numeric string values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.numericString,
            " 867  5309   ",
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.numericString,
            "8675309",
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.numericString,
            "86753091",
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two bit string values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString,
            new Uint8ClampedArray([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]),
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString,
            new Uint8ClampedArray([ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]),
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.bitString,
            new Uint8ClampedArray([ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0 ]),
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two time values correctly", () => {
        const d = new Date();
        const t1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.generalizedTime,
            d,
        );
        const t2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.generalizedTime,
            d,
        );
        d.setSeconds((d.getSeconds() + 1) % 60);
        const t3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.generalizedTime,
            d,
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], t1);
        const k2 = getDistinguishedValueKey(commonName["&id"], t2);
        const k3 = getDistinguishedValueKey(commonName["&id"], t3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two email values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            "jonathan@中文.com",
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            "jonathan@xn--fiq228c.com",
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.utf8String,
            "jonathan@otherdomain.com",
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two telephone number values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.printableString,
            "+1 352 867 5309",
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.printableString,
            " +1 352-867-5309  ",
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.printableString,
            "+13528675309",
        );
        const v4 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.printableString,
            "+13528675308",
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        const k4 = getDistinguishedValueKey(commonName["&id"], v4);
        expect(k1).to.equal(k2);
        expect(k1).to.equal(k3);
        expect(k2).to.equal(k3);
        expect(k1).not.to.equal(k4);
        expect(k2).not.to.equal(k4);
        expect(k3).not.to.equal(k4);
    });

    it("compares two email values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            "2026-05-02",
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            "2026-05-02",
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            "2026-05-01",
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two integer values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            5,
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            5,
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.date,
            -5,
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two object identifier values correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
            ObjectIdentifier.fromString("2.5.4.3"),
        );
        const v2 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
            ObjectIdentifier.fromString("2.5.4.3"),
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
            ObjectIdentifier.fromString("2.5.4.4"),
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two octet strings correctly", () => {
        const v1 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.octetString,
            new Uint8Array([ 1, 2, 3, 4, 5, 6 ]),
        );
        const v2 = new BERElement( // Need BER so we can construct the octet strings
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.octetString,
            new Uint8Array([ 4, 4, 1, 2, 3, 4, 4, 2, 5, 6 ]),
        );
        const v3 = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.octetString,
            new Uint8Array([ 1, 2, 3, 4, 5 ]),
        );
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(commonName["&id"], v1);
        const k2 = getDistinguishedValueKey(commonName["&id"], v2);
        const k3 = getDistinguishedValueKey(commonName["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });

    it("compares two postal address values correctly", () => {
        const v1 = DERElement.fromSequence([
            _encodePrintableString("123 S. Main St.", DER),
            _encodePrintableString("St. Johns, FL 32259", DER),
            _encodePrintableString("United States", DER),
        ]);
        const v2 = DERElement.fromSequence([
            _encodePrintableString(" 123 S. MAIN ST.", DER),
            _encodePrintableString("St. Johns,   FL 32259", DER),
            _encodePrintableString("United States", DER),
        ]);
        const v3 = DERElement.fromSequence([
            _encodePrintableString("124 S. Main St.", DER),
            _encodePrintableString("St. Johns, FL 32259", DER),
            _encodePrintableString("United States", DER),
        ]);
        // commonName makes no sense here, but it doesn't matter.
        const k1 = getDistinguishedValueKey(postalAddress["&id"], v1);
        const k2 = getDistinguishedValueKey(postalAddress["&id"], v2);
        const k3 = getDistinguishedValueKey(postalAddress["&id"], v3);
        expect(k1).to.equal(k2);
        expect(k1).not.to.equal(k3);
    });
});

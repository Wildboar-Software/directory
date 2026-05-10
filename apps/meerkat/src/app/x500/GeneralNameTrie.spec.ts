import type { GeneralName } from "@wildboar/pki-stub";
import { domainToASCII } from "node:url";
import { getDistinguishedValueKey } from "../x500/getDistinguishedValueKey.js";
import { GeneralNameTrie } from "./GeneralNameTrie.js";
import {
    AttributeTypeAndValue,
} from "@wildboar/pki-stub";
import {
    commonName,
    surname,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";
import { ObjectIdentifier } from "@wildboar/asn1";
import { DistinguishedName } from "@wildboar/x500/InformationFramework";

describe("GeneralNameTrie", () => {

    it("returns no results when empty", () => {
        const gn: GeneralName = {
            dNSName: "asdf.zxcv.com",
        };
        const trie = new GeneralNameTrie();
        expect(trie.getValue(gn)).toBeUndefined();
        expect(Array.from(trie.descendOptionalValues(gn))).toEqual([
            undefined,
            undefined,
            undefined,
        ]);
        expect(Array.from(trie.descendValues(gn))).toEqual([]);
    });


    it("can index a value with a deep DNS name", () => {
        const gn: GeneralName = {
            dNSName: "asdf.zxcv.com",
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ dnsRoot ]  = trie.z__testingInternals();
        expect(dnsRoot.size).toBe(1);
        expect(dnsRoot.has("com\x1Fzxcv\x1Fasdf"));
        expect(trie.getValue(gn)).toBe(5);
        gn.dNSName = gn.dNSName.replace(".com", "");
        expect(trie.getValue(gn)).toBeUndefined();
        gn.dNSName = gn.dNSName.replace(".zxcv", "");
        expect(trie.getValue(gn)).toBeUndefined();
    });

    it("can index a value with a deep directory name", () => {
        const gn: GeneralName = {
            directoryName: {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ printableString: "v1" }, DER),
                        ),
                        new AttributeTypeAndValue(
                            surname["&id"],
                            surname.encoderFor["&Type"]!({ printableString: "v2" }, DER),
                        ),
                    ],
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ printableString: "v3" }, DER),
                        ),
                    ],
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            surname.encoderFor["&Type"]!({ printableString: "v4" }, DER),
                        ),
                        new AttributeTypeAndValue(
                            surname["&id"],
                            surname.encoderFor["&Type"]!({ printableString: "v5" }, DER),
                        ),
                    ],
                ],
            },
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ _, x500Root ]  = trie.z__testingInternals();
        expect(x500Root.size).toBe(1);
        expect(trie.getValue(gn)).toBe(5);
    });

    it("can index a value with an OID", () => {
        const gn: GeneralName = {
            registeredID: ObjectIdentifier.fromString("2.5.4.3")
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ _1, _2, oidRoot ]  = trie.z__testingInternals();
        expect(oidRoot.size).toBe(1);
        expect(oidRoot.has("2\x1F5\x1F4\x1F3"));
        expect(trie.getValue(gn)).toBe(5);
        const gn2: GeneralName = {
            registeredID: ObjectIdentifier.fromString("2.5.4"),
        };
        expect(trie.getValue(gn2)).toBeUndefined();
    });

    it("does not tolerate a DNS name with the ASCII unit separator in it", () => {
        const gn: GeneralName = {
            dNSName: "asdf.zx\x1Fcv.com",
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(false);
        const [ dnsRoot ]  = trie.z__testingInternals();
        expect(dnsRoot.size).toBe(0);
        expect(trie.getValue(gn)).toBeUndefined();
    });

    it("can index a value with the DNS root '.'", () => {
        const gn: GeneralName = {
            dNSName: ".",
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ dnsRoot ]  = trie.z__testingInternals();
        expect(dnsRoot.size).toBe(1);
        expect(dnsRoot.has(""));
        expect(trie.getValue(gn)).toBe(5);
    });

    it("can index a value with the DNS root ''", () => {
        const gn: GeneralName = {
            dNSName: "",
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ dnsRoot ]  = trie.z__testingInternals();
        expect(dnsRoot.size).toBe(1);
        expect(dnsRoot.has(""));
        expect(trie.getValue(gn)).toBe(5);
    });

    it("can index a value with the directory naming root", () => {
        const gn: GeneralName = {
            directoryName: {
                rdnSequence: [],
            },
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        const [ _, x500Root ]  = trie.z__testingInternals();
        expect(x500Root.size).toBe(1);
        expect(trie.getValue(gn)).toBe(5);
        gn.directoryName.rdnSequence.push([
            new AttributeTypeAndValue(
                commonName["&id"],
                commonName.encoderFor["&Type"]!({ printableString: "v1" }, DER),
            ),
        ]);
        expect(trie.getValue(gn)).toBeUndefined();
    });

    it("can index multiple prefixing DNS names", () => {
        const gn1: GeneralName = {
            dNSName: "asdf.zxcv.com",
        };
        const gn2: GeneralName = {
            dNSName: "",
        };
        const gn3: GeneralName = {
            dNSName: "qwer.asdf.zxcv.com",
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn1, 1)).toBe(true);
        expect(trie.setValue(gn2, 2)).toBe(true);
        expect(trie.setValue(gn3, 3)).toBe(true);
        const [ dnsRoot ]  = trie.z__testingInternals();
        expect(dnsRoot.size).toBe(3);
        expect(dnsRoot.has("com\x1Fzxcv\x1Fasdf")).toBe(true);
        expect(dnsRoot.has("com\x1Fzxcv\x1Fasdf\x1Fqwer")).toBe(true);
        expect(dnsRoot.has("")).toBe(true);

        expect(trie.getValue(gn1)).toBe(1);
        expect(trie.getValue(gn2)).toBe(2);
        expect(trie.getValue(gn3)).toBe(3);

        const results = Array.from(trie.descendOptionalValues(gn3));
        expect(results).toHaveLength(5); // 4 labels + 1 for root
        expect(results[0]).toBe(2);
        expect(results[1]).toBeUndefined();
        expect(results[2]).toBeUndefined();
        expect(results[3]).toBe(1);
        expect(results[4]).toBe(3);

        const results2 = Array.from(trie.descendValues(gn3));
        expect(results2).toHaveLength(3); // Only three set values
        expect(results2[0]).toBe(2);
        expect(results2[1]).toBe(1);
        expect(results2[2]).toBe(3);
    });

    it("can index multiple prefixing directory names", () => {
        const rdns: DistinguishedName = [
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ printableString: "v1" }, DER),
                ),
                new AttributeTypeAndValue(
                    surname["&id"],
                    surname.encoderFor["&Type"]!({ printableString: "v2" }, DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ printableString: "v3" }, DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    surname.encoderFor["&Type"]!({ printableString: "v4" }, DER),
                ),
                new AttributeTypeAndValue(
                    surname["&id"],
                    surname.encoderFor["&Type"]!({ printableString: "v5" }, DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({ printableString: "v6" }, DER),
                ),
            ],
        ];

        const gn: GeneralName = {
            directoryName: {
                rdnSequence: [ ...rdns ],
            },
        };
        const fullgn: GeneralName = {
            directoryName: {
                rdnSequence: [ ...rdns ],
            },
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true); // v6
        gn.directoryName.rdnSequence.pop();
        expect(trie.setValue(gn, 4)).toBe(true); // v4+v5
        gn.directoryName.rdnSequence.pop(); // v3
        gn.directoryName.rdnSequence.pop(); // v1+v2
        expect(trie.setValue(gn, 8)).toBe(true);
        gn.directoryName.rdnSequence.pop(); // empty rdn
        expect(trie.setValue(gn, 9)).toBe(true);
        const [ _, x500Root ]  = trie.z__testingInternals();
        expect(x500Root.size).toBe(4);
        expect(trie.getValue(gn)).toBe(9);

        gn.directoryName.rdnSequence = [ ...rdns ];
        expect(trie.getValue(gn)).toBe(5); // v6
        gn.directoryName.rdnSequence.pop();
        expect(trie.getValue(gn)).toBe(4); // v4+v5
        gn.directoryName.rdnSequence.pop(); // v3
        gn.directoryName.rdnSequence.pop(); // v1+v2
        expect(trie.getValue(gn)).toBe(8);
        gn.directoryName.rdnSequence.pop(); // empty rdn
        expect(trie.getValue(gn)).toBe(9);

        const results = Array.from(trie.descendOptionalValues(fullgn));
        expect(results).toHaveLength(5);
        expect(results[0]).toBe(9);
        expect(results[1]).toBe(8);
        expect(results[2]).toBeUndefined();
        expect(results[3]).toBe(4);
        expect(results[4]).toBe(5);

        const results2 = Array.from(trie.descendValues(fullgn));
        expect(results2).toHaveLength(4);
        expect(results2[0]).toBe(9);
        expect(results2[1]).toBe(8);
        expect(results2[2]).toBe(4);
        expect(results2[3]).toBe(5);
    });

    it("can index multiple prefixing object identifiers", () => {
        const gn: GeneralName = {
            registeredID: ObjectIdentifier.fromString("2.5.4.3.1")
        };
        const trie = new GeneralNameTrie();
        expect(trie.setValue(gn, 5)).toBe(true);
        gn.registeredID = ObjectIdentifier.fromString("2.5.4.3");
        expect(trie.setValue(gn, 6)).toBe(true);
        gn.registeredID = ObjectIdentifier.fromString("2.5");
        expect(trie.setValue(gn, 7)).toBe(true);
        const [ _1, _2, oidRoot ]  = trie.z__testingInternals();
        expect(oidRoot.size).toBe(3);
        expect(oidRoot.has("2\x1F5\x1F4\x1F3\x1F1"));
        expect(oidRoot.has("2\x1F5\x1F4\x1F3"));
        expect(oidRoot.has("2\x1F5"));

        gn.registeredID = ObjectIdentifier.fromString("2.5.4.3.1");
        expect(trie.getValue(gn)).toBe(5);
        gn.registeredID = ObjectIdentifier.fromString("2.5.4.3");
        expect(trie.getValue(gn)).toBe(6);
        gn.registeredID = ObjectIdentifier.fromString("2.5.4");
        expect(trie.getValue(gn)).toBeUndefined();
        gn.registeredID = ObjectIdentifier.fromString("2.5");
        expect(trie.getValue(gn)).toBe(7);

        gn.registeredID = ObjectIdentifier.fromString("2.5.4.3.1");
        const results = Array.from(trie.descendOptionalValues(gn));
        expect(results).toHaveLength(5);
        expect(results[0]).toBeUndefined();
        expect(results[1]).toBe(7);
        expect(results[2]).toBeUndefined();
        expect(results[3]).toBe(6);
        expect(results[4]).toBe(5);

        const results2 = Array.from(trie.descendValues(gn));
        expect(results2).toHaveLength(3);
        expect(results2[0]).toBe(7);
        expect(results2[1]).toBe(6);
        expect(results2[2]).toBe(5);
    });

});

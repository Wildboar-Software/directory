import { getNamesFromFamilyEntry, filterFamilyEntries } from "./hierarchySelection";
import { FamilyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntry.ta";
import { FamilyEntries } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntries.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { commonName } from "@wildboar/x500/src/lib/collections/attributes";
import { DER } from "asn1-ts/dist/node/functional";
import { organization } from "@wildboar/x500/src/lib/collections/objectClasses";
import { getMockCtx } from "../testing.spec";
import { IndexableDN } from "@wildboar/meerkat-types";
import { strict as assert } from "node:assert";

describe("getNamesFromFamilyEntry()", () => {
    it("works", () => {
        const base_dn: DistinguishedName = [
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({
                        uTF8String: "qwer",
                    }, DER),
                ),
            ],
        ];
        const fe = new FamilyEntry(
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({
                        uTF8String: "asdf",
                    }, DER),
                ),
            ],
            [],
            [
                new FamilyEntries(
                    organization["&id"],
                    [
                        new FamilyEntry(
                            [
                                new AttributeTypeAndValue(
                                    commonName["&id"],
                                    commonName.encoderFor["&Type"]!({
                                        uTF8String: "zxcv",
                                    }, DER),
                                ),
                                new AttributeTypeAndValue(
                                    commonName["&id"],
                                    commonName.encoderFor["&Type"]!({
                                        uTF8String: "yuiop",
                                    }, DER),
                                ),
                            ],
                            [],
                            undefined,
                        ),
                    ],
                ),
            ],
        );
        const names = getNamesFromFamilyEntry(fe, base_dn);
        expect(names).toHaveLength(2);
        const name0 = names[0];
        const name1 = names[1];
        expect(name0).toHaveLength(2);
        expect(name1).toHaveLength(3);
        expect(name0[0]).toHaveLength(1);
        expect(name0[1]).toHaveLength(1);
        expect(name1[0]).toHaveLength(1);
        expect(name1[1]).toHaveLength(1);
        expect(name1[2]).toHaveLength(2);
    });
});

describe("filterFamilyEntries()", () => {
    it("works", () => {
        const base_dn: DistinguishedName = [
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    commonName.encoderFor["&Type"]!({
                        uTF8String: "qwer",
                    }, DER),
                ),
            ],
        ];
        const ctx = getMockCtx();
        const fe = new FamilyEntries(
            organization["&id"],
            [
                new FamilyEntry(
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({
                                uTF8String: "asdf",
                            }, DER),
                        ),
                    ],
                    [],
                    [
                        new FamilyEntries(
                            organization["&id"],
                            [
                                new FamilyEntry(
                                    [
                                        new AttributeTypeAndValue(
                                            commonName["&id"],
                                            commonName.encoderFor["&Type"]!({
                                                uTF8String: "zxcv1",
                                            }, DER),
                                        ),
                                    ],
                                    [],
                                    undefined,
                                ),
                                new FamilyEntry(
                                    [
                                        new AttributeTypeAndValue(
                                            commonName["&id"],
                                            commonName.encoderFor["&Type"]!({
                                                uTF8String: "zxcv2",
                                            }, DER),
                                        ),
                                    ],
                                    [],
                                    undefined,
                                ),
                                new FamilyEntry(
                                    [
                                        new AttributeTypeAndValue(
                                            commonName["&id"],
                                            commonName.encoderFor["&Type"]!({
                                                uTF8String: "zxcv3",
                                            }, DER),
                                        ),
                                    ],
                                    [],
                                    undefined,
                                ),
                            ],
                        ),
                    ],
                ),
            ],
        );
        const permitted: Set<IndexableDN> = new Set([
            "2.5.4.3=QWER,2.5.4.3=ASDF",
            "2.5.4.3=QWER,2.5.4.3=ASDF,2.5.4.3=ZXCV1",
            "2.5.4.3=QWER,2.5.4.3=ASDF,2.5.4.3=ZXCV3",
        ]);
        const output = filterFamilyEntries(ctx, fe, base_dn, permitted);
        expect(output.familyEntries).toHaveLength(1);
        const fe1 = output.familyEntries[0];
        assert(fe1.family_info);
        expect(fe1.family_info).toHaveLength(1);
        expect(fe1.family_info[0].familyEntries).toHaveLength(2);
    });
});

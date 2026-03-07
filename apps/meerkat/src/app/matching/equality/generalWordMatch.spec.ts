import { Attribute } from "@wildboar/x500/InformationFramework";
import {
    _encode_SubstringAssertion,
    _encode_UnboundedDirectoryString,
    type SubstringAssertion,
    type UnboundedDirectoryString,
    SequenceMatchType_sequenceDeletion,
    SequenceMatchType_sequenceRestrictedDeletion,
    SequenceMatchType_sequencePermutation,
    SequenceMatchType_sequencePermutationAndDeletion,
    CharacterMatchTypes_characterExact,
    CharacterMatchTypes_characterMapped,
    WordMatchTypes_wordPhonetic,
    sequenceMatchType,
    wordMatchTypes,
    characterMatchTypes,
    SequenceMatchType_sequenceExact,
} from "@wildboar/x500/SelectedAttributeTypes";
import { matcher as generalWordMatch } from "./generalWordMatch.js";
import { DER } from "@wildboar/asn1/functional";
import { ObjectIdentifier } from "@wildboar/asn1";

describe("generalWordMatch", () => {
    it("should match the most basic matching case with no control attributes", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon pon pon, pon pon wei pon wei pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    // This one should not match because there are unmatched words in the value.
    it("should not match the most basic non-matching case with no control attributes", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    // In Meerkat DSA, caseIgnore is the default.
    it("should match case-sensitively with characterExact", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    characterMatchTypes["&id"],
                    [
                        characterMatchTypes.encoderFor["&Type"]!(CharacterMatchTypes_characterExact, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo" },
            },
            {
                any_: { printableString: "bar" },
            },
            {
                final: { printableString: "BUZZ" },
            },
        ];
        const matchingValue: UnboundedDirectoryString = {
            printableString: "Foo bar BUZZ",
        };
        const nonMatchingValue: UnboundedDirectoryString = {
            printableString: "FOO BAR BuZZ",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedMatchingValue = _encode_UnboundedDirectoryString(matchingValue, DER);
        const encodedNonMatchingValue = _encode_UnboundedDirectoryString(nonMatchingValue, DER);
        expect(generalWordMatch(encodedAssertion, encodedMatchingValue)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedNonMatchingValue)).toBe(false);
    });

    it("should match without regard for diacritics with characterMapped", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    characterMatchTypes["&id"],
                    [
                        characterMatchTypes.encoderFor["&Type"]!(CharacterMatchTypes_characterMapped, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo" },
            },
            {
                any_: { uTF8String: "bàr" },
            },
            {
                final: { printableString: "BUZZ" },
            },
        ];
        const matchingValue: UnboundedDirectoryString = {
            uTF8String: "Foo bar BUZZ",
        };
        const nonMatchingValue: UnboundedDirectoryString = {
            uTF8String: "FOO BBR BuZZ",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedMatchingValue = _encode_UnboundedDirectoryString(matchingValue, DER);
        const encodedNonMatchingValue = _encode_UnboundedDirectoryString(nonMatchingValue, DER);
        expect(generalWordMatch(encodedAssertion, encodedMatchingValue)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedNonMatchingValue)).toBe(false);
    });

    it("should match phonetically with wordPhonetic", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    wordMatchTypes["&id"],
                    [
                        wordMatchTypes.encoderFor["&Type"]!(WordMatchTypes_wordPhonetic, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "foo" },
            },
            {
                any_: { uTF8String: "bar" },
            },
            {
                final: { printableString: "buzz" },
            },
        ];
        const matchingValue: UnboundedDirectoryString = {
            uTF8String: "Fu Bar Buzz",
        };
        const nonMatchingValue: UnboundedDirectoryString = {
            uTF8String: "Fool Bar Buzz",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedMatchingValue = _encode_UnboundedDirectoryString(matchingValue, DER);
        const encodedNonMatchingValue = _encode_UnboundedDirectoryString(nonMatchingValue, DER);
        expect(generalWordMatch(encodedAssertion, encodedMatchingValue)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedNonMatchingValue)).toBe(false);
    });

    it("should match with sequenceDeletion", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value1: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const value2: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const value3: UnboundedDirectoryString = {
            printableString: "Wei BUZZ BUZZ wei pon",
        };
        const value4: UnboundedDirectoryString = {
            printableString: "Yeet Wei BUZZ BUZZ wei pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue1 = _encode_UnboundedDirectoryString(value1, DER);
        const encodedValue2 = _encode_UnboundedDirectoryString(value2, DER);
        const encodedValue3 = _encode_UnboundedDirectoryString(value3, DER);
        const encodedValue4 = _encode_UnboundedDirectoryString(value4, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue1)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedValue2)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedValue3)).toBe(true);
        // This should match because we are allowed to delete from the front.
        // (Which makes `initial` pointless.)
        expect(generalWordMatch(encodedAssertion, encodedValue4)).toBe(true);
    });

    it("should match with sequenceRestrictedDeletion", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceRestrictedDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value1: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const value2: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const value3: UnboundedDirectoryString = {
            printableString: "Wei BUZZ BUZZ wei pon",
        };
        const value4: UnboundedDirectoryString = {
            printableString: "Yeet Wei BUZZ BUZZ wei pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue1 = _encode_UnboundedDirectoryString(value1, DER);
        const encodedValue2 = _encode_UnboundedDirectoryString(value2, DER);
        const encodedValue3 = _encode_UnboundedDirectoryString(value3, DER);
        const encodedValue4 = _encode_UnboundedDirectoryString(value4, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue1)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedValue2)).toBe(true);
        expect(generalWordMatch(encodedAssertion, encodedValue3)).toBe(true);
        // This should NOT match because sequenceRestrictedDeletion forbids
        // deletion from the front.
        expect(generalWordMatch(encodedAssertion, encodedValue4)).toBe(false);
    });

    it("should match with sequencePermutation", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutation, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo" },
            },
            {
                any_: { printableString: "bar" },
            },
            {
                any_: { printableString: "quux" },
            },
            {
                final: { printableString: "BUZZ" },
            },
        ];
        const value1: UnboundedDirectoryString = {
            printableString: "Foo quux bar BUZZ",
        };
        const value2: UnboundedDirectoryString = {
            printableString: "FOO BAR BuZZ",
        };
        const value3: UnboundedDirectoryString = {
            printableString: "FOO quux zop BAR BuZZ",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue1 = _encode_UnboundedDirectoryString(value1, DER);
        const encodedValue2 = _encode_UnboundedDirectoryString(value2, DER);
        const encodedValue3 = _encode_UnboundedDirectoryString(value3, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue1)).toBe(true);
        // Should not match because it is missing the "quux" word.
        expect(generalWordMatch(encodedAssertion, encodedValue2)).toBe(false);
        // // Should not match because the word "zop" is extraneous.
        expect(generalWordMatch(encodedAssertion, encodedValue3)).toBe(false);
    });

    it("should match with sequencePermutationAndDeletion", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo" },
            },
            {
                any_: { printableString: "bar" },
            },
            {
                any_: { printableString: "quux" },
            },
            {
                final: { printableString: "BUZZ" },
            },
        ];
        const value1: UnboundedDirectoryString = {
            printableString: "Foo quux bar BUZZ",
        };
        const value2: UnboundedDirectoryString = {
            printableString: "FOO BAR BuZZ",
        };
        const value3: UnboundedDirectoryString = {
            printableString: "FOO quux zop BAR BuZZ",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue1 = _encode_UnboundedDirectoryString(value1, DER);
        const encodedValue2 = _encode_UnboundedDirectoryString(value2, DER);
        const encodedValue3 = _encode_UnboundedDirectoryString(value3, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue1)).toBe(true);
        // Should not match because it is missing the "quux" word.
        expect(generalWordMatch(encodedAssertion, encodedValue2)).toBe(false);
        // Should match even though the word "zop" is extraneous.
        expect(generalWordMatch(encodedAssertion, encodedValue3)).toBe(true);
    });

    it("should handle empty assertions responsibly", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "" },
            },
            {
                any_: { printableString: "" },
            },
            {
                final: { printableString: "" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should handle empty strings responsibly", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "asdf" },
            },
            {
                any_: { printableString: "zxcv" },
            },
            {
                final: { printableString: "qwer" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should handle a zero-length assertion responsibly", () => {
        const assertion: SubstringAssertion = [];
        const value: UnboundedDirectoryString = {
            printableString: "hi mom",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    // The specification says to ignore unrecognized control attributes.
    it("handles unrecognized control attributes responsibly", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    ObjectIdentifier.fromString("1.2.3.4"),
                    [
                        sequenceMatchType.encoderFor["&Type"]!(1, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "asdf" },
            },
            {
                any_: { printableString: "zxcv" },
            },
            {
                final: { printableString: "qwer" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "asdf zxcv qwer",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        // The specification says to ignore unrecognized control attributes.
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    // TODO: Document this behavior.
    /* Meerkat DSA's seeks to carry on the evaluation of the matching rule
    in the face of an unrecognized control attribute value. The handling of
    an unrecognized control value will be an eternally unstable implementation
    detail; there are no guarantees what it will do, except that the function
    will return in a reasonable amount of time without memory leaks or
    security vulnerabilities. */
    it("handles unrecognized control attribute values responsibly", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(123, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "asdf" },
            },
            {
                any_: { printableString: "zxcv" },
            },
            {
                final: { printableString: "qwer" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "asdf zxcv qwer",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBeDefined();
    });

    // TODO: Document this behavior. Basically, same policy as above.
    it("handles empty control attributes", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [],
                ),
            },
            {
                initial: { printableString: "asdf" },
            },
            {
                any_: { printableString: "zxcv" },
            },
            {
                final: { printableString: "qwer" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "asdf zxcv qwer",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        // True or false. It could go either way. We just want to make sure this doesn't throw.
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBeDefined();
    });

    it("should not match when the assertion, in total, is longer than the value (by word count)", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should not match when an assertion substring is longer than the value (by word count)", () => {
        const assertion: SubstringAssertion = [
            {
                any_: { printableString: "Wei wei, pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should not match when a permuted assertion, in total, is longer than the value (by word count)", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should not match when a permuted assertion substring is longer than the value (by word count)", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                any_: { printableString: "Wei wei, pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    // It is not entirely true that Meerkat DSA ignores control attributes that
    // appear at the end, but it is _close enough_.
    // In Meerkat DSA, caseIgnore is the default.
    it("ignores control attributes that appear at the end", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo bar" },
            },
            {
                control: new Attribute(
                    characterMatchTypes["&id"],
                    [
                        characterMatchTypes.encoderFor["&Type"]!(CharacterMatchTypes_characterExact, DER),
                    ],
                ),
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "FOO BaR asdf BUzz",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        // This should still match case-insensitively, because the control
        // attribute making it case-sensitive is at the end.
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    it("ignores use of permutation at the end of the assertion", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo bar" },
            },
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "FOO BaR asdf BUzz",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        // This should still match case-insensitively, because the control
        // attribute making it case-sensitive is at the end.
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    it("ignores use of sequenceExact at the end of the assertion", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Foo bar" },
            },
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "FOO BaR asdf BUzz",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        // This should still match case-insensitively, because the control
        // attribute making it case-sensitive is at the end.
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    it("does not tolerate an initial assertion appearing anywhere other than the beginning", () => {
        const assertion: SubstringAssertion = [
            {
                any_: { printableString: "wei" },
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                final: { printableString: "pon pon pon, pon pon wei pon wei pon pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("does not tolerate a final assertion appearing anywhere other than the end", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                final: { printableString: "pon pon pon, pon pon wei pon wei pon pon" },
            },
            {
                any_: { printableString: "wei" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("handles an assertion with only control attributes gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should handle huge assertions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            ...Array.from({ length: 1000000 }, () => ({
                any_: { printableString: "pon" },
            })),
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    }, 15_000); // 15 seconds only needed when running all tests at once.

    it("should handle huge strings gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "wei" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, " + "pon ".repeat(1000000),
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should handle huge assertions with deletions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            ...Array.from({ length: 1000000 }, () => ({
                any_: { printableString: "pon" },
            })),
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    }, 15_000); // 15 seconds only needed when running all tests at once.

    it("should handle huge strings with deletions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequenceDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, " + "pon ".repeat(1000000),
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    });

    it("should handle huge permuted assertions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutation, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            ...Array.from({ length: 1000000 }, () => ({
                any_: { printableString: "pon" },
            })),
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    }, 15_000); // 15 seconds only needed when running all tests at once.

    it("should handle huge permuted strings gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutation, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, " + "pon ".repeat(1000000),
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });

    it("should handle huge permuted assertions with deletions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            ...Array.from({ length: 1000000 }, () => ({
                any_: { printableString: "pon" },
            })),
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, pon pon pon, pon pon wei pon wei pon pon",
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(true);
    }, 15_000); // 15 seconds only needed when running all tests at once.

    it("should handle huge permuted strings with deletions gracefully", () => {
        const assertion: SubstringAssertion = [
            {
                control: new Attribute(
                    sequenceMatchType["&id"],
                    [
                        sequenceMatchType.encoderFor["&Type"]!(SequenceMatchType_sequencePermutationAndDeletion, DER),
                    ],
                ),
            },
            {
                initial: { printableString: "Wei" },
            },
            {
                any_: { printableString: "wei" },
            },
            {
                final: { printableString: "pon" },
            },
        ];
        const value: UnboundedDirectoryString = {
            printableString: "Wei wei, " + "pon ".repeat(1000000),
        };
        const encodedAssertion = _encode_SubstringAssertion(assertion, DER);
        const encodedValue = _encode_UnboundedDirectoryString(value, DER);
        expect(generalWordMatch(encodedAssertion, encodedValue)).toBe(false);
    });
});

import { directoryStringToString, prepString, type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_SubstringAssertion,
    _decode_UnboundedDirectoryString,
    type SubstringAssertion,
    type UnboundedDirectoryString,
    type SequenceMatchType,
    SequenceMatchType_sequenceExact,
    SequenceMatchType_sequenceDeletion,
    SequenceMatchType_sequenceRestrictedDeletion,
    SequenceMatchType_sequencePermutation,
    SequenceMatchType_sequencePermutationAndDeletion,
    type WordMatchTypes,
    WordMatchTypes_wordExact,
    WordMatchTypes_wordPhonetic,
    type CharacterMatchTypes,
    CharacterMatchTypes_characterExact,
    CharacterMatchTypes_characterCaseIgnore,
    CharacterMatchTypes_characterMapped,
    sequenceMatchType,
    wordMatchTypes,
    characterMatchTypes,
} from "@wildboar/x500/SelectedAttributeTypes";
import { type Attribute } from "@wildboar/x500/InformationFramework";
import { doubleMetaphone } from "double-metaphone";

// sequenceMatchType ATTRIBUTE ::= {
//     WITH SYNTAX   SequenceMatchType
//     SINGLE VALUE  TRUE
//     ID            id-cat-sequenceMatchType } -- defaulting to sequenceExact
  
// SequenceMatchType ::= ENUMERATED {
//     sequenceExact                  (0),
//     sequenceDeletion               (1),
//     sequenceRestrictedDeletion     (2),
//     sequencePermutation            (3),
//     sequencePermutationAndDeletion (4),
//     sequenceProviderDefined        (5),
//     ... }
  
// wordMatchTypes ATTRIBUTE ::= {
//     WITH SYNTAX   WordMatchTypes
//     SINGLE VALUE  TRUE
//     ID            id-cat-wordMatchType } -- defaulting to wordExact
  
// WordMatchTypes ::= ENUMERATED {
//     wordExact           (0),
//     wordTruncated       (1),
//     wordPhonetic        (2),
//     wordProviderDefined (3),
//     ... }
  
// characterMatchTypes ATTRIBUTE ::= {
//     WITH SYNTAX   CharacterMatchTypes
//     SINGLE VALUE  TRUE
//     ID            id-cat-characterMatchTypes }
  
// CharacterMatchTypes ::= ENUMERATED {
//     characterExact      (0),
//     characterCaseIgnore (1),
//     characterMapped     (2),
//     ... }
  
// selectedContexts ATTRIBUTE ::= {
//     WITH SYNTAX  ContextAssertion
//     ID           id-cat-selectedContexts }

// For later use in characterMatchTypes_characterMapped
export function stripDiacritics(input: string): string {
    return input
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function getWords(input: string): string[] {
    // Split on any sequence of whitespace or punctuation (Unicode aware)
    const regex = /[\p{P}\p{S}\s]+/gu;
    return input.split(regex);
}

/** Whether to use a set of words instead of an ordered list of words. */
function isPermutedSearch(seq_match: SequenceMatchType): boolean {
    return (
        seq_match === SequenceMatchType_sequencePermutation
        || seq_match === SequenceMatchType_sequencePermutationAndDeletion
    );
}

// wordExact results in no change.
// wordTruncated won't do anything in this implementation: unclear usage.
// wordProviderDefined won't do anything in this implementation: undecided.
function matchWord(
    stored: string,
    assertion: string,
    word_match: WordMatchTypes,
    char_match: CharacterMatchTypes,
): boolean {
    let a = (char_match === CharacterMatchTypes_characterMapped)
        ? stripDiacritics(assertion).toUpperCase()
        : assertion;
    a = (char_match === CharacterMatchTypes_characterCaseIgnore)
        ? a.toUpperCase().trim()
        : a.trim();
    let s = (char_match === CharacterMatchTypes_characterMapped)
        ? stripDiacritics(stored).toUpperCase()
        : stored;
    s = (char_match === CharacterMatchTypes_characterCaseIgnore)
        ? s.toUpperCase().trim()
        : s.trim();
    if (word_match === WordMatchTypes_wordPhonetic) {
        const [ ma1, ma2 ] = doubleMetaphone(a);
        const [ ms1, ms2 ] = doubleMetaphone(s);
        return (ma1 === ms1 || ma1 === ms2 || ma2 === ms1 || ma2 === ms2);
    }
    return prepString(s) === prepString(a);
}

// wordExact results in no change.
// wordTruncated won't do anything in this implementation: unclear usage.
// wordProviderDefined won't do anything in this implementation: undecided.
function matchWordPermutable(
    valueWords: Map<string, boolean>,
    valuePhoneticWords: Set<string>,
    assertion: string,
    word_match: WordMatchTypes,
    char_match: CharacterMatchTypes,
): boolean {
    let a = (char_match === CharacterMatchTypes_characterMapped)
        ? stripDiacritics(prepString(assertion) ?? assertion).toUpperCase()
        : (prepString(assertion) ?? assertion);
    a = (char_match === CharacterMatchTypes_characterCaseIgnore)
        ? a.toUpperCase().trim()
        : a.trim();
    if (word_match === WordMatchTypes_wordPhonetic) {
        const [a1, a2] = doubleMetaphone(a);
        return valuePhoneticWords.has(a1) || valuePhoneticWords.has(a2);
    }
    return (char_match === CharacterMatchTypes_characterExact)
        ? (valueWords.get(a) ?? false)
        : valueWords.has(a);
}

// Quote:
// > control is not used for the caseIgnoreSubstringsMatch , telephoneNumberSubstringsMatch ,
// > or any other form of substring match for which only initial, any, or final elements are used in the matching
// > algorithm; if a control element is encountered, it is ignored. The control element is only used for
// > matching rules that explicitly specify its use in the matching algorithm. Such a matching rule may also
// > redefine the semantics of the initial , any and final substrings.


/**
 * @summary Matching rule implementation for `generalWordMatch`
 * @description
 * 
 * [ITU-T Recommendation X.520 (2019)](https://www.itu.int/rec/T-REC-X.520-201910-I/en),
 * Section 8.5.3, describes the `generalWordMatch` as being exactly equal to
 * either `caseExactSubstringsMatch` or `caseIgnoreSubstringsMatch` when no
 * control attributes are present, but later text of this section seems to
 * contradict this. Note that the aforementioned substring matching rules do
 * not use control attributes: control attributes are explicitly ignored for
 * these matching rules. `generalWordMatch` takes the four named control
 * attributes named in the specification, which are:
 * 
 * - `sequenceMatchType`
 * - `wordMatchTypes`
 * - `characterMatchTypes`
 * - `selectedContexts`
 * 
 * Control attributes other than these are ignored.
 * 
 * This implementation was designed to avoid algorithms that use superlinear
 * time complexity. Miraculously, I think I managed to do it.
 * 
 * When matching without permutation, it is not clear from the specification
 * alone whether the words that match the "initial" assertion are consumed,
 * or if a subsequent "any" assertion can still match the "initial" words.
 * I refer to Quipu's implementation of substrings matching for this:
 * https://github.com/Wildboar-Software/isode/blob/7ff410cc923b5535389a8fee13232688495197f2/quipu/ds_search.c#L1582
 * 
 * This implementation does not skip "noise words." There are far too many in
 * just one language, I would never be able to index even a fraction of them
 * for all languages, and it this would be a subjective matter.
 * 
 * Side Note:
 * 
 * I believe that `sequenceRestrictedDeletion` was invented because, if
 * deletion is allowed, for every word in the stored value, words could be
 * deleted from the front until the `initial` assertion matches, which defeats
 * the point of the `initial` assertion.
 * 
 * @param assertion - The encoded assertion of the match.
 * @param value - The encoded value to match.
 * @returns {Boolean} Whether the value matches the assertion.
 * 
 * @function
 */
export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: SubstringAssertion = _decode_SubstringAssertion(assertion);
    const vuds: UnboundedDirectoryString = _decode_UnboundedDirectoryString(value);
    const v: string = directoryStringToString(vuds);
    
    // "Prior to the first sequenceMatchType attribute, if any, the value that
    // is to be taken as applicable for the sequenceMatchType attribute shall
    // be taken as sequenceExact."
    let seq_match: SequenceMatchType = SequenceMatchType_sequenceExact;

    // "Prior to the first wordMatchTypes attribute, if any, the value that is
    // to be taken as applicable for the wordMatchTypes attribute shall be taken
    // as wordExact."
    let word_match: WordMatchTypes = WordMatchTypes_wordExact;

    // "Prior to the first characterMatchType attribute, if any, the value that is to be
    // taken as applicable for the characterMatchType attribute shall be taken as characterExact . However, if the equality
    // matching rule (if any) for the attribute type subject to the matching is caseIgnoreMatch , then it shall instead be taken
    // as characterCaseIgnore."
    //
    // Unfortunately in Meerkat DSA, we don't pass in the attribute type or context, so
    // there's no way to know. We assume that the attribute type is caseIgnoreMatch.
    let char_match: CharacterMatchTypes = CharacterMatchTypes_characterCaseIgnore;

    /* First, figure out what we need to index from the stored string in advance. */
    let permuted_search: boolean = false;
    let word_phonetic_used: boolean = false;
    let first_non_control_index: number = -1;
    let last_non_control_index: number = a.length - 1;
    for (const [i, subassertion] of a.entries()) {
        if (!("control" in subassertion)) {
            if (first_non_control_index === -1) {
                first_non_control_index = i;
            }
            last_non_control_index = i;
            continue;
        }
        const control: Attribute = subassertion.control;
        const vwc = control.valuesWithContext ?? [];
        if (control.type_.isEqualTo(sequenceMatchType["&id"])) {
            if (control.values.length !== 1 || vwc.length) {
                return false;
            }
            const x = sequenceMatchType.decoderFor["&Type"]!(control.values[0]);
            permuted_search ||= isPermutedSearch(x);
        } else if (control.type_.isEqualTo(wordMatchTypes["&id"])) {
            if (control.values.length !== 1 || vwc.length) {
                return false;
            }
            const x = wordMatchTypes.decoderFor["&Type"]!(control.values[0]);
            if (x === WordMatchTypes_wordPhonetic) {
                word_phonetic_used = true;
            }
        }
    }
    if (first_non_control_index === -1) {
        return false; // There are no non-control attributes!
    }

    let permutedDeletionUsed: boolean = false;
    const vwords = getWords(v);
    // The word and whether it must match the key exactly.
    const matchedWords = new Map<string, boolean>();
    if (permuted_search) {
        // Index the words to be matched.
        const vmap = new Map<string, boolean>();
        const phoneticMap = new Set<string>();
        for (const word of vwords) {
            const upperWord = word.toUpperCase();
            const alreadyUppercased = word === upperWord;
            vmap.set(word, true);
            vmap.set(prepString(word) ?? word, true);
            // If not already uppercased, and an uppercased was not already encountered...
            if (!alreadyUppercased && !vmap.get(upperWord)) {
                vmap.set(upperWord, false);
            }
            const mappedWord = stripDiacritics(word).toUpperCase();
            if (!vmap.get(mappedWord)) {
                vmap.set(mappedWord, false);
            }
            if (word_phonetic_used) {
                const [word1, word2] = doubleMetaphone(word);
                phoneticMap.add(word1);
                phoneticMap.add(word2);
            }
        }

        // Evaluate only the permuted `any` assertions.
        for (const subassertion of a) {
            if ("any_" in subassertion) {
                if (!isPermutedSearch(seq_match)) {
                    continue;
                }
                const ass: string = directoryStringToString(subassertion.any_);
                const assWords = getWords(ass);
                if (assWords.length > vwords.length) {
                    return false;
                }
                for (const assWord of assWords) {
                    const matched = matchWordPermutable(
                        vmap,
                        phoneticMap,
                        assWord,
                        word_match,
                        char_match,
                    );
    
                    // If the word matched, add it to a list of matched words (used later)
                    if (matched) {
                        matchedWords.set(assWord, matchedWords.get(assWord) ?? true);
                        if (char_match === CharacterMatchTypes_characterCaseIgnore) {
                            matchedWords.set(assWord.toUpperCase(), false);
                        } else if (char_match === CharacterMatchTypes_characterMapped) {
                            matchedWords.set(assWord.toUpperCase(), false);
                            matchedWords.set(stripDiacritics(assWord).toUpperCase(), false);
                        }
                    } else {
                        return false; // ...otherwise, we already know its not a match.
                    }
                }
            } else if ("control" in subassertion) {
                const control: Attribute = subassertion.control;
                if (control.type_.isEqualTo(sequenceMatchType["&id"])) {
                    if (control.values.length !== 1 || !!control.valuesWithContext?.length) {
                        return false;
                    }
                    seq_match = sequenceMatchType.decoderFor["&Type"]!(control.values[0]);
                    if (seq_match === SequenceMatchType_sequencePermutationAndDeletion) {
                        permutedDeletionUsed = true;
                    }
                } else if (control.type_.isEqualTo(wordMatchTypes["&id"])) {
                    word_match = wordMatchTypes.decoderFor["&Type"]!(control.values[0]);
                } else if (control.type_.isEqualTo(characterMatchTypes["&id"])) {
                    char_match = characterMatchTypes.decoderFor["&Type"]!(control.values[0]);
                // } else if (control.type_.isEqualTo(selectedContexts["&id"])) {
                //     return false;
                } else {
                    // ITU-T Rec. X.520 (2019), Section 8.5.3, specifically
                    // says to ignore unrecognized control attributes.
                    continue;
                }
            }
        }

        // We reset the values now.
        seq_match = SequenceMatchType_sequenceExact;
        word_match = WordMatchTypes_wordExact;
        char_match = CharacterMatchTypes_characterCaseIgnore;
    }

    let valueRemaining: string[] = vwords;

    for (const [i_str, str] of a.entries()) {
        const restricted: boolean = seq_match === SequenceMatchType_sequenceRestrictedDeletion;
        const deletion: boolean = (seq_match === SequenceMatchType_sequenceDeletion) || restricted;
        if ("initial" in str) {
            if (i_str !== first_non_control_index) {
                // Initial must appear first.
                return false;
            }
            const ass: string = directoryStringToString(str.initial);
            const assWords = getWords(ass);
            if (vwords.length < assWords.length) {
                return false;
            }
            let w = vwords.slice();
            let i = 0;
            while (assWords[i] && w[0]) {
                const assertedWord = assWords[i];
                const valueWord = w[0];
                const matched = matchWord(valueWord, assertedWord, word_match, char_match);
                if (!matched) {
                    if (deletion && ((w.length < vwords.length) || !restricted)) {
                        w = w.slice(1); // Effectively popping the first word.
                        continue;
                    }
                    return false;
                }
                // We didn't do this when evaluating permutations, so it must be done here.
                matchedWords.set(assertedWord, matchedWords.get(assertedWord) ?? true);
                if (char_match === CharacterMatchTypes_characterCaseIgnore) {
                    matchedWords.set(assertedWord.toUpperCase(), false);
                } else if (char_match === CharacterMatchTypes_characterMapped) {
                    matchedWords.set(assertedWord.toUpperCase(), false);
                    matchedWords.set(stripDiacritics(assertedWord).toUpperCase(), false);
                }
                w = w.slice(1);
                i++;
            }
            if (assWords[i]) {
                return false; // There was an unmatched assertion.
            }
            // Looking at Quipu's implementation of substrings matching, it appears that the
            // `initial` assertion does consume the matching prefix.
            // See: https://github.com/Wildboar-Software/isode/blob/7ff410cc923b5535389a8fee13232688495197f2/quipu/ds_search.c#L1582
            valueRemaining = w;
            // TODO: Fix this logic in all other substring matching rules.
        } else if ("any_" in str) {
            if (isPermutedSearch(seq_match)) {
                continue;
            }
            const ass: string = directoryStringToString(str.any_);
            const assWords = getWords(ass);
            if (valueRemaining.length < assWords.length) {
                return false;
            }
            let w = valueRemaining;
            let i = 0;
            while (assWords[i] && w[0]) {
                const assertedWord = assWords[i];
                const valueWord = w[0];
                const matched = matchWord(valueWord, assertedWord, word_match, char_match);
                if (!matched) {
                    if (deletion) {
                        w = w.slice(1); // Effectively popping the first word.
                        continue;
                    }
                    return false;
                }
                w = w.slice(1);
                i++;
            }
            if (assWords[i]) {
                return false; // There was an unmatched assertion.
            }
            valueRemaining = w;
        } else if ("final" in str) {
            if (i_str !== last_non_control_index) {
                // Final must appear last.
                return false;
            }
            const ass: string = directoryStringToString(str.final);
            const assWords = getWords(ass);
            if (valueRemaining.length < assWords.length) {
                return false;
            }
            let w = valueRemaining;
            let i = assWords.length - 1;
            while (assWords[i] && w[0]) {
                const assertedWord = assWords[i];
                const valueWord = w[w.length - 1];
                const matched = matchWord(valueWord, assertedWord, word_match, char_match);
                if (!matched) {
                    if (deletion) {
                        w.pop();
                        continue;
                    }
                    return false;
                }
                // We didn't do this when evaluating permutations, so it must be done here.
                matchedWords.set(assertedWord, matchedWords.get(assertedWord) ?? true);
                if (char_match === CharacterMatchTypes_characterCaseIgnore) {
                    matchedWords.set(assertedWord.toUpperCase(), false);
                } else if (char_match === CharacterMatchTypes_characterMapped) {
                    matchedWords.set(assertedWord.toUpperCase(), false);
                    matchedWords.set(stripDiacritics(assertedWord).toUpperCase(), false);
                }
                w.pop();
                i--;
            }
            if (assWords[i]) {
                return false; // There was an unmatched assertion.
            }
            valueRemaining = w;
        } else if ("control" in str) {
            const control: Attribute = str.control;
            const vwc = control.valuesWithContext ?? [];
            if (control.type_.isEqualTo(sequenceMatchType["&id"])) {
                if (control.values.length !== 1 || vwc.length) {
                    return false;
                }
                seq_match = sequenceMatchType.decoderFor["&Type"]!(control.values[0]);
            } else if (control.type_.isEqualTo(wordMatchTypes["&id"])) {
                if (control.values.length !== 1 || vwc.length) {
                    return false;
                }
                word_match = wordMatchTypes.decoderFor["&Type"]!(control.values[0]);
            } else if (control.type_.isEqualTo(characterMatchTypes["&id"])) {
                if (control.values.length !== 1 || vwc.length) {
                    return false;
                }
                char_match = characterMatchTypes.decoderFor["&Type"]!(control.values[0]);
            // } else if (control.type_.isEqualTo(selectedContexts["&id"])) {
            //     return false;
            } else {
                // ITU-T Rec. X.520 (2019), Section 8.5.3, specifically says to
                // ignore unrecognized control attributes.
                continue;
            }
        } else {
            return false;
        }
    };

    if (permuted_search && !permutedDeletionUsed) {
        for (const word of vwords) {
            if (matchedWords.has(word)) {
                continue; // The word matched case-exact
            }
            const upper = word.toUpperCase();
            if (matchedWords.get(upper) === false) {
                continue; // The word matched case-insensitively
            }
            if (matchedWords.get(stripDiacritics(upper)) === false) {
                continue; // The word matched when uppercased and diacritics-stripped
            }
            /* The match failed because there was a word in the stored value that
            did not match up to any assertion, and we don't tolerate deletions. */
            return false;
        }
        // All words matched.
        return true;
    }

    const usedDeletion: boolean = (
        (seq_match === SequenceMatchType_sequenceDeletion)
        || (seq_match === SequenceMatchType_sequenceRestrictedDeletion)
        || (seq_match === SequenceMatchType_sequencePermutationAndDeletion)
    );

    /* If we do not tolerate deletions, every word in the string must have
    been matched up to an asserted word. */
    return (usedDeletion || (valueRemaining.length === 0));
};

export default matcher;


/*
Scratch pad for my ideas for implementing this:

- Anything that appears inside a sequencePermutation or sequencePermutationAndDeletion
  section can appear anywhere in the string. I think you could index these assertions
  and iterate over the words one time to check if all are present. The words that are
  present can be removed from the array of words altogether. This means that it might
  be desirable to use a linked list. Better yet, you could just push the indexes to
  remove from the array of words. Then the array of words can be used subsequently
  for other matching.
- Then, you iterate again over the array of stored words in order:
  - If SequenceMatchType_sequenceExact, the assertion must match each word in order.
  - If SequenceMatchType_sequenceDeletion, you can skip over words until you find
    the next assertion word, but if you don't find it, return FALSE.
  - Same for SequenceMatchType_sequenceRestrictedDeletion, except the first word
    cannot be deleted.
  - If sequenceProviderDefined is encountered, return UNDEFINED?
- If you get to the end of this iteration and there are assertions left unmatched,
  return FALSE.
- If you get to the end of this iteration and there are still words remaining,
  return TRUE if SequenceMatchType_sequenceDeletion or SequenceMatchType_sequenceRestrictedDeletion,
  and FALSE otherwise.
  
*/

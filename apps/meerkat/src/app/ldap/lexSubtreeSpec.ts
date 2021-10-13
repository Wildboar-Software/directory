import type { Context } from "../types";
import {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import type {
    ChopSpecification_specificExclusions_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ChopSpecification-specificExclusions-Item.ta";
import decodeLDAPDN from "./decodeLDAPDN";
import type {
    Refinement,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";
import isDigit from "../utils/isDigit";
import { ObjectIdentifier } from "asn1-ts";

const BASE_STRING: string = "base";
const SPEX_STRING: string = "specificExclusions";
const MIN_STRING: string = "minimum";
const MAX_STRING: string = "maximum";
const FILTER_STRING: string = "specificationFilter";
const CHOP_BEFORE: string = "chopBefore";
const CHOP_AFTER: string = "chopAfter";

interface RefinementLexingReturn {
    readonly refinement: Refinement;
    readonly charsRead: number;
}

function lexRefinement (ctx: Context, input: string): RefinementLexingReturn {
    let index: number = 0;

    const skipOverWhitespace = () => {
        while (/\s/.test(input.charAt(index))) {
            index++;
        }
    };

    if (input.startsWith("{")) {
        index++;
        skipOverWhitespace();
    }
    if (input.startsWith("and", index)) {
        index += 3;
        skipOverWhitespace();
        if (input.charAt(index) !== ":") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        const subrefinements: Refinement[] = [];
        while ((input.charAt(index) !== "}") && (index < input.length)) {
            const sub = lexRefinement(ctx, input.slice(index));
            subrefinements.push(sub.refinement);
            index += sub.charsRead;
            skipOverWhitespace();
            if (input.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }
        index++;
        return {
            refinement: {
                and: subrefinements,
            },
            charsRead: index,
        };
    } else if (input.startsWith("or", index)) {
        index += 2;
        skipOverWhitespace();
        if (input.charAt(index) !== ":") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        const subrefinements: Refinement[] = [];
        while ((input.charAt(index) !== "}") && (index < input.length)) {
            const sub = lexRefinement(ctx, input.slice(index));
            subrefinements.push(sub.refinement);
            index += sub.charsRead;
            skipOverWhitespace();
            if (input.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }
        index++;
        return {
            refinement: {
                or: subrefinements,
            },
            charsRead: index,
        };
    } else if (input.startsWith("not", index)) {
        index += 3;
        skipOverWhitespace();
        if (input.charAt(index) !== ":") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        const sub = lexRefinement(ctx, input.slice(index));
        return {
            refinement: {
                not: sub.refinement,
            },
            charsRead: (index + sub.charsRead),
        };
    } else if (input.startsWith("item", index)) {
        index += 4;
        skipOverWhitespace();
        if (input.charAt(index) !== ":") {
            throw new Error();
        }
        index++;
        skipOverWhitespace();
        const oidStart: number = index;
        while (/[A-Za-z0-9.-]/.test(input.charAt(index))) {
            index++;
        }
        const oidEnd: number = index;
        const descriptor: string = input.slice(oidStart, oidEnd);
        if (isDigit(descriptor.charCodeAt(0))) {
            return {
                refinement: {
                    item: ObjectIdentifier.fromString(descriptor),
                },
                charsRead: index,
            };
        } else {
            const oid = ctx.nameToObjectIdentifier.get(descriptor);
            if (!oid) {
                throw new Error();
            }
            return {
                refinement: {
                    item: oid,
                },
                charsRead: index,
            };
        }
    } else {
        throw new Error(); // Not understood alternative.
    }
}

/**
 * See: https://datatracker.ietf.org/doc/html/rfc3672#appendix-A
 *
 * @param text
 * @returns
 */
export
function getSubtreeSpecLexer (ctx: Context): (text: string) => SubtreeSpecification {
    return (text: string): SubtreeSpecification => {
        if (!text || text.length === 0) {
            throw new Error();
        }
        const toParse = text.slice(1, -1).trim();
        let index: number = 0;
        let base: string = "";
        const spex: string[] = [];
        let min: number = 0;
        let max: number = Infinity;
        let filter: string = "";

        const skipOverWhitespace = () => {
            while (/\s/.test(toParse.charAt(index))) {
                index++;
            }
        };

        const readName = (): string => { // FIXME: Escaping double quotes is not working.
            let ret: string = "";
            while (index < toParse.length) {
                const char = toParse.charAt(index);
                if (char === "\"") {
                    if (toParse.charAt(index + 1) === "\"") {
                        index++;
                        ret += '"';
                    } else {
                        break;
                    }
                } else {
                    ret += char;
                }
                index++;
            }
            return ret;
        };

        const skipOverInteger = () => {
            while (/\d/.test(toParse.charAt(index))) {
                index++;
            }
        };

        skipOverWhitespace();

        // base
        if (toParse.slice(index, BASE_STRING.length) === BASE_STRING) {
            index += BASE_STRING.length;
            skipOverWhitespace();
            if (toParse.charAt(index) !== "\"") {
                throw new Error(index.toString());
            }
            index++;
            base = readName();
            index++; // To skip past the closing quotation mark.
            skipOverWhitespace();
            if (toParse.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }

        // specificExclusions
        // TODO: Should you use startsWith() instead?
        if (toParse.slice(index, index + SPEX_STRING.length) === SPEX_STRING) {
            index += SPEX_STRING.length;
            skipOverWhitespace();
            if (toParse.charAt(index) !== "{") {
                throw new Error(index.toString());
            }
            index++; // Skip over the bracket.
            while (index < toParse.length) {
                skipOverWhitespace();
                const startOfSpex: number = index;
                let exclusion: string = "";
                if (toParse.slice(index, index + CHOP_BEFORE.length) === CHOP_BEFORE) {
                    index += CHOP_BEFORE.length;
                    exclusion += CHOP_BEFORE + ":";
                } else if (toParse.slice(index, index + CHOP_AFTER.length) === CHOP_AFTER) {
                    index += CHOP_AFTER.length;
                    exclusion += CHOP_AFTER + ":";
                } else if (toParse.charAt(index) === "}") {
                    index++;
                    break;
                } else {
                    throw new Error(toParse.charAt(index));
                }
                skipOverWhitespace();
                if (toParse.charAt(index) !== ":") {
                    throw new Error(index.toString());
                }
                index++;
                skipOverWhitespace();
                if (toParse.charAt(index) !== "\"") {
                    throw new Error(index.toString());
                }
                index++;
                exclusion += readName();
                index++;
                spex.push(exclusion);
                if (toParse.charAt(index) === ",") {
                    index++;
                }
            }
            skipOverWhitespace();
            if (toParse.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }

        // minimum
        if (toParse.slice(index, index + MIN_STRING.length) === MIN_STRING) {
            index += MIN_STRING.length;
            skipOverWhitespace();
            const intStart: number = index;
            skipOverInteger();
            const intEnd: number = index;
            min = Number.parseInt(toParse.slice(intStart, intEnd), 10);
            skipOverWhitespace();
            if (toParse.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }

        // maximum
        if (toParse.slice(index, index + MAX_STRING.length) === MAX_STRING) {
            index += MAX_STRING.length;
            skipOverWhitespace();
            const intStart: number = index;
            skipOverInteger();
            const intEnd: number = index;
            max = Number.parseInt(toParse.slice(intStart, intEnd), 10);
            skipOverWhitespace();
            if (toParse.charAt(index) === ",") {
                index++;
            }
            skipOverWhitespace();
        }

        // specificationFilter
        if (toParse.slice(index, index + FILTER_STRING.length) === FILTER_STRING) {
            index += FILTER_STRING.length;
            skipOverWhitespace();
            filter = toParse.slice(index);
        }

        return new SubtreeSpecification(
            decodeLDAPDN(ctx, base),
            spex.length
                ? spex.map((s): ChopSpecification_specificExclusions_Item => {
                    const indexOfColon: number = s.indexOf(":");
                    if (indexOfColon < 0) {
                        throw new Error();
                    }
                    const name: string = s.slice(indexOfColon + 1).trim();
                    if (s.startsWith(CHOP_BEFORE)) {
                        return {
                            chopBefore: decodeLDAPDN(ctx, name),
                        };
                    } else if (s.startsWith(CHOP_AFTER)) {
                        return {
                            chopAfter: decodeLDAPDN(ctx, name),
                        };
                    } else {
                        throw new Error();
                    }
                })
                : undefined,
            min,
            max,
            (filter.length > 10)
                ? lexRefinement(ctx, filter).refinement
                : undefined,
        );
    }
}

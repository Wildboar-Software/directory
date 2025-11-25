import type { Context } from "../types.js";
import {
    SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import type {
    ChopSpecification_specificExclusions_Item,
} from "@wildboar/x500/InformationFramework";
import decodeLDAPDN from "../utils/destringifyDN.js";
import type {
    Refinement,
} from "@wildboar/x500/InformationFramework";
import isDigit from "../utils/isDigit.js";
import { ObjectIdentifier } from "@wildboar/asn1";
import { ctx } from "../ctx.js";

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
            throw new Error("d1daaa2c-ffea-40cb-913d-ea9f2e7e6482");
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error("25b66ea8-e65b-4b32-bb09-a16a3c0649b0");
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
            throw new Error("841ea31d-26ed-49b8-8a1f-f676b7adff68");
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error("05d5058f-f78c-4062-bc80-91665f376721");
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
            throw new Error("3caa9105-de88-4159-982b-b5077d42464a");
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
            throw new Error("4aa85dd0-b36d-48f2-bcbe-ba9518ce07a2");
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
            const oid = ctx.objectClasses.get(descriptor);
            if (!oid) {
                throw new Error("4b40a119-aa1d-4832-a240-6c2b57e025c8");
            }
            return {
                refinement: {
                    item: oid.id,
                },
                charsRead: index,
            };
        }
    } else {
        throw new Error("a8fd495f-ac10-4193-b3c7-f9b4aca9cb52"); // Not understood alternative.
    }
}

/**
 * @summary A higher-order function that returns a function that can parse LDAP subtree specifications
 * @description
 *
 * This is a higher order function that takes a context object and returns a
 * function that can be used to parse an LDAP subtree specification. The
 * returned function takes the string form of the LDAP value as an input and
 * produces an X.500 `SubtreeSpecification`.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3672#appendix-A
 *
 * @param ctx The context object
 * @returns A function that can parse an LDAP subtree specification
 *
 * @function
 */
export
function getSubtreeSpecLexer (ctx: Context): (text: string) => SubtreeSpecification {
    return (text: string): SubtreeSpecification => {
        if (!text || text.length === 0) {
            throw new Error("d5649477-ac9d-465e-8507-b9fb243efccc");
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

        const readName = (): string => {
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
        if (toParse.slice(index, index + SPEX_STRING.length) === SPEX_STRING) {
            index += SPEX_STRING.length;
            skipOverWhitespace();
            if (toParse.charAt(index) !== "{") {
                throw new Error(index.toString());
            }
            index++; // Skip over the bracket.
            while (index < toParse.length) {
                skipOverWhitespace();
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
                        throw new Error("35483894-7f3a-41c0-b7ca-784b5f1da870");
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
                        throw new Error("a427ec8a-ef4a-4257-97ea-58a7b04ff538");
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

export
const lexSubtreeSpec = getSubtreeSpecLexer(ctx);

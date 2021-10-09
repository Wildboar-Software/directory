import type { Context } from "../types";
import {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import type {
    ChopSpecification_specificExclusions_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ChopSpecification-specificExclusions-Item.ta";
import decodeLDAPDN from "./decodeLDAPDN";

const BASE_STRING: string = "base";
const SPEX_STRING: string = "specificExclusions";
const MIN_STRING: string = "minimum";
const MAX_STRING: string = "maximum";
const FILTER_STRING: string = "specificationFilter";
const CHOP_BEFORE: string = "chopBefore";
const CHOP_AFTER: string = "chopAfter";

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

        const skipOverName = () => {
            while (index < toParse.length) {
                if (toParse.charAt(index) === "\"") {
                    if (toParse.charAt(index + 1) === "\"") {
                        index++;
                    } else {
                        break;
                    }
                }
                index++;
            }
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
            const startOfBase: number = index;
            skipOverName();
            const endOfBase = index;
            if (endOfBase >= toParse.length) {
                throw new Error(index.toString());
            }
            base = toParse.slice(startOfBase, endOfBase);
            index++; // To skip past the closing quotation mark.
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
                if (toParse.slice(index, index + CHOP_BEFORE.length) === CHOP_BEFORE) {
                    index += CHOP_BEFORE.length;
                } else if (toParse.slice(index, index + CHOP_AFTER.length) === CHOP_AFTER) {
                    index += CHOP_AFTER.length;
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
                skipOverName();
                index++;
                spex.push(toParse.slice(startOfSpex, index));
                if (toParse.charAt(index) === ",") {
                    index++;
                }
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
        }

        // maximum
        if (toParse.slice(index, index + MAX_STRING.length) === MAX_STRING) {
            index += MAX_STRING.length;
            skipOverWhitespace();
            const intStart: number = index;
            skipOverInteger();
            const intEnd: number = index;
            max = Number.parseInt(toParse.slice(intStart, intEnd), 10);
        }

        // specificationFilter
        if (toParse.slice(index, index + FILTER_STRING.length) === FILTER_STRING) {
            index += FILTER_STRING.length;
            skipOverWhitespace();
            filter = toParse.slice(index);
        }

        // return {
        //     base,
        //     spex,
        //     min,
        //     max,
        //     filter,
        // };
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
            undefined,
        );
    }
}

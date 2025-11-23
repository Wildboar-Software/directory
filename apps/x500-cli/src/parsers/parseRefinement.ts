import type {
    Refinement,
} from "@wildboar/x500/InformationFramework";
import { ObjectIdentifier } from "@wildboar/asn1";

interface RefinementLexingReturn {
    readonly refinement: Refinement;
    readonly charsRead: number;
}

// NOTE: This was copied from Meerkat DSA.
export
function lexRefinement (input: string): RefinementLexingReturn {
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
            throw new Error("a270ce6f-fe75-48ac-b823-1768d2f9115e");
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error("518d7036-9c00-4f91-98f1-6f1de582298a");
        }
        index++;
        skipOverWhitespace();
        const subrefinements: Refinement[] = [];
        while ((input.charAt(index) !== "}") && (index < input.length)) {
            const sub = lexRefinement(input.slice(index));
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
            throw new Error("a4f81723-ed89-408a-979e-a99a714caa1f");
        }
        index++;
        skipOverWhitespace();
        if (input.charAt(index) !== "{") {
            throw new Error("14e9f763-b587-4d1a-9bb5-56dd750737b6");
        }
        index++;
        skipOverWhitespace();
        const subrefinements: Refinement[] = [];
        while ((input.charAt(index) !== "}") && (index < input.length)) {
            const sub = lexRefinement(input.slice(index));
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
            throw new Error("42341041-eed1-45de-9ff1-caa565abdc85");
        }
        index++;
        skipOverWhitespace();
        const sub = lexRefinement(input.slice(index));
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
            throw new Error("2b42f304-89e3-4b00-b046-76681033f333");
        }
        index++;
        skipOverWhitespace();
        const oidStart: number = index;
        while (/[A-Za-z0-9.-]/.test(input.charAt(index))) {
            index++;
        }
        const oidEnd: number = index;
        const descriptor: string = input.slice(oidStart, oidEnd);
        return {
            refinement: {
                item: ObjectIdentifier.fromString(descriptor),
            },
            charsRead: index,
        };
    } else {
        throw new Error("0ec96dea-ba80-4215-a31d-46b7f9d17e16");
    }
}

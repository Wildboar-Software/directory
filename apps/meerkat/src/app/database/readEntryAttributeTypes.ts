import type { Context, Entry } from "../types";
import { ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    createTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import {
    modifyTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";

// Should this just be an EntryInformationSelection?
export
interface ReadEntryAttributesTypesOptions {
    includeOperationalAttributes?: boolean;
    // attributeSizeLimit?: number; // FIXME: Blocked on https://github.com/prisma/prisma/issues/7872
    // See: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#equals-1
    attributesSelect?: OBJECT_IDENTIFIER[]; // EntryInformationSelection.attributes.select
    contextSelection?: OBJECT_IDENTIFIER[]; // EntryInformationSelection.contextSelection.selectedContexts

    /**
     * Excluded because time limits should be checked between completely reading
     * entries--not in the middle of reading an entry's attributes.
     */
    // timeLimit (See: https://github.com/prisma/prisma/issues/7886)
    // sizeLimit (applies the number of entries, not their attributes.)
    // attributeCountLimit? (No such thing specified.)
};

export
interface ReadEntryAttributesTypesReturn {
    userAttributes: OBJECT_IDENTIFIER[];
    operationalAttributes: OBJECT_IDENTIFIER[];
    incompleteEntry: boolean;
    derivedEntry: boolean; // If joins or families are used.
};

// TODO: Document why I separate userAttributes and operationalAttributes.
export
async function readEntryAttributes (
    ctx: Context,
    entry: Entry,
    options?: ReadEntryAttributesTypesOptions,
): Promise<ReadEntryAttributesTypesReturn> {
    const userAttributes: OBJECT_IDENTIFIER[] = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.id,
                type: (options?.attributesSelect && options.attributesSelect.length > 0)
                    ? {
                        in: options.attributesSelect.map((as) => as.toString())
                    }
                    : undefined,
                ContextValue: (options?.contextSelection && (options?.contextSelection.length > 0))
                    ? {
                        some: {
                            OR: options.contextSelection.map((cs) => ({
                                type: {
                                    equals: cs.nodes,
                                },
                            })),
                        },
                    }
                    : undefined,
            },
            select: {
                type: true,
            },
        }))
            .map((a) => new ObjectIdentifier(a.type.split(".").map((node) => Number.parseInt(node)))),
    );
    const operationalAttributes: OBJECT_IDENTIFIER[] = [];
    if (options?.includeOperationalAttributes) {
        operationalAttributes.push(createTimestamp["&id"]);
        operationalAttributes.push(modifyTimestamp["&id"]);
        // TODO: Process more operational attributes.
    }
    // const incompleteEntry: boolean = (
    //     (options?.attributeSizeLimit !== undefined)
    //     && (
    //         (userAttributes.length)
    //         - (await ctx.db.attributeValue.count())
    //     )
    // )
    // TODO: When you can filter by attribute size, incompleteEntry should be
    // true if .count() returns attributes above that size.
    // TODO: if family is selected, recurse into the
    return {
        userAttributes,
        operationalAttributes,
        incompleteEntry: false,
        derivedEntry: false,
    };
}

export default readEntryAttributes;

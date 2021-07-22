import type { Context, Vertex, StoredAttributeValueWithContexts } from "../types";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute";
import { DERElement, OBJECT_IDENTIFIER } from "asn1-ts";
import { _encodeGeneralizedTime, DER } from "asn1-ts/dist/node/functional";
import {
    createTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import {
    modifyTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import { ACIScope } from "@prisma/client";

// Should this just be an EntryInformationSelection?
export
interface ReadEntryAttributesOptions {
    includeOperationalAttributes?: boolean;
    // attributeSizeLimit?: number; // FIXME: Blocked on https://github.com/prisma/prisma/issues/7872
    // See: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#equals-1
    attributesSelect?: OBJECT_IDENTIFIER[]; // EntryInformationSelection.attributes.select
    contextSelection?: OBJECT_IDENTIFIER[]; // EntryInformationSelection.contextSelection.selectedContexts
    returnContexts?: boolean; // EntryInformationSelection.returnContexts
    // TODO: Family selection

    /**
     * Excluded because time limits should be checked between completely reading
     * entries--not in the middle of reading an entry's attributes.
     */
    // timeLimit (See: https://github.com/prisma/prisma/issues/7886)
    // sizeLimit (applies the number of entries, not their attributes.)
    // attributeCountLimit? (No such thing specified.)
};

export
interface ReadEntryAttributesReturn {
    userAttributes: StoredAttributeValueWithContexts[];
    operationalAttributes: StoredAttributeValueWithContexts[];
    incompleteEntry: boolean;
    derivedEntry: boolean; // If joins or families are used.
    applicableACIItems: ACIItem[];
};

// TODO: Document why I separate userAttributes and operationalAttributes.
export
async function readEntryAttributes (
    ctx: Context,
    entry: Vertex,
    options?: ReadEntryAttributesOptions,
): Promise<ReadEntryAttributesReturn> {
    const userAttributes: StoredAttributeValueWithContexts[] = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
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
            include: {
                ContextValue: options?.returnContexts ?? false,
            },
        }))
            .map((a) => attributeFromDatabaseAttribute(ctx, a)),
    );
    const aciItems = await ctx.db.aCIItem.findMany({
        where: {
            entry_id: entry.dse.id,
        },
    });
    const entryACIItems = aciItems.filter((aci) => aci.scope === ACIScope.ENTRY);
    const prescriptiveACIItems = aciItems.filter((aci) => aci.scope === ACIScope.PRESCRIPTIVE);
    const subentryACIItems = aciItems.filter((aci) => aci.scope === ACIScope.SUBENTRY);
    const operationalAttributes: StoredAttributeValueWithContexts[] = [];
    if (options?.includeOperationalAttributes) {
        operationalAttributes.push({
            id: createTimestamp["&id"]!,
            value: _encodeGeneralizedTime(entry.dse.createdTimestamp, DER),
            contexts: new Map(),
        });
        operationalAttributes.push({
            id: modifyTimestamp["&id"]!,
            value: _encodeGeneralizedTime(entry.dse.modifyTimestamp, DER),
            contexts: new Map(),
        });
        operationalAttributes.push(
            ...entryACIItems.map((aci): StoredAttributeValueWithContexts => ({
                id: entryACI["&id"],
                value: (() => {
                    const el = new DERElement();
                    el.fromBytes(aci.ber);
                    return el;
                })(),
                contexts: new Map(),
            })),
            ...prescriptiveACIItems.map((aci): StoredAttributeValueWithContexts => ({
                id: prescriptiveACI["&id"],
                value: (() => {
                    const el = new DERElement();
                    el.fromBytes(aci.ber);
                    return el;
                })(),
                contexts: new Map(),
            })),
            ...subentryACIItems.map((aci): StoredAttributeValueWithContexts => ({
                id: subentryACI["&id"],
                value: (() => {
                    const el = new DERElement();
                    el.fromBytes(aci.ber);
                    return el;
                })(),
                contexts: new Map(),
            })),
        );
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
        applicableACIItems: [
            ...entryACIItems.map((aci) => {
                const el = new DERElement();
                el.fromBytes(aci.ber);
                return _decode_ACIItem(el);
            }),
            // TODO: Obtain prescriptive ACIs if it is not type subentry.
            // TODO: Obtain subentry ACIs if it is type administrative point
        ],
    };
}

export default readEntryAttributes;

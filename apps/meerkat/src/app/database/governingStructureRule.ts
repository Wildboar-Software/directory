import type { Context, Vertex, Value } from "../types/index.js";
import type { Prisma } from "../generated/client.js";
import { ASN1Construction, type ASN1Element } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { Attribute } from "@wildboar/x500/InformationFramework";
import { governingStructureRule } from "@wildboar/x500/SchemaAdministration";
import { attributeValueFromDB } from "./attributeValueFromDB.js";

/**
 * @summary `governingStructureRule` stored as a normal attribute value
 * @description
 *
 * The governing structure rule is an ordinary attribute value in
 * `AttributeValue`. Entries keep a copy on the in-memory DSE because structure
 * rules consult the immediate superior's rule on every add and rename. That
 * copy is filled when the DSE is loaded and updated when the attribute is
 * written.
 *
 * The value has to be stored, rather than recalculated from the superior's
 * rule and the current subschema. `superiorStructureRules` names a specific
 * rule identifier, and a later subschema change can permit an entry under a
 * different rule than the one that governed it when it was created.
 */

const TYPE_OID: Uint8Array<ArrayBuffer> = governingStructureRule["&id"].toBytes();

/**
 * @summary Decode one stored `governingStructureRule` value
 * @param value The attribute value row, or the BER element of that value
 * @returns The rule identifier, or `undefined` when the value is not an integer
 */
function ruleFromElement (value: ASN1Element): number | undefined {
    try {
        const rule = Number(governingStructureRule.decoderFor["&Type"]!(value));
        return Number.isSafeInteger(rule) ? rule : undefined;
    } catch {
        return undefined;
    }
}

/**
 * @summary BER element for a governing structure rule identifier
 * @param rule The `ruleIdentifier` to encode
 * @returns The encoded INTEGER
 */
function elementFromRule (rule: number): ASN1Element {
    return governingStructureRule.encoderFor["&Type"]!(rule, DER);
}

/**
 * @summary Read an entry's governing structure rule from its attribute values
 * @param ctx The context object
 * @param entryId The database ID of the entry
 * @returns The rule identifier, or `undefined` when the attribute is absent
 *
 * @function
 * @async
 */
export
async function readGoverningStructureRule (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<number | undefined> {
    const row = await ctx.db.attributeValue.findFirst({
        where: {
            entry_id: entryId,
            type_oid: TYPE_OID,
        },
        select: {
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    });
    if (!row) {
        return undefined;
    }
    return ruleFromElement(attributeValueFromDB(row));
}

/**
 * @summary Read governing structure rules for many entries at once
 * @param ctx The context object
 * @param entryIds Database IDs of the entries to read
 * @returns A map of entry ID to rule identifier for entries that have the attribute
 *
 * @function
 * @async
 */
export
async function readGoverningStructureRules (
    ctx: Readonly<Context>,
    entryIds: number[],
): Promise<Map<number, number>> {
    const rules = new Map<number, number>();
    const chunkSize = 500;
    for (let i = 0; i < entryIds.length; i += chunkSize) {
        const rows = await ctx.db.attributeValue.findMany({
            where: {
                entry_id: {
                    in: entryIds.slice(i, i + chunkSize),
                },
                type_oid: TYPE_OID,
            },
            select: {
                entry_id: true,
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        });
        for (const row of rows) {
            if (rules.has(row.entry_id)) {
                continue;
            }
            const rule = ruleFromElement(attributeValueFromDB(row));
            if (rule !== undefined) {
                rules.set(row.entry_id, rule);
            }
        }
    }
    return rules;
}

/**
 * @summary Replace or delete an entry's `governingStructureRule` attribute
 * @description
 *
 * Returns Prisma promises that delete any existing value and, when `rule` is
 * a number, insert the new one. Callers run them in the same transaction as
 * the rest of the entry update. `null` deletes the attribute.
 *
 * @param ctx The context object
 * @param entryId The database ID of the entry
 * @param rule The new rule identifier, or `null` to delete the attribute
 * @returns Promises that perform the replacement once they are awaited
 *
 * @function
 */
export
function replaceGoverningStructureRule (
    ctx: Readonly<Context>,
    entryId: number,
    rule: number | null,
): Prisma.PrismaPromise<any>[] {
    const deletion = ctx.db.attributeValue.deleteMany({
        where: {
            entry_id: entryId,
            type_oid: TYPE_OID,
        },
    });
    if (rule === null) {
        return [ deletion ];
    }
    const encoded = elementFromRule(rule);
    return [
        deletion,
        ctx.db.attributeValue.create({
            data: {
                entry_id: entryId,
                type_oid: TYPE_OID,
                // `governingStructureRule` is a directoryOperation attribute.
                operational: true,
                tag_class: encoded.tagClass,
                constructed: (encoded.construction === ASN1Construction.constructed),
                tag_number: encoded.tagNumber,
                content_octets: encoded.value as Uint8Array<ArrayBuffer>,
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }),
    ];
}

function elementFromAttribute (attribute: Attribute): ASN1Element | undefined {
    return attribute.values[0] ?? attribute.valuesWithContext?.[0]?.value;
}

/**
 * @summary Remember a governing structure rule on the in-memory DSE
 * @param vertex The entry whose cached rule should track the attribute
 * @param attribute An attribute that might be `governingStructureRule`
 *
 * @function
 */
export
function cacheGoverningStructureRuleAttribute (
    vertex: Vertex,
    attribute: Attribute,
): void {
    if (!attribute.type_.isEqualTo(governingStructureRule["&id"])) {
        return;
    }
    const element = elementFromAttribute(attribute);
    if (!element) {
        return;
    }
    const rule = ruleFromElement(element);
    if (rule !== undefined) {
        vertex.dse.governingStructureRule = rule;
    }
}

/**
 * @summary Remember a governing structure rule value on the in-memory DSE
 * @param vertex The entry whose cached rule should track the attribute
 * @param value A value that might be `governingStructureRule`
 *
 * @function
 */
export
function cacheGoverningStructureRuleValue (
    vertex: Vertex,
    value: Value,
): void {
    if (!value.type.isEqualTo(governingStructureRule["&id"])) {
        return;
    }
    const rule = ruleFromElement(value.value);
    if (rule !== undefined) {
        vertex.dse.governingStructureRule = rule;
    }
}

/**
 * @summary Drop the cached governing structure rule when its attribute is removed
 * @param vertex The entry whose attribute is being removed
 * @param value A value that might be `governingStructureRule`
 *
 * @function
 */
export
function clearCachedGoverningStructureRuleValue (
    vertex: Vertex,
    value: Value,
): void {
    if (!value.type.isEqualTo(governingStructureRule["&id"])) {
        return;
    }
    const rule = ruleFromElement(value.value);
    if (
        (rule === undefined)
        || (vertex.dse.governingStructureRule === rule)
    ) {
        vertex.dse.governingStructureRule = undefined;
    }
}

/**
 * @summary Drop the cached governing structure rule when its attribute is removed
 * @param vertex The entry whose attribute is being removed
 * @param type The attribute type being removed
 *
 * @function
 */
export
function clearCachedGoverningStructureRule (
    vertex: Vertex,
    type: Value["type"],
): void {
    if (type.isEqualTo(governingStructureRule["&id"])) {
        vertex.dse.governingStructureRule = undefined;
    }
}

/**
 * @summary Include `governingStructureRule` among an entry's initial attributes
 * @description
 *
 * DSA-assigned rules are passed beside the entry attributes. When the
 * attributes do not already contain `governingStructureRule`, this returns a
 * new array that does. An attribute already present is left unchanged so a
 * supplied value is the one that is stored.
 *
 * @param attributes The attributes supplied for the new entry
 * @param rule A rule identifier to store when the attribute is absent
 * @returns The attributes to write, and the rule identifier they contain
 *
 * @function
 */
export
function withGoverningStructureRule (
    attributes: Attribute[],
    rule: number | null | undefined,
): { attributes: Attribute[]; governingStructureRule: number | undefined } {
    const existing = attributes.find((attribute) => (
        attribute.type_.isEqualTo(governingStructureRule["&id"])
    ));
    if (existing) {
        const element = elementFromAttribute(existing);
        return {
            attributes,
            governingStructureRule: element ? ruleFromElement(element) : undefined,
        };
    }
    if (typeof rule !== "number") {
        return {
            attributes,
            governingStructureRule: undefined,
        };
    }
    return {
        attributes: [
            ...attributes,
            new Attribute(
                governingStructureRule["&id"],
                [elementFromRule(rule)],
                undefined,
            ),
        ],
        governingStructureRule: rule,
    };
}

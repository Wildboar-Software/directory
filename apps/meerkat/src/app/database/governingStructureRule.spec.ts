import { strict as assert } from "node:assert";
import { DER } from "@wildboar/asn1/functional";
import { Attribute } from "@wildboar/x500/InformationFramework";
import { governingStructureRule } from "@wildboar/x500/SchemaAdministration";
import { createPersonEntry, getMockCtx } from "../testing.spec.js";
import addAttributes from "./entry/addAttributes.js";
import removeAttribute from "./entry/removeAttribute.js";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry.js";
import readSubordinates from "../dit/readSubordinates.js";
import {
    readGoverningStructureRule,
    replaceGoverningStructureRule,
    withGoverningStructureRule,
} from "./governingStructureRule.js";

const ctx = getMockCtx();

describe("governingStructureRule attribute storage", () => {
    it("stores a supplied rule as an attribute value and reads it back", async () => {
        const vertex = await createPersonEntry(ctx, undefined, "Gsr Ada", "Lovelace");
        const encoded = governingStructureRule.encoderFor["&Type"]!(128, DER);
        const writes = await addAttributes(
            ctx,
            vertex,
            [
                new Attribute(
                    governingStructureRule["&id"],
                    [encoded],
                    undefined,
                ),
            ],
            undefined,
            true,
            false,
            true,
        );
        await ctx.db.$transaction(writes);
        assert.equal(vertex.dse.governingStructureRule, 128);

        const row = await ctx.db.attributeValue.findFirst({
            where: {
                entry_id: vertex.dse.id,
                type_oid: governingStructureRule["&id"].toBytes(),
            },
        });
        assert.ok(row);
        assert.equal(row.operational, true);
        assert.equal(row.tag_number, encoded.tagNumber);
        assert.deepEqual(Buffer.from(row.content_octets), Buffer.from(encoded.value));
        assert.equal(await readGoverningStructureRule(ctx, vertex.dse.id), 128);

        const dbe = await ctx.db.entry.findUnique({
            where: { id: vertex.dse.id },
        });
        assert.ok(dbe);
        const dse = await dseFromDatabaseEntry(ctx, dbe);
        assert.equal(dse.governingStructureRule, 128);

        await ctx.db.$transaction(await removeAttribute(ctx, vertex, governingStructureRule["&id"]));
        assert.equal(vertex.dse.governingStructureRule, undefined);
        assert.equal(await readGoverningStructureRule(ctx, vertex.dse.id), undefined);
    });

    it("replaces and clears the attribute for several integer widths", async () => {
        const vertex = await createPersonEntry(ctx, undefined, "Gsr Widths", "Lovelace");
        for (const rule of [0, 1, 127, 255, 256, 32768, -1, -129]) {
            await ctx.db.$transaction(replaceGoverningStructureRule(ctx, vertex.dse.id, rule));
            assert.equal(await readGoverningStructureRule(ctx, vertex.dse.id), rule);
        }
        await ctx.db.$transaction(replaceGoverningStructureRule(ctx, vertex.dse.id, null));
        assert.equal(await readGoverningStructureRule(ctx, vertex.dse.id), undefined);
    });

    it("keeps an attribute that was already supplied for a new entry", () => {
        const supplied = new Attribute(
            governingStructureRule["&id"],
            [governingStructureRule.encoderFor["&Type"]!(4, DER)],
            undefined,
        );
        const prepared = withGoverningStructureRule([supplied], 9);
        assert.equal(prepared.attributes.length, 1);
        assert.equal(prepared.governingStructureRule, 4);
        const injected = withGoverningStructureRule([], 9);
        assert.equal(injected.attributes.length, 1);
        assert.equal(injected.governingStructureRule, 9);
        assert.equal(injected.attributes[0].values[0].integer, 9);
    });

    it("loads subordinate rules in one batch", async () => {
        const superior = await createPersonEntry(ctx, undefined, "Gsr Superior", "Lovelace");
        const child = await createPersonEntry(ctx, superior, "Gsr Child", "Lovelace");
        await ctx.db.$transaction(replaceGoverningStructureRule(ctx, child.dse.id, 7));
        const subordinates = await readSubordinates(ctx, superior);
        const loaded = subordinates.find((subordinate) => subordinate.dse.id === child.dse.id);
        assert.ok(loaded);
        assert.equal(loaded.dse.governingStructureRule, 7);
    });
});

import { ObjectIdentifier } from "@wildboar/asn1";
import { getMockCtx } from "../../testing.spec.js";
import { hasValueWithoutDriver } from "./hasValueWithoutDriver.js";
import * as crypto from "node:crypto";
import { AttributeInfo, Value } from "../../types/types.js";
import { _encodeNumericString, _encodeOctetString, _encodePrintableString, _encodeUTF8String, BER } from "@wildboar/asn1/functional";
import { AttributeUsage_userApplications } from "@wildboar/x500/InformationFramework";
import { caseIgnoreMatch, numericStringMatch, octetStringMatch, telephoneNumberMatch } from "@wildboar/x500/SelectedAttributeTypes";
import { strict as assert } from "node:assert";

const ctx = getMockCtx();

describe("hasValueWithoutDriver", async () => {
    it("works with directory string values", async () => {
        const now = new Date();
        const entry = await ctx.db.entry.create({
            data: {
                // immediate_superior_id: undefined,
                materialized_path: "0.1",
                entryUUID: crypto.randomUUID(),
                creatorsName: [],
                modifiersName: [],
                createTimestamp: now,
                modifyTimestamp: now,
                glue: false,
                cp: false,
                entry: true,
                subr: false,
                nssr: false,
                xr: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                admPoint: false,
                dsSubentry: false,
                alias: false,
                subordinate_completeness: true,
                attribute_completeness: true,
            },
            select: {
                id: true,
            },
        });
        const attr_type = ObjectIdentifier.fromString("2.5.4.3");
        await ctx.db.attributeValue.create({
            data: {
                entry_id: entry.id,
                type_oid: attr_type.toBytes(), // commonName
                tag_class: 0,
                constructed: false,
                tag_number: 12,
                operational: false,
                content_octets: Buffer.from("hi mom", "ascii"),
            },
            select: {
                id: true,
            },
        });
        const value: Value = {
            type: attr_type,
            value: _encodeUTF8String(" Hi  MoM  ", BER),
        };
        const attrSpec: AttributeInfo = {
            id: attr_type,
            usage: AttributeUsage_userApplications,
            equalityMatchingRule: caseIgnoreMatch["&id"],
            compatibleMatchingRules: new Set(caseIgnoreMatch["&id"].toString()),
        };
        const has = await hasValueWithoutDriver(
            ctx,
            entry.id,
            value,
            attrSpec,
        );
        assert(has);
    });

    it("works with numeric string values", async () => {
        const now = new Date();
        const entry = await ctx.db.entry.create({
            data: {
                // immediate_superior_id: undefined,
                materialized_path: "0.1",
                entryUUID: crypto.randomUUID(),
                creatorsName: [],
                modifiersName: [],
                createTimestamp: now,
                modifyTimestamp: now,
                glue: false,
                cp: false,
                entry: true,
                subr: false,
                nssr: false,
                xr: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                admPoint: false,
                dsSubentry: false,
                alias: false,
                subordinate_completeness: true,
                attribute_completeness: true,
            },
            select: {
                id: true,
            },
        });
        const attr_type = ObjectIdentifier.fromString("2.5.4.24"); // x121Address
        await ctx.db.attributeValue.create({
            data: {
                entry_id: entry.id,
                type_oid: attr_type.toBytes(),
                tag_class: 0,
                constructed: false,
                tag_number: 18,
                operational: false,
                content_octets: Buffer.from("   123 456  789 ", "ascii"),
            },
            select: {
                id: true,
            },
        });
        const value: Value = {
            type: attr_type,
            value: _encodeNumericString("123 456789 ", BER),
        };
        const attrSpec: AttributeInfo = {
            id: attr_type,
            usage: AttributeUsage_userApplications,
            equalityMatchingRule: numericStringMatch["&id"],
            compatibleMatchingRules: new Set(numericStringMatch["&id"].toString()),
        };
        const has = await hasValueWithoutDriver(
            ctx,
            entry.id,
            value,
            attrSpec,
        );
        assert(has);
    });

    it("works with telephone number values", async () => {
        const now = new Date();
        const entry = await ctx.db.entry.create({
            data: {
                // immediate_superior_id: undefined,
                materialized_path: "0.1",
                entryUUID: crypto.randomUUID(),
                creatorsName: [],
                modifiersName: [],
                createTimestamp: now,
                modifyTimestamp: now,
                glue: false,
                cp: false,
                entry: true,
                subr: false,
                nssr: false,
                xr: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                admPoint: false,
                dsSubentry: false,
                alias: false,
                subordinate_completeness: true,
                attribute_completeness: true,
            },
            select: {
                id: true,
            },
        });
        const attr_type = ObjectIdentifier.fromString("2.5.4.20"); // telephoneNumber
        await ctx.db.attributeValue.create({
            data: {
                entry_id: entry.id,
                type_oid: attr_type.toBytes(),
                tag_class: 0,
                constructed: false,
                tag_number: 19,
                operational: false,
                content_octets: Buffer.from("+1 234 567 1234", "ascii"),
            },
            select: {
                id: true,
            },
        });
        const value: Value = {
            type: attr_type,
            value: _encodePrintableString("+1-234-567-1234", BER),
        };
        const attrSpec: AttributeInfo = {
            id: attr_type,
            usage: AttributeUsage_userApplications,
            equalityMatchingRule: telephoneNumberMatch["&id"],
            compatibleMatchingRules: new Set(telephoneNumberMatch["&id"].toString()),
        };
        const has = await hasValueWithoutDriver(
            ctx,
            entry.id,
            value,
            attrSpec,
        );
        assert(has);
    });

    it("works with all other values", async () => {
        const now = new Date();
        const entry = await ctx.db.entry.create({
            data: {
                // immediate_superior_id: undefined,
                materialized_path: "0.1",
                entryUUID: crypto.randomUUID(),
                creatorsName: [],
                modifiersName: [],
                createTimestamp: now,
                modifyTimestamp: now,
                glue: false,
                cp: false,
                entry: true,
                subr: false,
                nssr: false,
                xr: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                admPoint: false,
                dsSubentry: false,
                alias: false,
                subordinate_completeness: true,
                attribute_completeness: true,
            },
            select: {
                id: true,
            },
        });
        const attr_type = ObjectIdentifier.fromString("2.5.4.92"); // tagAfi
        await ctx.db.attributeValue.create({
            data: {
                entry_id: entry.id,
                type_oid: attr_type.toBytes(),
                tag_class: 0,
                constructed: false,
                tag_number: 4,
                operational: false,
                content_octets: Buffer.from([ 0xFF, 0x00, 0x80, 0x88]),
            },
            select: {
                id: true,
            },
        });
        const value: Value = {
            type: attr_type,
            value: _encodeOctetString(Buffer.from([ 0xFF, 0x00, 0x80, 0x88]), BER),
        };
        const attrSpec: AttributeInfo = {
            id: attr_type,
            usage: AttributeUsage_userApplications,
            equalityMatchingRule: octetStringMatch["&id"],
            compatibleMatchingRules: new Set(octetStringMatch["&id"].toString()),
        };
        const has = await hasValueWithoutDriver(
            ctx,
            entry.id,
            value,
            attrSpec,
        );
        assert(has);
    });
});

import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "@wildboar/meerkat-types";
import { BERElement, FALSE_BIT } from "asn1-ts";
import {
    serviceAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import {
    searchRules,
} from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

const SUBENTRY_CLASS: string = serviceAdminSubentry["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry && vertex.dse.objectClass.has(SUBENTRY_CLASS)) {
        return [];
    }
    return (await ctx.db.searchRule.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            ber: true,
        },
    }))
        .map(({ ber }) => {
            const value = new BERElement();
            value.fromBytes(ber);
            return {
                type: searchRules["&id"],
                value,
            };
        });
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = searchRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.searchRule.create({
        data: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
            rule_id: Number(decoded.id),
            dmd_id: decoded.dmdId.toString(),
            service_type: decoded.serviceType?.toJSON(),
            user_class: (decoded.userClass !== undefined)
                ? Number(decoded.userClass)
                : undefined,
            family_grouping: decoded.familyGrouping,
            family_return_member_select: decoded.familyReturn?.memberSelect,
            relaxation_minimum: (decoded.relaxation?.minimum !== undefined)
                ? Number(decoded.relaxation.minimum)
                : undefined,
            relaxation_maximum: (decoded.relaxation?.maximum !== undefined)
                ? Number(decoded.relaxation.maximum)
                : undefined,
            additionalControl: decoded.additionalControl?.map((oid) => oid.toString()).join(" "),
            base_object_allowed: (decoded.allowedSubset?.[0] === FALSE_BIT) ? false : true,
            one_level_allowed: (decoded.allowedSubset?.[1] === FALSE_BIT) ? false : true,
            whole_subtree_allowed: (decoded.allowedSubset?.[2] === FALSE_BIT) ? false : true,
            imposed_subset: decoded.imposedSubset,
            entry_limit_default: (decoded.entryLimit?.default_ !== undefined)
                ? Number(decoded.entryLimit.default_)
                : undefined,
            entry_limit_max: (decoded.entryLimit?.max !== undefined)
                ? Number(decoded.entryLimit.max)
                : undefined,
            name: decoded.name?.map(directoryStringToString).join(" "),
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = searchRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.searchRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            rule_id: Number(decoded.id),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.searchRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return ctx.db.searchRule.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.searchRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            id: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = searchRules.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.searchRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
            rule_id: Number(decoded.id),
        },
        select: {
            id: true,
        },
    }));
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
};

export default driver;

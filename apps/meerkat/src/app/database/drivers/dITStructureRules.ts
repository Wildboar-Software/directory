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
import { DER } from "asn1-ts/dist/node/functional";
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import readDITStructureRuleDescriptions from "../readers/readDITStructureRuleDescriptions";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";

const SUBSCHEMA: string = subschema["&id"].toString();
const ID_AR_SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITStructureRuleDescriptions(ctx, vertex.dse.id))
        .map((value) => ({
            type: dITStructureRules["&id"],
            value: dITStructureRules.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    /**
     * When we are defining a new subschema administrative point, the
     * administrative point itself may be `null` because there were no structure
     * rules to apply to it yet.
     *
     * For that reason, when we add a DIT Structure Rule, we check if the
     * superior is a subschema admin point, and update its governing structure
     * rule if this newly-added DIT structure rule applies to it.
     */
    if (
        !decoded.superiorStructureRules?.length // If this structure rule applies to the admin point...
        // And what is above this entry is actually a subschema administrative point...
        && vertex.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_AR_SUBSCHEMA)
        // And it has no governing structure rule...
        && (typeof vertex.immediateSuperior.dse.governingStructureRule !== "number")
        // NOTE: We do not check if the current entry is a subschema. We just
        // assume it is, because this attribute / value may have been supplied
        // during the subentry's creation, and therefore, it may not be a
        // subentry _yet_ in the eyes of Meerkat DSA.
    ) {
        const nameForm = ctx.nameForms.get(decoded.nameForm.toString());
        if (nameForm) {
            const structureRuleIsApplicableToTheAdminPoint: boolean = !!(
                vertex.immediateSuperior.dse.structuralObjectClass?.isEqualTo(nameForm.namedObjectClass)
                && checkNameForm(
                    vertex.immediateSuperior.dse.rdn,
                    nameForm.mandatoryAttributes,
                    nameForm.optionalAttributes,
                )
            );
            if (structureRuleIsApplicableToTheAdminPoint) {
                const newGSR = Number(decoded.ruleIdentifier);
                vertex.immediateSuperior.dse.governingStructureRule = newGSR;
                pendingUpdates.otherWrites.push(ctx.db.entry.update({
                    where: {
                        id: vertex.immediateSuperior.dse.id,
                    },
                    data: {
                        governingStructureRule: newGSR,
                    },
                    select: null,
                }));
                /**
                 * We log this at a debug level here, because it looks like the
                 * GSR is just getting set for the first time, which is no
                 * cause for any alarm at all.
                 */
                ctx.log.debug(ctx.i18n.t("log:admpoint_gsr_recalculated", {
                    uuid: vertex.immediateSuperior.dse.uuid,
                }));
            }
        }
    }

    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.upsert({
        where: {
            entry_id_ruleIdentifier: {
                entry_id: vertex.dse.id,
                ruleIdentifier: Number(decoded.ruleIdentifier),
            },
        },
        create: {
            entry_id: vertex.dse.id,
            ruleIdentifier: Number(decoded.ruleIdentifier),
            nameForm: decoded.nameForm.toString(),
            superiorStructureRules: decoded.superiorStructureRules
                ?.map((ssr) => ssr.toString())
                .join(" ") ?? null,
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
        update: {
            nameForm: decoded.nameForm.toString(),
            superiorStructureRules: decoded.superiorStructureRules
                ?.map((ssr) => ssr.toString())
                .join(" ") ?? null,
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
        select: null,
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditStructureRules) {
            vertex.dse.subentry.ditStructureRules.push(decoded);
        } else {
            vertex.dse.subentry.ditStructureRules = [ decoded ];
        }
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.delete({
        where: {
            entry_id_ruleIdentifier: {
                entry_id: vertex.dse.id,
                ruleIdentifier: Number(decoded.ruleIdentifier),
            },
        },
    }));

    if (
        !decoded.superiorStructureRules?.length // If this structure rule applies to the admin point...
        // And what is above this entry is actually a subschema administrative point...
        && vertex.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_AR_SUBSCHEMA)
        // And the admin point's GSR is THIS GSR.
        && (decoded.ruleIdentifier === vertex.immediateSuperior?.dse.governingStructureRule)
    ) { // We have to recalculate the GSR for the admin point.
        const structureRules = vertex.dse.subentry?.ditStructureRules ?? [];
        const applicableStructureRule = structureRules.find((sr) => {
            if (sr.ruleIdentifier === decoded.ruleIdentifier) {
                return false;
            }
            const nameForm = ctx.nameForms.get(sr.nameForm.toString());
            if (!nameForm) {
                return false;
            }
            return (
                vertex.immediateSuperior!.dse.structuralObjectClass?.isEqualTo(nameForm.namedObjectClass)
                && checkNameForm(vertex.immediateSuperior!.dse.rdn, nameForm.mandatoryAttributes, nameForm.optionalAttributes)
            );
        });
        if (applicableStructureRule) {
            vertex.immediateSuperior.dse.governingStructureRule = Number(decoded.ruleIdentifier);
            pendingUpdates.otherWrites.push(ctx.db.entry.update({
                where: {
                    id: vertex.immediateSuperior.dse.id,
                },
                data: {
                    governingStructureRule: Number(decoded.ruleIdentifier),
                },
                select: null,
            }));
        } else {
            vertex.immediateSuperior.dse.governingStructureRule = undefined;
            pendingUpdates.otherWrites.push(ctx.db.entry.update({
                where: {
                    id: vertex.immediateSuperior.dse.id,
                },
                data: {
                    governingStructureRule: null,
                },
                select: null,
            }));
        }
        ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
            uuid: vertex.immediateSuperior.dse.uuid,
        }));
        ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
            context: "hint",
        }));
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));

    // The admin point now has no governing structure rule.
    if (vertex.immediateSuperior?.dse.admPoint?.administrativeRole.has(ID_AR_SUBSCHEMA)) {
        vertex.immediateSuperior.dse.governingStructureRule = undefined;
        pendingUpdates.otherWrites.push(ctx.db.entry.update({
            where: {
                id: vertex.immediateSuperior.dse.id,
            },
            data: {
                governingStructureRule: null,
            },
            select: null,
        }));
        ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
            uuid: vertex.immediateSuperior.dse.uuid,
        }));
        ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
            context: "hint",
        }));
    }
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return ctx.db.dITStructureRule.count({
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
    return !!(await ctx.db.dITStructureRule.findFirst({
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
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.dITStructureRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
            ruleIdentifier: Number(decoded.ruleIdentifier),
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

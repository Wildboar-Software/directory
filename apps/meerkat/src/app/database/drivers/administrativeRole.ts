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
import {
    ObjectIdentifier,
} from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import { Prisma } from "@prisma/client";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";
import getSubschemaSubentry from "../../dit/getSubschemaSubentry";

const ID_AR_AUTONOMOUS: string = id_ar_autonomousArea.toString();
const ID_AR_SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(vertex.dse.admPoint?.administrativeRole.values() ?? [])
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            type: administrativeRole["&id"]!,
            value,
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const oid = value.value.objectIdentifier;

    /**
     * This section exists because, when we make an entry a subschema admin
     * point, it's governing structure rule must be recalculated according to
     * the new DIT structure rules that are (or will be) defined.
     */
    if (oid.isEqualTo(id_ar_subschemaAdminSpecificArea)) {
        const subschemaSubentry = await ctx.db.entry.findFirst({
            where: {
                immediate_superior_id: vertex.dse.id,
                deleteTimestamp: null,
                subentry: true,
                EntryObjectClass: {
                    some: {
                        object_class: subschema["&id"].toString(),
                    },
                },
            },
            select: {
                DITStructureRule: {
                    where: {
                        superiorStructureRules: Prisma.DbNull,
                    },
                    select: {
                        ruleIdentifier: true,
                        nameForm: true,
                    },
                },
            },
        });
        const previousGSR = vertex.dse.governingStructureRule;
        // vertex.dse.structuralObjectClass should be defined.
        if (subschemaSubentry && vertex.dse.structuralObjectClass) {
            const applicableStructureRule = subschemaSubentry.DITStructureRule
                .find((sr) => {
                    const nameForm = ctx.nameForms.get(sr.nameForm);
                    if (!nameForm) {
                        return false;
                    }
                    return (
                        vertex.dse.structuralObjectClass!.isEqualTo(nameForm.namedObjectClass)
                        && checkNameForm(vertex.dse.rdn, nameForm.mandatoryAttributes, nameForm.optionalAttributes)
                    );
                });
            const newGSR = applicableStructureRule?.ruleIdentifier ?? null;
            pendingUpdates.entryUpdate.governingStructureRule = newGSR;
            if ((newGSR ?? undefined) !== previousGSR) {
                ctx.log.warn(ctx.i18n.t("log:gsr_changed", {
                    uuid: vertex.dse.uuid,
                }));
                ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
                    context: "hint",
                }));
            }
        } else {
            pendingUpdates.entryUpdate.governingStructureRule = null;
            if (previousGSR !== undefined) {
                ctx.log.warn(ctx.i18n.t("log:gsr_changed", {
                    uuid: vertex.dse.uuid,
                }));
                ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
                    context: "hint",
                }));
            }
        }
    }

    const oidStr: string = oid.toString();
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.create({
        data: {
            entry_id: vertex.dse.id,
            administrativeRole: oidStr,
        },
    }));
    pendingUpdates.entryUpdate.admPoint = true;
    if (vertex.dse.admPoint) {
        vertex.dse.admPoint.administrativeRole.add(oidStr);
    } else {
        vertex.dse.admPoint = {
            administrativeRole: new Set([ oidStr ]),
        };
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (
        ((await ctx.db.entryAdministrativeRole.count()) === 1)
        && (await hasValue(ctx, vertex, value))
    ) {
        pendingUpdates.entryUpdate.admPoint = false;
    }
    const oid = value.value.objectIdentifier;
    /**
     * If the subschema admin role is removed, the governing structure rule from
     * the old subschema is now incorrect, and it needs to be re-calculated
     * according to the structure rules of the superior (and now governing)
     * subschema administrative area.
     */
    if (
        (
            oid.isEqualTo(id_ar_subschemaAdminSpecificArea)
            || oid.isEqualTo(id_ar_autonomousArea)
        )
        && vertex.immediateSuperior
    ) {
        const previousGSR = vertex.dse.governingStructureRule;
        const subschema = await getSubschemaSubentry(ctx, vertex.immediateSuperior);
        if (subschema) {
            const structureRules = subschema.dse.subentry?.ditStructureRules;
            const applicableStructureRule = structureRules
                ?.find((sr) => {
                    const nameForm = ctx.nameForms.get(sr.nameForm.toString());
                    if (!nameForm) {
                        return false;
                    }
                    return (
                        vertex.dse.structuralObjectClass!.isEqualTo(nameForm.namedObjectClass)
                        && checkNameForm(vertex.dse.rdn, nameForm.mandatoryAttributes, nameForm.optionalAttributes)
                    );
                });
            const newGSR = applicableStructureRule?.ruleIdentifier
                ? Number(applicableStructureRule.ruleIdentifier)
                : null;
            pendingUpdates.entryUpdate.governingStructureRule = newGSR;
            vertex.dse.governingStructureRule = newGSR ?? undefined;
            if ((newGSR ?? undefined) !== previousGSR) {
                ctx.log.warn(ctx.i18n.t("log:gsr_changed", {
                    uuid: vertex.dse.uuid,
                }));
                ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
                    context: "hint",
                }));
            }
        }
    }

    const oidStr: string = oid.toString();
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            administrativeRole: oidStr,
        },
    }));
    if (vertex.dse.admPoint) {
        vertex.dse.admPoint.administrativeRole.delete(oidStr);
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    /**
     * If the subschema admin role is removed, the governing structure rule from
     * the old subschema is now incorrect, and it needs to be re-calculated
     * according to the structure rules of the superior (and now governing)
     * subschema administrative area.
     */
    if (
        (
            vertex.dse.admPoint?.administrativeRole.has(ID_AR_SUBSCHEMA)
            || vertex.dse.admPoint?.administrativeRole.has(ID_AR_AUTONOMOUS)
        )
        && vertex.immediateSuperior
    ) {
        const subschema = await getSubschemaSubentry(ctx, vertex.immediateSuperior);
        if (subschema) {
            const previousGSR = vertex.dse.governingStructureRule;
            const structureRules = subschema.dse.subentry?.ditStructureRules;
            const applicableStructureRule = structureRules
                ?.find((sr) => {
                    const nameForm = ctx.nameForms.get(sr.nameForm.toString());
                    if (!nameForm) {
                        return false;
                    }
                    return (
                        vertex.dse.structuralObjectClass!.isEqualTo(nameForm.namedObjectClass)
                        && checkNameForm(vertex.dse.rdn, nameForm.mandatoryAttributes, nameForm.optionalAttributes)
                    );
                });
            const newGSR = applicableStructureRule?.ruleIdentifier
                ? Number(applicableStructureRule.ruleIdentifier)
                : null;
            pendingUpdates.entryUpdate.governingStructureRule = newGSR;
            vertex.dse.governingStructureRule = newGSR ?? undefined;
            if ((newGSR ?? undefined) !== previousGSR) {
                ctx.log.warn(ctx.i18n.t("log:gsr_changed", {
                    uuid: vertex.dse.uuid,
                }));
                ctx.log.warn(ctx.i18n.t("log:admpoint_gsr_recalculated", {
                    context: "hint",
                }));
            }
        }
    }

    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
    pendingUpdates.entryUpdate.admPoint = false;
    delete vertex.dse.admPoint;
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.admPoint?.administrativeRole.size ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return (vertex.dse.admPoint?.administrativeRole.size ?? 0) > 0;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return vertex.dse.admPoint?.administrativeRole.has(value.value.objectIdentifier.toString()) ?? false;
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

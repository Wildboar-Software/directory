import type { Context } from "../../types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import type {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import findEntry from "../../x500/findEntry";
import rdnToJson from "../../x500/rdnToJson";
import writeACI from "../../database/writeACI";
import writeEntryAttributes from "../../database/writeEntryAttributes";
import entryFromDatabaseEntry from "../../database/entryFromDatabaseEntry";
import valuesFromAttribute from "../../memory/valuesFromAttribute";
import { ACIScope } from "@prisma/client";

// TODO: If context prefix initialization fails, undo all changes.
export
async function becomeSubordinate (
    ctx: Context,
    agreement: HierarchicalAgreement,
    sup2sub: SuperiorToSubordinate,
): Promise<SubordinateToSuperior> {
    let currentRoot = ctx.dit.root;
    for (const vertex of sup2sub.contextPrefixInfo) {
        const existingEntry = await findEntry(ctx, currentRoot, [ vertex.rdn ]);
        if (!existingEntry) {
            const administrativeRoles: OBJECT_IDENTIFIER[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(administrativeRole["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => value.objectIdentifier) ?? [];
            const accessControlSchemeOIDs: OBJECT_IDENTIFIER[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(accessControlScheme["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => value.objectIdentifier) ?? [];
            const subentryACIs: ACIItem[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(subentryACI["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => _decode_ACIItem(value)) ?? [];
            const entryACIs: ACIItem[] = vertex.admPointInfo
                ?.filter((attr) => attr.type_.isEqualTo(entryACI["&id"]))
                .flatMap((attr) => [
                    ...attr.values,
                    ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                ])
                .map((value) => _decode_ACIItem(value)) ?? [];
            if (accessControlSchemeOIDs.length > 1) {
                throw new Error(); // FIXME:
            }
            const createdEntry = await ctx.db.entry.create({
                data: {
                    dit_id: ctx.dit.id,
                    rdn: rdnToJson(vertex.rdn),
                    immediate_superior_id: currentRoot.dse.id,
                    glue: (!vertex.admPointInfo && !vertex.accessPoints),
                    admPoint: Boolean(vertex.admPointInfo),
                    cp: Boolean(vertex.accessPoints), // TODO: This is only for the immediate superior.
                    creatorsName: [], // TODO:
                    modifiersName: [], // TODO:
                    administrativeRole: administrativeRoles.length
                        ? administrativeRoles.map((ar) => ar.toString())
                        : undefined,
                    accessControlScheme: (accessControlSchemeOIDs.length === 1)
                        ? accessControlSchemeOIDs.toString()
                        : undefined,
                },
            });
            for (const aci of entryACIs) {
                await writeACI(ctx, createdEntry.id, aci, ACIScope.ENTRY);
            }
            for (const aci of subentryACIs) {
                await writeACI(ctx, createdEntry.id, aci, ACIScope.SUBENTRY);
            }
            currentRoot = await entryFromDatabaseEntry(ctx, currentRoot, createdEntry, true);
            currentRoot.dse.entryACI = entryACIs;
            if (currentRoot.dse.admPoint && subentryACIs.length) {
                currentRoot.dse.admPoint.subentryACI = subentryACIs;
            }
            for (const subentry of (vertex.subentries ?? [])) {
                const entryACIs_for_subentry: ACIItem[] = subentry.info
                    ?.filter((attr) => attr.type_.isEqualTo(entryACI["&id"]))
                    .flatMap((attr) => [
                        ...attr.values,
                        ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                    ])
                    .map((value) => _decode_ACIItem(value)) ?? [];
                const prescriptiveACIs: ACIItem[] = subentry.info
                    ?.filter((attr) => attr.type_.isEqualTo(prescriptiveACI["&id"]))
                    .flatMap((attr) => [
                        ...attr.values,
                        ...(attr.valuesWithContext ?? []).map((vwc) => vwc.value),
                    ])
                    .map((value) => _decode_ACIItem(value)) ?? [];
                const createdSubentry = await ctx.db.entry.create({
                    data: {
                        dit_id: ctx.dit.id,
                        rdn: rdnToJson(subentry.rdn),
                        immediate_superior_id: createdEntry.id,
                        subentry: true,
                        creatorsName: [], // TODO:
                        modifiersName: [], // TODO:
                    },
                });
                for (const aci of entryACIs_for_subentry) {
                    await writeACI(ctx, createdSubentry.id, aci, ACIScope.ENTRY);
                }
                for (const aci of prescriptiveACIs) {
                    await writeACI(ctx, createdSubentry.id, aci, ACIScope.SUBENTRY);
                }
            }
        } else {
            currentRoot = existingEntry;
        }
    }
    if (sup2sub.immediateSuperiorInfo) {
        const values = sup2sub.immediateSuperiorInfo.flatMap((attr) => valuesFromAttribute(attr));
        await writeEntryAttributes(ctx, currentRoot.immediateSuperior!, values);
    }
    if (sup2sub.entryInfo) {
        const values = sup2sub.entryInfo.flatMap((attr) => valuesFromAttribute(attr));
        await writeEntryAttributes(ctx, currentRoot, values);
    }
    return new SubordinateToSuperior(
        undefined, // TODO:
        false,
        sup2sub.entryInfo,
        undefined,
    );
}

export default becomeSubordinate;

import type { Context, Vertex } from "../types/index.js";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/DistributedOperations";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/DistributedOperations";
import type {
    DITcontext,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    SubentryInfo,
    Vertex as X500Vertex,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import readSubordinates from "../dit/readSubordinates.js";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry.js";
import { getEntryAttributesToShareInOpBinding } from "../dit/getEntryAttributesToShareInOpBinding.js";

/**
 * @summary Given a vertex, produce a `DITcontext` per ITU Recommendation X.518.
 * @description
 *
 * This function takes a vertex, and traverses upwards towards the root DSE, to
 * produce a `DITcontext`, which is used in establishing and modifying
 * hierarchical operational bindings, per ITU Recommendation X.518 (2016),
 * Section 24.1.4.1.1.
 *
 * @param ctx The context object
 * @param immediateSuperiorOfNewContextPrefix The vertex of the immediate
 *  superior of the new context prefix
 * @returns A `DITcontext`, as used in hierarchical operational bindings.
 *
 * @function
 * @async
 */
export
async function getContextPrefixInfo (
    ctx: Context,
    immediateSuperiorOfNewContextPrefix: Vertex,
): Promise<DITcontext> {
    const contextPrefixInfo: DITcontext = [];
    let current: Vertex | undefined = immediateSuperiorOfNewContextPrefix;
    let immSupr: boolean = true;
    while (current && !current.dse.root) {
        const admPointInfo: Attribute[] = [];
        const subentryInfos: SubentryInfo[] = [];
        const accessPoints: MasterAndShadowAccessPoints = [];

        if (current.dse.admPoint) {
            admPointInfo.push(...await getEntryAttributesToShareInOpBinding(ctx, current));
            const subentries = await readSubordinates(ctx, current, undefined, undefined, undefined, {
                subentry: true,
            });
            for (const sub of subentries) {
                subentryInfos.push(new SubentryInfo(
                    sub.dse.rdn,
                    await getAttributesFromSubentry(ctx, sub),
                ));
            }

            if (immSupr) {
                accessPoints.push(
                    new MasterOrShadowAccessPoint(
                        ctx.dsa.accessPoint.ae_title,
                        ctx.dsa.accessPoint.address,
                        ctx.dsa.accessPoint.protocolInformation,
                        (!current.dse.shadow && !current.dse.cp?.supplierKnowledge?.length)
                            ? MasterOrShadowAccessPoint_category_master
                            : MasterOrShadowAccessPoint_category_shadow,
                        false,
                    ),
                );
                immSupr = false;
            }
        }

        contextPrefixInfo.push(new X500Vertex(
            current.dse.rdn,
            (admPointInfo.length > 0) ? admPointInfo : undefined,
            (subentryInfos.length > 0) ? subentryInfos : undefined,
            (accessPoints.length > 0) ? accessPoints : undefined,
        ));
        current = current.immediateSuperior;
    }
    return contextPrefixInfo.reverse();
}

export default getContextPrefixInfo;

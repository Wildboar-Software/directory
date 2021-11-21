import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import type {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import type {
    DITcontext,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/DITcontext.ta";
import {
    SubentryInfo,
    Vertex as X500Vertex,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
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
    _encode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import readChildren from "../dit/readChildren";
import { ASN1Construction, ASN1TagClass, ASN1UniversalType, DERElement, ObjectIdentifier } from "asn1-ts";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry";
import { DER } from "asn1-ts/dist/node/functional";

export
async function getContextPrefixInfo (
    ctx: Context,
    immediateSuperiorOfNewContextPrefix: Vertex,
): Promise<DITcontext> {
    const contextPrefixInfo: DITcontext = [];
    let current: Vertex | undefined = immediateSuperiorOfNewContextPrefix;
    while (current) {
        const admPointInfo: Attribute[] = [];
        const subentryInfos: SubentryInfo[] = [];
        const accessPoints: MasterAndShadowAccessPoints = [];
        let contextPrefixEncountered: boolean = false;

        if (current.dse.admPoint) {
            admPointInfo.push(new Attribute(
                administrativeRole["&id"],
                Array.from(current.dse.admPoint.administrativeRole)
                    .map((oidStr) => ObjectIdentifier.fromString(oidStr))
                    .map((oid) => new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.primitive,
                        ASN1UniversalType.objectIdentifier,
                        oid,
                    )),
                undefined,
            ));
            if (current.dse.admPoint.accessControlScheme) {
                admPointInfo.push(new Attribute(
                    accessControlScheme["&id"],
                    [
                        new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.objectIdentifier,
                            current.dse.admPoint.accessControlScheme,
                        ),
                    ],
                    undefined,
                ));
            }
            if (current.dse.admPoint.subentryACI) {
                admPointInfo.push(new Attribute(
                    subentryACI["&id"],
                    current.dse.admPoint.subentryACI
                        .map((aci) => _encode_ACIItem(aci, DER)),
                    undefined,
                ));
            }

            (await readChildren(ctx, current, undefined, undefined, undefined, {
                subentry: true,
            }))
                .filter((sub) => sub.dse.subentry)
                .forEach((sub): void => {
                    subentryInfos.push(new SubentryInfo(
                        sub.dse.rdn,
                        getAttributesFromSubentry(sub),
                    ));
                });

            // The DIT context should only contain one CP.
            if (!contextPrefixEncountered && current.dse.cp) {
                accessPoints.push(
                    new MasterOrShadowAccessPoint(
                        ctx.dsa.accessPoint.ae_title,
                        ctx.dsa.accessPoint.address,
                        ctx.dsa.accessPoint.protocolInformation,
                        (!current.dse.shadow && !current.dse.cp.supplierKnowledge)
                            ? MasterOrShadowAccessPoint_category_master
                            : MasterOrShadowAccessPoint_category_shadow,
                        false,
                    ),
                );
                contextPrefixEncountered = true;
            }
        }

        contextPrefixInfo.push(new X500Vertex(
            current.dse.rdn,
            (admPointInfo.length > 0) ? admPointInfo : undefined,
            (subentryInfos.length > 0) ? subentryInfos : undefined,
            (accessPoints.length > 0) ? accessPoints : undefined,
        ))
        current = current.immediateSuperior;
    }
    return contextPrefixInfo.reverse();
}

export default getContextPrefixInfo;

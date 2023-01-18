import type { Context } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, TRUE_BIT } from "asn1-ts";
import { _encodeObjectIdentifier, DER } from "asn1-ts/dist/node/functional";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_requestedServiceNotAvailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    HierarchySelections,
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_siblings,
    HierarchySelections_self,
    HierarchySelections_subtree,
    HierarchySelections_top,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    serviceType,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/serviceType.oa";
import {
    hierarchySelectList,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/hierarchySelectList.oa";
import createSecurityParameters from "../x500/createSecurityParameters";

/**
 * @summary The Hierarchy Selection Procedure as defined in ITU Recommendation X.518.
 * @description
 *
 * The Hierarchy Selection Procedure (I) as defined in ITU Recommendation X.518
 * (2016), Section 19.3.2.2.10.
 *
 * Unimplemented. Meerkat DSA does not currently support hierarchy selections.
 * Throws a `serviceError`.
 *
 * @param ctx The context object
 * @param hierarchySelections The hierarchy selections
 * @param serviceControls_serviceType The service type
 *
 * @function
 * @throws {ServiceError} An error reporting that hierarchy selections are not supported.
 */
export
function hierarchySelectionProcedure (
    ctx: Context,
    hierarchySelections: HierarchySelections,
    serviceControls_serviceType?: OBJECT_IDENTIFIER,
    signErrors: boolean = false,
): void {
    if (
        (hierarchySelections[HierarchySelections_all] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_children] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_hierarchy] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_parent] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_siblingChildren] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_siblingSubtree] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_siblings] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_subtree] !== TRUE_BIT)
        && (hierarchySelections[HierarchySelections_top] !== TRUE_BIT)
    ) {
        return;
    }
    const notificationAttributes: Attribute[] = [
        new Attribute(
            hierarchySelectList["&id"]!,
            [
                hierarchySelectList.encoderFor["&Type"]!(hierarchySelections, DER),
            ],
            undefined,
        ),
    ];
    if (serviceControls_serviceType) {
        notificationAttributes.push(
            new Attribute(
                serviceType["&id"]!,
                [
                    _encodeObjectIdentifier(serviceControls_serviceType, DER),
                ],
                undefined,
            ),
        );
    }
    throw new errors.ServiceError(
        ctx.i18n.t("err:hierarchy_selections_not_supported"),
        new ServiceErrorData(
            ServiceProblem_requestedServiceNotAvailable,
            [],
            createSecurityParameters(ctx, signErrors),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            undefined,
            notificationAttributes,
        ),
        signErrors,
    );
}

export default hierarchySelectionProcedure;

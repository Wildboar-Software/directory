import { Context, Vertex, ClientAssociation, Value } from "@wildboar/meerkat-types";
import { bacACDF } from "@wildboar/x500";
import {
    SignedSecurityLabel,
    _decode_SignedSecurityLabel,
} from "@wildboar/x500/EnhancedSecurity";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { EvaluateFilterSettings } from "@wildboar/x500";
import { ProtectedItem, ACDFTupleExtended } from "@wildboar/x500";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import accessControlSchemesThatUseACIItems from "./accessControlSchemesThatUseACIItems.js";
import accessControlSchemesThatUseRBAC from "./accessControlSchemesThatUseRBAC.js";
import { rbacACDF } from "./rbacACDF.js";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/EnhancedSecurity";

const avslc = attributeValueSecurityLabelContext["&id"];

/**
 * @summary Access Control Decision Function - determine allow-or-deny
 * @description
 *
 * This function evaluates whether a user is authorized under a given access
 * control scheme to perform some operation on an object by virtue of having
 * the necessary permissions.
 *
 * @param ctx The context object
 * @param accessControlScheme The effective access control scheme
 * @param assn The client association, if any
 * @param target The target object for which authorization is being evaluated
 * @param permissions The permissions on the protected item being requested
 * @param tuples The basic access control tuples
 * @param requester The name of the entry making the request for authorization
 * @param request The protected item to which authorization is sought
 * @param settings The settings for evaluating a filter
 * @param tuplesAlreadySplit Whether the tuples were already split to allow and deny
 * @param addingEntry Whether this request is for adding an entry
 * @param rdnSecurityLabels The security labels (if any) associated with RDN values
 * @returns A boolean indicating whether access is granted
 *
 * @function
 */
export
function acdf (
    ctx: Context,
    accessControlScheme: OBJECT_IDENTIFIER,
    assn: ClientAssociation | undefined, // This has a clearance field.
    target: Vertex,
    permissions: number[],
    tuples: ACDFTupleExtended[],
    requester: NameAndOptionalUID | undefined | null,
    request: ProtectedItem,
    settings: EvaluateFilterSettings,
    tuplesAlreadySplit?: boolean,
    addingEntry: boolean = false,
    rdnSecurityLabels?: [ Value, SignedSecurityLabel[] ][],
): boolean {
    const acs = accessControlScheme.toString();
    if (accessControlSchemesThatUseACIItems.has(acs)) {
        const { authorized } = bacACDF(
            tuples,
            requester,
            request,
            permissions,
            settings,
            tuplesAlreadySplit,
        );
        if (!authorized) {
            return false;
        }
    }
    if (
        accessControlSchemesThatUseRBAC.has(acs)
        && assn
        && !addingEntry // RBAC basically has no effect on adding entries unless the superior is hidden.
        // TODO: Find DSE basically runs this same code twice. I want to find some optimization to avoid that.
        // && (permissions.length !== 1 || permissions[0] !== PERMISSION_CATEGORY_DISCLOSE_ON_ERROR)
    ) {
        if (
            ("value" in request)
            // RBAC only applies to values that have a context.
            && (request.contexts?.some((c) => c.contextType.isEqualTo(attributeValueSecurityLabelContext["&id"])))
        ) {
            const labelContext = request.contexts
                ?.find((c) => c.contextType.isEqualTo(avslc));
            if (labelContext?.contextValues.length) {
                // return true; // If there is no label, access is allowed.
                const label = _decode_SignedSecurityLabel(labelContext.contextValues[0]);
                const authorized: boolean = rbacACDF(
                    ctx,
                    assn,
                    target,
                    label,
                    request.value.type_,
                    request.value.value,
                    request.contexts ?? [],
                    permissions,
                );
                if (!authorized) {
                    return false;
                }
            }
        }
        else if (("entry" in request) && rdnSecurityLabels?.length) {
            for (const atav_and_labels of rdnSecurityLabels) {
                const [ atav, labels ] = atav_and_labels;
                for (const label of labels) {
                    const authorized: boolean = rbacACDF(
                        ctx,
                        assn,
                        target,
                        label,
                        atav.type,
                        atav.value,
                        atav.contexts ?? [],
                        permissions,
                    );
                    if (!authorized) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

import type { MeerkatContext } from "../ctx";
import { BERElement } from "asn1-ts";
import dnToVertex from "../dit/dnToVertex";
import getRelevantOperationalBindings from "./getRelevantOperationalBindings";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import isPrefix from "../x500/isPrefix";
import updateSubordinateDSA from "./updateSubordinateDSA";
import updateNonSpecificSubordinateDSA from "./updateNonSpecificSubordinateDSA";
import { strict as assert } from "assert";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import { _decode_NonSpecificHierarchicalAgreement } from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import { MasterOrShadowAccessPoint_category_master } from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import _ from "lodash";
import { _decode_MasterOrShadowAccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";

/**
 * @summary Update subordinate DSAs when entries that relate to an operational binding are created, modified, or deleted.
 * @description
 *
 * This function updates subordinate DSAs when entries that relate to an
 * operational binding are created, modified, or deleted.
 *
 * NOTE: In the future, this function could also be used to modify NHOBs, too.
 *
 * @param ctx The context object
 * @param affectedPrefix The distinguished name of the subtree of all entries
 *  affected by an operation.
 *
 * @function
 * @async
 */
export
async function updateAffectedSubordinateDSAs (
    ctx: MeerkatContext,
    affectedPrefix: DistinguishedName,
): Promise<void> {
    const activeHOBs = await getRelevantOperationalBindings(ctx, true);
    for (const hob of activeHOBs) {
        if (!hob.access_point) {
            continue;
        }
        if (
            (hob.binding_type === id_op_binding_non_specific_hierarchical.toString())
            && (hob.initiator === OperationalBindingInitiator.ROLE_B)
        ) { // Subordinates in an NHOB do not have to update the superior on entry changes.
            continue;
        }
        const argreementElement = new BERElement();
        argreementElement.fromBytes(hob.agreement_ber);
        if (hob.binding_type === id_op_binding_non_specific_hierarchical.toString()) {
            const agreement = _decode_NonSpecificHierarchicalAgreement(argreementElement);
            const immSuprDSE = await dnToVertex(ctx, ctx.dit.root, agreement.immediateSuperior);
            if (!immSuprDSE) {
                continue; // TODO: Is this the proper response?
            }
            if (!isPrefix(ctx, affectedPrefix, agreement.immediateSuperior)) {
                continue;
            }
            const aps = await ctx.db.accessPoint.findMany({
                where: {
                    category: MasterOrShadowAccessPoint_category_master,
                    active: true,
                    entry_id: immSuprDSE.dse.id,
                    knowledge_type: Knowledge.NON_SPECIFIC,
                },
                select: {
                    ber: true,
                    nsk_group: true,
                },
            });
            const nsk_groups = _.groupBy(aps, (n) => n.nsk_group);
            const nonSpecificKnowledge = Object.values(nsk_groups)
                .map((masaps) => masaps
                    .map((mosap) => {
                        const el = new BERElement();
                        el.fromBytes(mosap.ber);
                        return _decode_MasterOrShadowAccessPoint(el);
                    })
                    .filter((mosap) => ((mosap.category ?? MasterOrShadowAccessPoint_category_master) === MasterOrShadowAccessPoint_category_master)));
            for (const masters of nonSpecificKnowledge) {
                const master = masters[0];
                if (!master) {
                    continue;
                }
                const bindingID = new OperationalBindingID(
                    hob.binding_identifier,
                    hob.binding_version,
                );
                updateNonSpecificSubordinateDSA(
                    ctx,
                    bindingID,
                    immSuprDSE,
                    master,
                    undefined,
                    undefined,
                    undefined,
                )
                    .then((response) => {
                        if (!("result" in response)) {
                            ctx.log.warn(ctx.i18n.t("log:failed_to_update_nhob", {
                                obid: bindingID.identifier.toString(),
                                version: bindingID.version.toString(),
                                e: JSON.stringify(response),
                            }));
                        }
                    })
                    .catch((e) => {
                        ctx.log.warn(ctx.i18n.t("log:failed_to_update_nhob", {
                            obid: bindingID.identifier.toString(),
                            version: bindingID.version.toString(),
                            e: e.message,
                        }));
                    });
            }
        }
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
        if (!isPrefix(ctx, affectedPrefix, agreement.immediateSuperior)) {
            continue;
        }
        const bindingID = new OperationalBindingID(
            hob.binding_identifier,
            hob.binding_version,
        );
        const accessPointElement = new BERElement();
        accessPointElement.fromBytes(hob.access_point.ber);
        const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
        const subrDN: DistinguishedName = [
            ...agreement.immediateSuperior,
            agreement.rdn,
        ];
        try {
            const subr = await dnToVertex(ctx, ctx.dit.root, subrDN);
            if (!subr) {
                ctx.log.warn(ctx.i18n.t("log:subr_for_hob_not_found", {
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                }));
                continue;
            }
            assert(subr.immediateSuperior);
            // We do not await the return value. This can run independently
            // of returning from the operation.
            updateSubordinateDSA(
                ctx,
                bindingID,
                subr.immediateSuperior,
                undefined,
                subr.dse.rdn,
                accessPoint,
            )
                .then((response) => {
                    if (!("result" in response)) {
                        ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                            obid: bindingID.identifier.toString(),
                            version: bindingID.version.toString(),
                            e: JSON.stringify(response),
                        }));
                    }
                })
                .catch((e) => {
                    ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                        obid: bindingID.identifier.toString(),
                        version: bindingID.version.toString(),
                        e: e.message,
                    }));
                });
        } catch (e) {
            ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                obid: bindingID.identifier.toString(),
                version: bindingID.version.toString(),
                e: e.message,
            }));
            continue;
        }
    }
}

export default updateAffectedSubordinateDSAs;

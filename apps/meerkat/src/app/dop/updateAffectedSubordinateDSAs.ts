import type { MeerkatContext } from "../ctx.js";
import { BERElement } from "@wildboar/asn1";
import dnToVertex from "../dit/dnToVertex";
import getRelevantOperationalBindings from "./getRelevantOperationalBindings";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import isPrefix from "../x500/isPrefix";
import updateNHOBSubordinateDSA from "./updateNHOBSubordinateDSA";
import { OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { OperationalBindingInitiator } from "@prisma/client";
import { _decode_NonSpecificHierarchicalAgreement } from "@wildboar/x500/HierarchicalOperationalBindings";
import updateHOBSubordinateDSA from "./updateHOBSubordinateDSA";

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
 * @param newPrefix The distinguished name of the new prefix, if the prefix
 *  was changed.
 *
 * @function
 * @async
 */
export
async function updateAffectedSubordinateDSAs (
    ctx: MeerkatContext,
    affectedPrefix: DistinguishedName,
    newPrefix?: DistinguishedName,
): Promise<void> {
    const activeHOBs = await getRelevantOperationalBindings(ctx, true);
    for (const hob of activeHOBs) {
        if (!hob.access_point) {
            continue;
        }
        const i_am_superior: boolean = (
            ((hob.initiator === OperationalBindingInitiator.ROLE_A) && hob.outbound)
            || ((hob.initiator === OperationalBindingInitiator.ROLE_B) && !hob.outbound)
        );
        if (
            (hob.binding_type === id_op_binding_non_specific_hierarchical.toString())
            && !i_am_superior
        ) { // Subordinates in an NHOB do not have to update the superior on entry changes.
            continue;
        }
        const accessPointElement = new BERElement();
        accessPointElement.fromBytes(hob.access_point.ber);
        const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
        const argreementElement = new BERElement();
        argreementElement.fromBytes(hob.agreement_ber);
        const bindingID = new OperationalBindingID(
            hob.binding_identifier,
            hob.binding_version,
        );
        if (hob.binding_type === id_op_binding_non_specific_hierarchical.toString()) {
            const agreement = _decode_NonSpecificHierarchicalAgreement(argreementElement);
            if (!isPrefix(ctx, affectedPrefix, agreement.immediateSuperior)) {
                continue;
            }
            const newDN = newPrefix
                ? [
                    ...newPrefix,
                    ...agreement.immediateSuperior.slice(newPrefix.length),
                ]
                : agreement.immediateSuperior;
            const immSuprDSE = await dnToVertex(ctx, ctx.dit.root, newDN);
            if (!immSuprDSE) {
                ctx.log.warn(ctx.i18n.t("log:could_not_find_nssr", {
                    obid: hob.binding_identifier.toString(),
                }));
                continue; // TODO: Is this the proper response?
            }
            updateNHOBSubordinateDSA( // INTENTIONAL_NO_AWAIT
                ctx,
                hob.id,
                bindingID,
                immSuprDSE,
                accessPoint,
                undefined,
                undefined,
            )
                .catch((e) => {
                    ctx.log.warn(ctx.i18n.t("log:failed_to_update_nhob", {
                        obid: bindingID.identifier.toString(),
                        version: bindingID.version.toString(),
                        e: e.message,
                    }));
                });
            continue;
        }
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
        if (!isPrefix(ctx, affectedPrefix, agreement.immediateSuperior)) {
            continue;
        }
        const subrDN: DistinguishedName = [
            ...agreement.immediateSuperior,
            agreement.rdn,
        ];
        const subr = await dnToVertex(ctx, ctx.dit.root, subrDN);
        if (!subr) {
            ctx.log.warn(ctx.i18n.t("log:subr_for_hob_not_found", {
                obid: bindingID.identifier.toString(),
                version: bindingID.version.toString(),
            }));
            continue;
        }
        if (!subr.immediateSuperior) {
            // This should never happen.
            throw new Error("9f0dedf1-baf3-4383-8458-5ceff363140c");
        }
        // We do not await the return value. This can run independently
        // of returning from the operation.
        updateHOBSubordinateDSA( // INTENTIONAL_NO_AWAIT
            ctx,
            hob.id,
            bindingID,
            subr.immediateSuperior,
            subr.dse.rdn,
            accessPoint,
        )
            .catch((e) => {
                ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                    e: e.message,
                }));
            });
    }
}

export default updateAffectedSubordinateDSAs;

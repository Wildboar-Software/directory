import type { Context } from "@wildboar/meerkat-types";
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
import { strict as assert } from "assert";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

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
    ctx: Context,
    affectedPrefix: DistinguishedName,
): Promise<void> {
    const activeHOBs = await getRelevantOperationalBindings(ctx, true);
    for (const hob of activeHOBs) {
        if (!hob.access_point) {
            continue;
        }
        const argreementElement = new BERElement();
        argreementElement.fromBytes(hob.agreement_ber);
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

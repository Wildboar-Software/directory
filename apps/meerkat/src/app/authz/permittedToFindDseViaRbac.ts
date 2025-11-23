import type { ClientAssociation, Context, Vertex } from "@wildboar/meerkat-types";
import { ASN1Construction, BERElement, ObjectIdentifier } from "@wildboar/asn1";
import {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
} from "@wildboar/x500";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/EnhancedSecurity";
import getEqualityNormalizer from "../x500/getEqualityNormalizer";
import { rbacACDF } from "./rbacACDF";
import { _decode_SignedSecurityLabel } from "@wildboar/x500/EnhancedSecurity";

/**
 * @summary Whether a user is permitted to find a given DSE under RBAC.
 * @description
 *
 * Resolves a `boolean` indicating whether the user can discover a given DSE
 * based on Rule-Based Access Control (RBAC).
 *
 * This deviates from the technically correct X.500 procedures for rule based
 * access control, which require every value of the DSE to be checked to
 * determine whether a user can discover it. This could result in a virtually
 * unlimited number of ACDF calls to determine access, and it would require
 * reading every single value from the database for every entry. In addition
 * to this, the requirements around operational attributes are murky, since they
 * are not supposed to have context values.
 *
 * Meerkat DSA deviates by only checking access to the values of the RDN. If the
 * user is not permitted to any distinguished value of the RDN under RBAC,
 * access to the entry is denied.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param vertex The DIT vertex whose discoverability is to be determined.
 * @returns A `boolean` indicating whether the bound client may discover the DSE.
 *
 * @function
 * @async
 */
export
async function permittedToFindDseViaRbac (
    ctx: Context,
    assn: ClientAssociation,
    vertex: Vertex,
): Promise<boolean> {
    const getNormalizer = getEqualityNormalizer(ctx);
    const dvs = await ctx.db.attributeValue.findMany({
        where: {
            /**
             * This selection will technically over-match. For instance,
             * if the RDN is gn=Jonathan+sn=Wilbur, it will also return
             * values sn=Jonathan and gn=Wilbur. But this is a silly
             * edge case and it is more strict, so it is fine.
             */
            type_oid: {
                in: vertex.dse.rdn.map((atav) => atav.type_.toBytes()),
            },
            normalized_str: {
                in: vertex.dse.rdn.map((atav) => getNormalizer(atav.type_)?.(ctx, atav.value) ?? ""),
            },
        },
        select: {
            type_oid: true,
            tag_class: true,
            tag_number: true,
            constructed: true,
            content_octets: true,
            ContextValue: {
                where: {
                    type: attributeValueSecurityLabelContext["&id"].toString(),
                },
                select: {
                    ber: true,
                },
            },
        },
    });
    for (const dv of dvs) {
        if (dv.ContextValue.length === 0) {
            continue;
        }
        const value_el = new BERElement();
        value_el.tagClass = dv.tag_class;
        value_el.tagNumber = dv.tag_number;
        value_el.construction = dv.constructed
            ? ASN1Construction.constructed
            : ASN1Construction.primitive;
        value_el.value = dv.content_octets;

        const cval_el = new BERElement();
        cval_el.fromBytes(dv.ContextValue[0].ber);
        const label = _decode_SignedSecurityLabel(cval_el);
        const type = ObjectIdentifier.fromBytes(dv.type_oid);
        const authorized = rbacACDF(
            ctx,
            assn,
            vertex,
            label,
            type,
            value_el,
            [], // TODO: Document this discrepancy.
            [ PERMISSION_CATEGORY_BROWSE, PERMISSION_CATEGORY_RETURN_DN ],
        );
        if (!authorized) {
            return false;
        }
    }
    return true;
}

export default permittedToFindDseViaRbac;

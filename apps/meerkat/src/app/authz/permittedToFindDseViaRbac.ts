import type { ClientAssociation, Context, Vertex } from "../types/index.js";
import { ASN1Construction, BERElement, ObjectIdentifier } from "@wildboar/asn1";
import {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
} from "@wildboar/x500";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/EnhancedSecurity";
import getEqualityNormalizer from "../x500/getEqualityNormalizer.js";
import { rbacACDF } from "./rbacACDF.js";
import { _decode_SignedSecurityLabel } from "@wildboar/x500/EnhancedSecurity";
import { attributeValueFromDB } from "../database/attributeValueFromDB.js";
import stringifyDN from "../x500/stringifyDN.js";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import attributeFromDatabaseAttribute from "../database/attributeFromDatabaseAttribute.js";

const SEC_LABEL_CTX = attributeValueSecurityLabelContext["&id"].toString();

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
    const allValuesOfDistinguishedTypes = await ctx.db.attributeValue.findMany({
        where: {
            entry_id: vertex.dse.id,
            /**
             * This selection will technically over-match. For instance,
             * if the RDN is gn=Jonathan+sn=Wilbur, it will also return
             * values sn=Jonathan and gn=Wilbur. But this is a silly
             * edge case and it is more strict, so it is fine.
             */
            type_oid: {
                in: vertex.dse.rdn.map((atav) => atav.type_.toBytes()),
            },
        },
        select: {
            type_oid: true,
            tag_class: true,
            tag_number: true,
            constructed: true,
            content_octets: true,
            ContextValue: {
                select: {
                    type: true,
                    ber: true,
                    fallback: true,
                },
            },
        },
    });

    const hasSecurityLabels = allValuesOfDistinguishedTypes
        .some((v) => v.ContextValue.some((cv) => cv.type === SEC_LABEL_CTX));
    if (!hasSecurityLabels) {
        return true;
    }

    const rdnSet: Set<string> = new Set();
    for (const atav of vertex.dse.rdn) {
        const normalizer = getNormalizer(atav.type_);
        if (!normalizer) {
            continue;
        }
        const normalized = normalizer(ctx, atav.value);
        if (!normalized) {
            continue;
        }
        const key = `${atav.type_.toString()}=${normalized}`;
        rdnSet.add(key);
    }

    const dvs: typeof allValuesOfDistinguishedTypes = [];
    for (const v of allValuesOfDistinguishedTypes) {
        const attr_type = ObjectIdentifier.fromBytes(v.type_oid);
        const normalizer = getNormalizer(attr_type);
        if (!normalizer) {
            continue;
        }
        const el = attributeValueFromDB(v);
        const normalized = normalizer(ctx, el);
        if (!normalized) {
            continue;
        }
        const key = `${attr_type.toString()}=${normalized}`;
        if (rdnSet.has(key)) {
            dvs.push(v);
            rdnSet.delete(key);
        }
    }
    if (rdnSet.size > 0) {
        const dnstr = stringifyDN(ctx, getDistinguishedName(vertex));
        ctx.log.warn(ctx.i18n.t("log:rdn_has_values_entry_does_not", {
            dn: dnstr,
            uuid: vertex.dse.uuid,
        }), {
            association_id: assn.id,
            dse_id: vertex.dse.id,
            dse_uuid: vertex.dse.uuid,
            entry_uuid: vertex.dse.entryUUID,
            dse_dn: dnstr,
            unmatchedRDNs: rdnSet.size,
            rdnsLength: vertex.dse.rdn.length,
        });
        // We return "false" because we could not relate attribute values to
        // the distinguished ones stored in the database.
        return false;
    }

    // All of the above code is basically just to get the `AttributeValue`s that
    // correspond to the `DistinguishedValue`s.
    for (const dv of dvs) {
        const sec_label_ctx = dv.ContextValue
            .find((cv) => cv.type.toString() === SEC_LABEL_CTX);
        if (!sec_label_ctx) {
            continue;
        }

        const v = attributeFromDatabaseAttribute(ctx, dv);
        const cval_el = new BERElement();
        cval_el.fromBytes(sec_label_ctx.ber);
        const label = _decode_SignedSecurityLabel(cval_el);
        const type = ObjectIdentifier.fromBytes(dv.type_oid);
        const authorized = rbacACDF(
            ctx,
            assn,
            vertex,
            label,
            type,
            v.value,
            v.contexts ?? [],
            [ PERMISSION_CATEGORY_BROWSE, PERMISSION_CATEGORY_RETURN_DN ],
        );
        if (!authorized) {
            return false;
        }
    }
    return true;
}

export default permittedToFindDseViaRbac;

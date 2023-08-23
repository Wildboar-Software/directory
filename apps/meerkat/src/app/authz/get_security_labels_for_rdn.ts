import { Context, MistypedArgumentError, Value } from "@wildboar/meerkat-types";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/src/lib/collections/contexts";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import {
    SignedSecurityLabel, _decode_SignedSecurityLabel,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SignedSecurityLabel.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import { groupByOID } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { BERElement, ObjectIdentifier } from "asn1-ts";

const AVSLC: string = attributeValueSecurityLabelContext["&id"].toString();

/**
 * @summary Get the security labels associated with the RDN values
 * @description
 *
 * This function gets the security labels associated with the distinguished
 * attribute values of the relative distinguished name. This is for Meerkat DSA
 * to evaluate the ability to discover an entry under Rule-Based Access Control
 * (RBAC).
 *
 * @param ctx The context object
 * @param rdn The RDN whose security labels are to be returned
 * @returns The attribute types and values along with security labels, if any
 *
 * @async
 * @function
 */
export
async function get_security_labels_for_rdn (
    ctx: Context,
    rdn: RelativeDistinguishedName,
): Promise<[ Value, SignedSecurityLabel[] ][]> {
    const rdnValuesWithContexts = await ctx.db.attributeValue.findMany({
        where: {
            type_oid: {
                in: rdn.map((atav) => atav.type_.toBytes()),
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
                    tag_class: true,
                    tag_number: true,
                    constructed: true,
                    ber: true,
                    fallback: true,
                },
            },
        },
    });
    const atavsByType = groupByOID(rdn, (atav) => atav.type_);
    const namingMatcher = getNamingMatcherGetter(ctx);
    const ret: [ Value, SignedSecurityLabel[] ][] = [];
    for (const dbval of rdnValuesWithContexts) {
        if (dbval.ContextValue.length === 0) {
            continue;
        }
        const secLabelContexts = dbval.ContextValue.filter((cv) => (cv.type === AVSLC));
        if (secLabelContexts.length === 0) {
            continue;
        }
        const type = ObjectIdentifier.fromBytes(dbval.type_oid);
        const type_str = type.toString();
        const value = attributeValueFromDB(dbval);
        const atavs = atavsByType[type_str];
        if (atavs.length > 1) {
            throw new MistypedArgumentError();
        }
        const atav = atavs[0];
        if (atav && namingMatcher(type)?.(value, atav.value)) {
            // If this value is the one that's in the RDN, we return it with
            // its security labels.
            const labels = secLabelContexts.map((c) => {
                const el = new BERElement();
                el.fromBytes(c.ber);
                return _decode_SignedSecurityLabel(el);
            });
            const groupedContexts = groupByOID(dbval.ContextValue, (c) => c.type);
            const contexts = Object.entries(groupedContexts).map(([ type_str, c ]) => {
                return new X500Context(
                    ObjectIdentifier.fromString(type_str),
                    c.map((cv) => {
                        const el = new BERElement();
                        el.fromBytes(cv.ber);
                        return el;
                    }),
                    c[0]?.fallback,
                );
            });
            ret.push([ {
                type: atav.type_,
                value: atav.value,
                contexts,
            }, labels ]);
            delete atavsByType[type_str];
        }
    }
    return ret;
}

export default get_security_labels_for_rdn;

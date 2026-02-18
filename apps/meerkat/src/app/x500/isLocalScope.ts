import {
    countryCode3c,
    countryCode3n,
    countryName,
    organizationName,
    dmdName,
} from "@wildboar/x500/SelectedAttributeTypes";
import type { Name, DistinguishedName } from "@wildboar/pki-stub";
import type { Context } from "../types/index.js";
import { compare } from "@wildboar/iso3166";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "./getNamingMatcherGetter.js";

/**
 * @summary Determine whether two distinguished names are within the same country
 * @description
 *
 * The `ServiceControlOptions` defined in ITU-T Recommendation X.511, Section
 * 7.5, defines a `localScope` option that prevents distributed operations from
 * propagating outside of a defined "local scope," the precise meaning of which
 * is left up to the implementation.
 *
 * In Meerkat DSA, "local scope" exclusively means a country. The rationale for
 * this is usefulness: when data crosses national boundaries, there can be legal
 * concerns or national security concerns that do not apply otherwise. Some
 * countries have cryptography export laws. Smaller scopes simply tend not to
 * matter as much.
 *
 * Further, within the scope of a country (or even smaller
 * polity), things like organization names or DMD names can get re-used, so
 * comparing two directory names for merely having the same organization name or
 * DMD name is not great for concluding that these names fall within the same
 * local scope. Only the country is an objective, unambiguous fact.
 *
 * This implementation only compares the first RDN of the directory names,
 * because (1) it is generally expected that the country will be a top-level
 * entry in the directory and (2) an RDN with a country-related attribute value
 * deeper in the directory might not itself refer to a country; it could refer
 * to something else, like a relationship between countries or it could be part
 * of a mailing address. For example, `c=US` is definitely the United States,
 * but `o=Oracle,cn=Customers,c=US` might describe Oracle Corporation's United
 * States-based customers, but Oracle itself might be based out of a different
 * country.
 *
 * It is not a requirement that the country-related attribute type be the only
 * attribute type in the first RDN. This is to accommodate strange top-level
 * directory naming, such as things like `c=US+o=Microsoft`.
 *
 * This implementation uses the `countryName`, `countryCode3c`, and
 * `countryCode3n` attributes for identifying countries, and it translates
 * between them.
 *
 * This implementation does not handle ccTLDs used in `domainComponent` values.
 * The reason for this is that a lot of ccTLDs do not require residency or do
 * not verify residency; further, domain hacks are widespread in practice, so
 * a domain like watch.tv would be considered "local" to Tuvalu mistakenly. If
 * not for the widespread use of domain hacks--if the ccTLD reliably reflected
 * the true country--this would be different.
 *
 * If any error is thrown internally, this function just returns `false`.
 *
 * @param dn1 The first distinguished name
 * @param dn2 The second distinguished name
 * @returns {Boolean} `true` if they fall within the same "local scope," and `false` otherwise
 *
 * @function
 */
export function isSameCountry(dn1: Name, dn2: Name): boolean {
    try {
        if (!dn1.rdnSequence.length || !dn2.rdnSequence.length) {
            return false;
        }
        const rdn1 = dn1.rdnSequence[0];
        const rdn2 = dn2.rdnSequence[0];

        let c_1: string | undefined;
        let c3_1: string | undefined;
        let n3_1: string | undefined;
        for (const atav of rdn1) {
            if (!c_1 && atav.type_.isEqualTo(countryName["&id"])) {
                c_1 = countryName.decoderFor["&Type"]!(atav.value);
            }
            if (!c3_1 && atav.type_.isEqualTo(countryCode3c["&id"])) {
                c3_1 = countryCode3c.decoderFor["&Type"]!(atav.value);
            }
            if (!n3_1 && atav.type_.isEqualTo(countryCode3n["&id"])) {
                n3_1 = countryCode3n.decoderFor["&Type"]!(atav.value);
            }
        }

        let c_2: string | undefined;
        let c3_2: string | undefined;
        let n3_2: string | undefined;
        for (const atav of rdn2) {
            if (!c_2 && atav.type_.isEqualTo(countryName["&id"])) {
                c_2 = countryName.decoderFor["&Type"]!(atav.value);
            }
            if (!c3_2 && atav.type_.isEqualTo(countryCode3c["&id"])) {
                c3_2 = countryCode3c.decoderFor["&Type"]!(atav.value);
            }
            if (!n3_2 && atav.type_.isEqualTo(countryCode3n["&id"])) {
                n3_2 = countryCode3n.decoderFor["&Type"]!(atav.value);
            }
        }

        const iso3166_1 = c_1 || c3_1 || n3_1 || "?1";
        const iso3166_2 = c_2 || c3_2 || n3_2 || "?2";
        return compare(iso3166_1, iso3166_2);
    } catch {
        return false;
    }
}

/**
 * @summary Pop RDNs from the end of a DN until the last RDN is an organization or DMD
 * @description
 *
 * This function modifies `dn` in place.
 *
 * @param dn The distinguished name to trim
 * @function
 */
function trimDNToScope(dn: DistinguishedName): void {
    while (dn.length) {
        const lastRDN = dn[dn.length - 1];
        const isScopeRDN = lastRDN.some((atav) => (
            atav.type_.isEqualTo(organizationName["&id"])
            || atav.type_.isEqualTo(dmdName["&id"])
        ));
        if (isScopeRDN) {
            break;
        }
        dn.pop();
    }
}

/**
 * @summary Determine whether two distinguished names are within the same country
 * @description
 *
 * The `ServiceControlOptions` defined in ITU-T Recommendation X.511, Section
 * 7.5, defines a `localScope` option that prevents distributed operations from
 * propagating outside of a defined "local scope," the precise meaning of which
 * is left up to the implementation.
 *
 * In Meerkat DSA, "local scope" means the same organization or DMD or country
 * depending on the Application Entity (AE) title of the correspondent DSAs.
 * More precisely, the algorithm starts from the next-to-last RDN in the DN of
 * each AE title and removes RDNs from the end until an RDN contains either
 * the `organizationName` or `dmdName` attributes, then the resulting
 * distinguished name prefixes are compared; if no such RDN is found, the
 * country is considered the "local scope" and comparison proceeds as described
 * below.
 *
 * When comparing countries, this implementation only compares the first RDN of
 * the directory names, because (1) it is generally expected that the country
 * will be a top-level entry in the directory and (2) an RDN with a
 * country-related attribute value deeper in the directory might not itself
 * refer to a country; it could refer to something else, like a relationship
 * between countries or it could be part of a mailing address. For example,
 * `c=US` is definitely the United States, but `o=Oracle,cn=Customers,c=US`
 * might describe Oracle Corporation's United States-based customers, but Oracle
 * itself might be based out of a different country.
 *
 * It is not a requirement that the country-related attribute type be the only
 * attribute type in the first RDN. This is to accommodate strange top-level
 * directory naming, such as things like `c=US+o=Microsoft`.
 *
 * This implementation uses the `countryName`, `countryCode3c`, and
 * `countryCode3n` attributes for identifying countries, and it translates
 * between them.
 *
 * This implementation does not handle ccTLDs used in `domainComponent` values.
 * The reason for this is that a lot of ccTLDs do not require residency or do
 * not verify residency; further, domain hacks are widespread in practice, so
 * a domain like watch.tv would be considered "local" to Tuvalu mistakenly. If
 * not for the widespread use of domain hacks--if the ccTLD reliably reflected
 * the true country--this would be different.
 *
 * If any error is thrown internally, this function just returns `false`.
 *
 * @param ctx The context object
 * @param dn1 The first distinguished name
 * @param dn2 The second distinguished name
 * @returns {Boolean} `true` if they fall within the same "local scope," and `false` otherwise
 *
 * @function
 */
export function isLocalScope(
    ctx: Context,
    dn1: Name,
    dn2: Name,
): boolean {
    const prefixdn1 = [ ...dn1.rdnSequence.slice(0, -1) ];
    const prefixdn2 = [ ...dn2.rdnSequence.slice(0, -1) ];
    if (!prefixdn1.length || !prefixdn2.length) {
        return false;
    }
    trimDNToScope(prefixdn1);
    trimDNToScope(prefixdn2);

    if (prefixdn1.length !== prefixdn2.length) {
        return false;
    }

    if (prefixdn1.length === 0) {
        // We didn't find organizationName or dmdName in either DN. Now all we
        // can do is try to compare countries.
        return isSameCountry(dn1, dn2);
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    return compareDistinguishedName(prefixdn1, prefixdn2, namingMatcher);
}

export default isLocalScope;

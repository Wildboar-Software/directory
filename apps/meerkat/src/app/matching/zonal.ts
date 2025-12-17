import type { Context } from "../types/index.js";
import { DER } from "@wildboar/asn1/functional";
import { directoryStringToString } from "@wildboar/x500";
import type {
    Filter,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FilterItem,
} from "@wildboar/x500/DirectoryAbstractService";
import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/InformationFramework";
import {
    countryCode3c,
    countryCode3n,
    countryName,
    localityName,
    postalCode,
    stateOrProvinceName,
} from "@wildboar/x500/SelectedAttributeTypes";
import getAttributeParentTypes from "../x500/getAttributeParentTypes.js";
import {
    ZonalResult, ZonalResult_cannot_select_mapping,
} from "@wildboar/x500/SelectedAttributeTypes";

interface PostalZoneMatchProperties {
    c2c: string;
    c3c: string;
    c3n: number;
    st: string;
    locality: string;
    postal_codes?: string[];
    unmappable: boolean; // This can happen if there are multiple country names, states, etc.
}

// postalZonalMatch ZONAL-MATCHING ::= {
//     SELECT BY           { id-at-countryName | id-at-stateOrProvinceName | id-at-localityName }
//     APPLICABLE TO       { localityName }
//     SUBTYPES INCLUDED   TRUE
//     COMBINABLE          TRUE
//     USER CONTROL        TRUE
//     EXCLUSIVE           TRUE
//     MATCHING RULE       zonalMatch.&id
//     ID                  id-zmr-postalZonalMatch
// }
async function extract_zone_info (
    ctx: Context,
    info_from_target_dn: Partial<PostalZoneMatchProperties>,
    item: FilterItem,
    postal: Partial<PostalZoneMatchProperties> = {},
    level: number,
    exclusive: boolean,
): Promise<ZonalResult | null> {
    if ("equality" in item) {
        if (item.equality.type_.isEqualTo(countryName["&id"])) {
            if (postal.c2c) {
                postal.unmappable = true;
                return ZonalResult_cannot_select_mapping;
            }
            postal.c2c = item.equality.assertion.printableString;
        }
        else if (item.equality.type_.isEqualTo(countryCode3c["&id"])) {
            if (postal.c3c) {
                postal.unmappable = true;
                return ZonalResult_cannot_select_mapping;
            }
            postal.c3c = item.equality.assertion.printableString;
            // TODO: Use this to lookup the correct 2-character code
        }
        else if (item.equality.type_.isEqualTo(countryCode3n["&id"])) {
            if (postal.c3n) {
                postal.unmappable = true;
                return ZonalResult_cannot_select_mapping;
            }
            postal.c3n = Number.parseInt(item.equality.assertion.numericString, 10);
            // TODO: Use this to lookup the correct 2-character code
        }
        else if (item.equality.type_.isEqualTo(stateOrProvinceName["&id"])) {
            if (postal.st) {
                postal.unmappable = true;
                return ZonalResult_cannot_select_mapping;
            }
            postal.st = directoryStringToString(item.equality.assertion);
        }
        else if (item.equality.type_.isEqualTo(localityName["&id"])) {
            if (postal.locality) {
                postal.unmappable = true;
                return ZonalResult_cannot_select_mapping;
            }
            postal.locality = directoryStringToString(item.equality.assertion);
        }
        else if (item.equality.type_.isEqualTo(postalCode["&id"])) {
            // If postal code is already present, we don't want to map to more unrelated postal codes.
            postal.unmappable = true;
        }

        const enough_information: boolean = !!(
            (info_from_target_dn.c2c || postal.c2c)
            && (info_from_target_dn.st || postal.st)
            && postal.locality
        );
        if (!postal.postal_codes && enough_information && !postal.unmappable) {
            const pc_rows = await ctx.db.postalCodesGazetteEntry.findMany({
                where: {
                    c2c: info_from_target_dn.c2c || postal.c2c,
                    st: info_from_target_dn.st || postal.st,
                    locality: postal.locality,
                },
                select: {
                    id: true,
                    postal_code: true,
                },
            });
            const postal_codes = pc_rows.map((r) => r.postal_code);
            if (level <= 0) { // This mapping-based-matching does not support tightening.
                postal.postal_codes = postal_codes;
            } else {
                // -- Translates C,ST,L to postal codes
                // -- Get diagonal length of region (D)
                // -- Radius (R) is D / 2
                // -- Extended area = X
                // -- Find all postal codes within D + ... + (D / X-1) + (D / X)
                const bp_rows = await ctx.db.postalCodeBoundaryPoints.findMany({
                    where: {
                        postal_code_id: {
                            in: pc_rows.map((r) => r.id),
                        },
                    },
                    select: {
                        northing: true,
                        easting: true,
                    },
                    orderBy: [
                        {
                            northing: "asc",
                        },
                    ],
                });
                if (bp_rows.length <= 2) {
                    postal.postal_codes = postal_codes;
                    return null;
                }
                const sorted_by_easting_asc = [ ...bp_rows ].sort((a, b) => a.easting - b.easting);
                const southest = bp_rows[0];
                const northest = bp_rows[bp_rows.length - 1];
                const eastest = sorted_by_easting_asc[0];
                const westest = sorted_by_easting_asc[sorted_by_easting_asc.length - 1];
                const diag_len = Math.sqrt(
                    Math.pow((northest.northing - southest.northing), 2)
                    + Math.pow((eastest.easting - westest.easting), 2)
                );
                const radius0 = Math.floor(diag_len / 2);
                let radius: number = radius0;
                let prev_radius: number = radius0;

                for (let i = 1; i <= level; i++) {
                    prev_radius = radius;
                    radius += Math.round(radius0 / i);
                }

                const northern_bound = northest.northing + radius;
                const southern_bound = southest.northing - radius;
                const eastern_bound = eastest.easting + radius;
                const western_bound = westest.easting - radius;
                const selection_rows = await ctx.db.postalCodesGazetteEntry.findMany({
                    where: {
                        c2c: postal.c2c,
                        PostalCodeBoundaryPoints: {
                            some: {
                                AND: [
                                    {
                                        northing: {
                                            gte: southern_bound,
                                        },
                                    },
                                    {
                                        northing: {
                                            lte: northern_bound,
                                        },
                                    },
                                    {
                                        easting: {
                                            gte: western_bound,
                                        },
                                    },
                                    {
                                        easting: {
                                            lte: eastern_bound,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    select: {
                        postal_code: true,
                    },
                });
                if (!exclusive) {
                    postal.postal_codes = selection_rows.map((r) => r.postal_code);
                    return null;
                }
                const selections: Set<string> = new Set(selection_rows.map((r) => r.postal_code));
                const inner_northern_bound = northest.northing + prev_radius;
                const inner_southern_bound = southest.northing - prev_radius;
                const inner_eastern_bound = eastest.easting + prev_radius;
                const inner_western_bound = westest.easting - prev_radius;
                const exclusion_rows = await ctx.db.postalCodesGazetteEntry.findMany({
                    where: {
                        c2c: postal.c2c,
                        PostalCodeBoundaryPoints: {
                            some: {
                                AND: [
                                    {
                                        northing: {
                                            gte: inner_southern_bound,
                                        },
                                    },
                                    {
                                        northing: {
                                            lte: inner_northern_bound,
                                        },
                                    },
                                    {
                                        easting: {
                                            gte: inner_western_bound,
                                        },
                                    },
                                    {
                                        easting: {
                                            lte: inner_eastern_bound,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    select: {
                        postal_code: true,
                    },
                });
                for (const ex of exclusion_rows) {
                    selections.delete(ex.postal_code);
                }
                postal.postal_codes = Array.from(selections.values());
            }
        }
    }
    return null;
}

function replace_with_postal_codes (
    ctx: Context,
    filter: Filter,
    postal_codes: string[],
): Filter {
    if (!postal_codes.length) {
        return filter;
    }
    if ("item" in filter) {
        if ("equality" in filter.item) {
            for (const supertype of getAttributeParentTypes(ctx, filter.item.equality.type_)) {
                if (supertype.isEqualTo(localityName["&id"])) {
                    return {
                        or: postal_codes.map((pc): Filter => ({
                            item: {
                                equality: new AttributeValueAssertion(
                                    postalCode["&id"],
                                    postalCode.encoderFor["&Type"]!({ uTF8String: pc }, DER),
                                ),
                            },
                        })),
                    };
                }
            }
            if (filter.item.equality.type_.isEqualTo(stateOrProvinceName["&id"])) {
                return {
                    and: [], // This will always match.
                };
            }
            if (filter.item.equality.type_.isEqualTo(countryName["&id"])) {
                return {
                    and: [], // This will always match.
                };
            }
        }
    }
    else if ("and" in filter) {
        return {
            and: filter.and.map((sub) => replace_with_postal_codes(ctx, sub, postal_codes)),
        };
    }
    return filter;
}

async function zonal_map_filter (
    ctx: Context,
    info_from_target_dn: Partial<PostalZoneMatchProperties>,
    filter: Filter,
    postal: Partial<PostalZoneMatchProperties>,
    negated: boolean,
    level: number,
    exclusive: boolean,
): Promise<[ZonalResult | null, Filter]> {
    if (!negated && "item" in filter) {
        const result = await extract_zone_info(ctx, info_from_target_dn, filter.item, postal, level, exclusive);
        return [result, filter];
    } else if (!negated && "and" in filter) {
        const new_subfilters: Filter[] = [];
        for (const sub of filter.and) {
            const [ zr, new_sub ] = await zonal_map_filter(ctx, info_from_target_dn, sub, postal, negated, level, exclusive);
            if (zr !== null) {
                return [zr, filter];
            }
            new_subfilters.push(new_sub);
        }
        if (!postal.unmappable && postal.postal_codes?.length) {
            const replaced_filter = replace_with_postal_codes(ctx, filter, postal.postal_codes);
            return [null, replaced_filter];
        }
        return [null, { and: new_subfilters }];
    } else if (!negated && "or" in filter) {
        const new_subfilters: Filter[] = [];
        for (const sub of filter.or) {
            const [ zr, new_sub ] = await zonal_map_filter(ctx, info_from_target_dn, sub, postal, negated, level, exclusive);
            if (zr !== null) {
                if (zr === ZonalResult_cannot_select_mapping) {
                    // DEVIATION: This is supposed to result in an UNDEFINED
                    // result for the subfilter, but instead, we just return the
                    // original filter. We do not exit with an error, so the
                    // other subfilters at least have a chance to match.
                    return [null, filter];
                }
                return [zr, filter];
            }
            new_subfilters.push(new_sub);
        }
        return [null, { or: new_subfilters }];
    } else if ("not" in filter) {
        const [zr, new_sub] = await zonal_map_filter(ctx, info_from_target_dn, filter.not, {}, !negated, level, exclusive);
        return [zr, { not: new_sub }];
    } else {
        return [null, filter];
    }
}

function getPostalPropertiesFromDN (dn: DistinguishedName): Partial<PostalZoneMatchProperties> {
    let c: string | undefined;
    let st: string | undefined;
    for (const rdn of [ ...dn ].reverse()) { // Reverse so we give overwriting priority to "higher" RDNs.
        for (const atav of rdn) {
            if (atav.type_.isEqualTo(countryName["&id"])) {
                c = atav.value.printableString;
            }
            else if (atav.type_.isEqualTo(stateOrProvinceName["&id"])) {
                st = directoryStringToString(atav.value);
            }
        }
    }
    return {
        c2c: c,
        st,
    };
}

// NOTE: This implementation cannot return `multiple-mappings`, so there is no
// need to handle `multipleMatchingLocalities`.
export async function mapFilterForPostalZonalMatch (
    ctx: Context,
    target_object: DistinguishedName,
    filter: Filter,
    level: number,
    exclusive: boolean,
): Promise<[ZonalResult | null, Filter]> {
    return zonal_map_filter(
        ctx,
        getPostalPropertiesFromDN(target_object),
        filter,
        {},
        false,
        Math.max(Math.min(level, 0), 10), // Negative not supported.
        exclusive,
    );
}

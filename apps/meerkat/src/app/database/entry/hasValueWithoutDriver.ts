import type {
    AttributeInfo,
    Context,
    Value,
} from "../../types/index.js";
import { directoryStringToString, prepString } from "@wildboar/x500";
import {
    _decode_UnboundedDirectoryString,
    caseExactIA5Match,
    caseExactMatch,
    caseIgnoreIA5Match,
    caseIgnoreMatch,
    numericStringMatch,
    telephoneNumberMatch
} from "@wildboar/x500/SelectedAttributeTypes";
import { ASN1Construction } from "@wildboar/asn1";
import {
    numericStringMatch as numericStringMatchNormalizer,
} from "../../matching/normalizers.js";

/**
 * @summary A default hasValue() function for attribute types without a driver
 * @description
 *
 * Because this function is invoked in a loop for each value, we cannot perform
 * any multi-valued queries or do anything in a loop: this would result in
 * O(n^2) performance, which could produce denial-of-service (quite easily, in
 * fact). As such, this implementation just compares the values in the database
 * with the asserted value
 *
 * @param ctx The context object
 * @param entry_id The database ID of the entry that is to be checked
 * @param value The value whose existence is to be checked
 * @param attrSpec The attribute type information
 * @returns A boolean indicating whether the entry has the inquired value
 *
 * @function
 * @async
 */
export
async function hasValueWithoutDriver (
    ctx: Context,
    entry_id: number,
    value: Value,
    attrSpec?: AttributeInfo,
): Promise<boolean> {
    const emr = attrSpec?.equalityMatchingRule;
    if (!emr) {
        // If no EMR is defined for the type, uniqueness is not checked.
        return false;
    }
    const typestr = value.type.toBytes();
    if (
        emr.isEqualTo(caseIgnoreMatch["&id"])
        || emr.isEqualTo(caseIgnoreIA5Match["&id"])
    ) {
        const ds = _decode_UnboundedDirectoryString(value.value);
        const s = directoryStringToString(ds);
        const ps = prepString(s) ?? s;
        const result = await ctx.db.$queryRaw<{ id: number }[]>`
            SELECT id
            FROM AttributeValue
            WHERE
                entry_id = ${entry_id}
                AND type_oid = ${typestr}
                AND constructed = FALSE
                AND UPPER(TRIM(content_octets)) = UPPER(${ps})
        `;
        return !!result[0];
    }
    if (
        emr.isEqualTo(caseExactMatch["&id"])
        || emr.isEqualTo(caseExactIA5Match["&id"])
    ) {
        const ds = _decode_UnboundedDirectoryString(value.value);
        const s = directoryStringToString(ds);
        const ps = prepString(s) ?? s;
        const result = await ctx.db.$queryRaw<{ id: number }[]>`
            SELECT id
            FROM AttributeValue
            WHERE
                entry_id = ${entry_id}
                AND type_oid = ${typestr}
                AND constructed = FALSE
                AND TRIM(content_octets) = ${ps}
        `;
        return !!result[0];
    }
    if (emr.isEqualTo(numericStringMatch["&id"])) {
        const ns = numericStringMatchNormalizer(ctx, value.value);
        const result = await ctx.db.$queryRaw<{ id: number }[]>`
            SELECT id
            FROM AttributeValue
            WHERE
                entry_id = ${entry_id}
                AND type_oid = ${typestr}
                AND tag_class = ${value.value.tagClass}
                AND constructed = FALSE
                AND tag_number = ${value.value.tagNumber}
                AND REPLACE(TRIM(content_octets), ' ', '') = ${ns}
        `;
        return !!result[0];
    }
    if (emr.isEqualTo(telephoneNumberMatch["&id"])) {
        const s = value.value.printableString;
        const result = await ctx.db.$queryRaw<{ id: number }[]>`
            SELECT id
            FROM AttributeValue
            WHERE
                entry_id = ${entry_id}
                AND type_oid = ${typestr}
                AND tag_class = ${value.value.tagClass}
                AND constructed = FALSE
                AND tag_number = ${value.value.tagNumber}
                AND REPLACE(TRIM(content_octets), '-', ' ') = REPLACE(TRIM(${s}), '-', ' ')
        `;
        return !!result[0];
    }
    // If none of the above matching rules are used, we compare byte-for-byte.
    const constructed = (value.value.construction === ASN1Construction.constructed);
    const result = await ctx.db.$queryRaw<{ id: number }[]>`
        SELECT id
        FROM AttributeValue
        WHERE
            entry_id = ${entry_id}
            AND type_oid = ${typestr}
            AND tag_class = ${value.value.tagClass}
            AND constructed = ${constructed}
            AND tag_number = ${value.value.tagNumber}
            AND content_octets = ${value.value.value}
    `;
    return !!result[0];
}

export default hasValueWithoutDriver;

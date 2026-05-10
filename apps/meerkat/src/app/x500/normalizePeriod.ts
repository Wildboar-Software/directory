import type { OPTIONAL } from "@wildboar/asn1";
import {
    Period,
    type Period_days,
    type Period_weeks,
    type Period_months,
} from "@wildboar/x500/SelectedAttributeTypes";

// TODO: Export to @wildboar/x500?
/**
 * @summary Normalize `Period` so the DER encoding can be compared for equality
 * @description
 * 
 * This function normalizes a `Period` so that two `Period`s that are
 * functionally equivalent will have the same DER encoding. This allows for an
 * efficient many-to-many comparison of `Period`s.
 * 
 * To do this, it converts `BIT STRING` values to the equivalent
 * `SET OF INTEGER` values. It is done this way rather than the other way
 * around because not all `SET OF INTEGER` values have `BIT STRING`
 * equivalents. For example, if `weeks` refers to weeks-in-a-year, a valid
 * `INTEGER` value can be 52, but there is no valid `BIT STRING` bit for
 * that.
 * 
 * ### ASN.1 Reference:
 * 
 * ```asn1
 * Period ::= SEQUENCE {
 *   timesOfDay  [0]  SET SIZE (1..MAX) OF DayTimeBand OPTIONAL,
 *   days        [1]  CHOICE {
 *     intDay           SET OF INTEGER,
 *     bitDay           BIT STRING {
 *       sunday    (0),
 *       monday    (1),
 *       tuesday   (2),
 *       wednesday (3),
 *       thursday  (4),
 *       friday    (5),
 *       saturday  (6)},
 *     dayOf            XDayOf,
 *     ...} OPTIONAL,
 *   weeks       [2]  CHOICE {
 *     allWeeks         NULL,
 *     intWeek          SET OF INTEGER,
 *     bitWeek          BIT STRING {
 *       week1     (0),
 *       week2     (1),
 *       week3     (2),
 *       week4     (3),
 *       week5     (4)},
 *     ... } OPTIONAL,
 *   months      [3]  CHOICE {
 *     allMonths        NULL,
 *     intMonth         SET OF INTEGER,
 *     bitMonth         BIT STRING {
 *       january   (0),
 *       february  (1),
 *       march     (2),
 *       april     (3),
 *       may       (4),
 *       june      (5),
 *       july      (6),
 *       august    (7),
 *       september (8),
 *       october   (9),
 *       november  (10),
 *       december  (11)},
 *     ...} OPTIONAL,
 *   years       [4]  SET OF INTEGER(1000..MAX) OPTIONAL,
 *   ... }
 * ```
 * 
 * @param p - The `Period` to normalize.
 * @returns The normalized `Period`.
 * 
 * @function
 */
export function normalizePeriod(p: Period): Period {
    let days: OPTIONAL<Period_days> = undefined;
    let weeks: OPTIONAL<Period_weeks> = undefined;
    let months: OPTIONAL<Period_months> = undefined;
    if (p.days) {
        if ("bitDay" in p.days) {
            const intDay = Array.from(p.days.bitDay.values())
                .map((b, i) => b ? (i + 1) : undefined)
                .filter((b) => b !== undefined);
            days = { intDay };
        } else {
            days = p.days;
        }
    }
    if (p.weeks) {
        if ("bitWeek" in p.weeks) {
            const intWeek = Array.from(p.weeks.bitWeek.values())
                .map((b, i) => b ? (i + 1) : undefined)
                .filter((b) => b !== undefined);
            weeks = { intWeek };
        } else {
            weeks = p.weeks;
        }
    }
    if (p.months) {
        if ("bitMonth" in p.months) {
            const intMonth = Array.from(p.months.bitMonth.values())
                .map((b, i) => b ? (i + 1) : undefined)
                .filter((b) => b !== undefined);
            months = { intMonth };
        } else {
            months = p.months;
        }
    }
    return new Period(
        p.timesOfDay,
        days,
        weeks,
        months,
        p.years,
    );
}
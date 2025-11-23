import type {
    Time,
} from "@wildboar/x500/OperationalBindingManagement";

/**
 * @summary Convert an operational binding time into a JavaScript Date object.
 * @description
 *
 * This is a fairly simple function that converts an operational binding time
 * specification into a more useful JavaScript Date object describing the same
 * time.
 *
 * @param time The operational binding time specification.
 * @returns A normal JavaScript Date representation of the time
 *
 * @function
 */
export
function getDateFromOBTime (time: Time): Date {
    if ("utcTime" in time) {
        return time.utcTime;
    } else {
        return time.generalizedTime;
    }
}

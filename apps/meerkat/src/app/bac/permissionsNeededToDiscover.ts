import {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
} from "@wildboar/x500/src/lib/bac/bacACDF";

export
const permissionsNeededToDiscover: number[] = [
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
];

export default permissionsNeededToDiscover;

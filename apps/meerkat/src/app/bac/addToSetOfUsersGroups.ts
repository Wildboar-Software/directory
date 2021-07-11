import type { Context } from "../types";
import type { ACIItem } from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getIsGroupMember from "./getIsGroupMember";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { OBJECT_IDENTIFIER } from "asn1-ts";

export
async function addToSetOfUsersGroups (
    ctx: Context,
    map: Map<NameAndOptionalUID, boolean | undefined>,
    acis: ACIItem[],
    user: NameAndOptionalUID,
    getEqualityMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): Promise<Map<NameAndOptionalUID, boolean | undefined>> {
    const isGroupMember = getIsGroupMember(ctx, getEqualityMatcher);
    for (const aci of acis) {
        if ("userFirst" in aci.itemOrUserFirst) {
            const userFirst = aci.itemOrUserFirst.userFirst;
            const uc = userFirst.userClasses;
            if (!uc.userGroup) {
                continue;
            }
            const ugs = uc.userGroup;
            for (const ug of ugs) {
                const isMember = await isGroupMember(ug, user);
                map.set(ug, isMember);
            }
        } else if ("itemFirst" in aci.itemOrUserFirst) {
            const itemFirst = aci.itemOrUserFirst.itemFirst;
            const ucs = itemFirst.itemPermissions.map((ip) => ip.userClasses)
            for (const uc of ucs) {
                if (!uc.userGroup) {
                    continue;
                }
                const ugs = uc.userGroup;
                for (const ug of ugs) {
                    const isMember = await isGroupMember(ug, user);
                    map.set(ug, isMember);
                }
            }
        }
    }
    return map;
}

export default addToSetOfUsersGroups;

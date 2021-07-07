import type { Context, Entry } from "../types";
import getDistinguishedName from "../x500/getDistinguishedName";
import getAdministrativePoint from "../dit/getAdministrativePoint";
import getACIItems from "../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import bacACDF from "@wildboar/x500/src/lib/bac/bacACDF";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type EqualityMatcher from "@wildboar/ldap/src/lib/types/EqualityMatcher";

// FIXME: Needs an isMemberOfGroup implementation.
const IS_MEMBER = () => false;

/**
 * @summary Convenience function to check the permissions on an entry.
 * @description
 * A convenience function to simplify checking permissions on an entry.
 * This function should not be used when multiple permissions will need to be
 * checked on an object repeatedly; if this is the case, the contents of this
 * function should be inlined into where it would have been used so that
 * certain computationally-costly inputs do not have to be recalculated.
 *
 * @param {object} ctx The context object.
 * @param {NameAndOptionalUID} user The `NameAndOptionalUID` of the user.
 * @param {object} authLevel The `AuthenticationLevel` of the user.
 * @param {object} entry The directory the user is attempting to access.
 * @param {number[]} permissions The permissions the user is requesting.
 * @returns {boolean} Whether access is granted (`true`) or denied (`false`).
 * @function
 */
export
async function checkPermissionsOnEntry (
    ctx: Context,
    user: NameAndOptionalUID,
    authLevel: AuthenticationLevel,
    entry: Entry,
    permissions: number[],
): Promise<boolean> {

    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;

    const admPoint = getAdministrativePoint(entry);
    if (!admPoint) {
        return true;
    }
    const admPointDN = getDistinguishedName(admPoint);
    const dn = getDistinguishedName(entry);
    const entryACIs = await getACIItems(ctx, entry);
    const entryACDFTuples: ACDFTuple[] = (entryACIs ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));

    const { authorized } = bacACDF(
        admPointDN,
        entryACDFTuples,
        authLevel,
        user,
        dn,
        {
            entry: Array.from(entry!.objectClass)
                .map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
        },
        permissions,
        EQUALITY_MATCHER,
        IS_MEMBER,
        false,
    );
    return authorized;
}

export default checkPermissionsOnEntry;

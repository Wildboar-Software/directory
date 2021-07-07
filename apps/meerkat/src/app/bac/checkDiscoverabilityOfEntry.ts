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
import permissionsNeededToDiscover from "./permissionsNeededToDiscover";

// FIXME: Needs an isMemberOfGroup implementation.
const IS_MEMBER = () => false;

/**
 * @summary Check if an entry and all of it's superiors would be discoverable by a list operation.
 * @description
 *
 * Following the X.500 directory standards to the letter means having
 * information disclosure vulnerabilities. Most operations will return an error
 * other than `noSuchObject` if the operation is not permitted for that object,
 * which means that a nefarious user could repeatedly attempt operations on
 * guessed object names to determine which objects exist by those that return
 * an error other than `noSuchObject`.
 *
 * This function is intended to determine if an object and all of its superiors
 * up to, but excluding, the root DSE (because the root DSE is always known to
 * exist) would be discoverable during a Directory Access Protocol `list`
 * operation. This is the yardstick that this function uses to determine
 * whether directory administrators permit a user to know of an object's
 * existence. It is required that this function iterate all the way up the DIT
 * to ensure that every one of the entry's superiors could be discovered, not
 * just the entry alone.
 *
 * If this function returns `false`, the calling operation should return a
 * `noSuchObject` error to the requestor; otherwise, the operation may return
 * the normal errors found in the specification.
 *
 * @param {object} ctx The context object.
 * @param {NameAndOptionalUID} user The `NameAndOptionalUID` of the user.
 * @param {object} authLevel The `AuthenticationLevel` of the user.
 * @param {object} entry The directory the user is attempting to access.
 * @param {number[]} permissions The permissions the user is requesting.
 * @returns {boolean} Whether access is granted (`true`) or denied (`false`) for
 *  every entry up to the Root DSE.
 * @function
 */
export
async function checkDiscoverabilityOfEntry (
    ctx: Context,
    user: NameAndOptionalUID,
    authLevel: AuthenticationLevel,
    entry: Entry,
): Promise<boolean> {

    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;

    let current: Entry | undefined = entry;
    while (current) {
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
            permissionsNeededToDiscover,
            EQUALITY_MATCHER,
            IS_MEMBER,
            false,
        );
        if (!authorized) {
            return false;
        }
        if (current.dseType.root) { // The root is always known to exist.
            return true;
        }
        current = current.parent;
    }
    return true;
}

export default checkDiscoverabilityOfEntry;

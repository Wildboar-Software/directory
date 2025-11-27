import type { Context } from "../types/index.js";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import { member } from "@wildboar/x500/SelectedAttributeTypes";
import { uniqueMember } from "@wildboar/x500/SelectedAttributeTypes";
import { uniqueIdentifier } from "@wildboar/x500/SelectedAttributeTypes";
import { groupOfNames } from "@wildboar/x500/SelectedObjectClasses";
import { groupOfUniqueNames } from "@wildboar/x500/SelectedObjectClasses";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { type EqualityMatcher } from "@wildboar/x500";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import dnToVertex from "../dit/dnToVertex.js";
import { compareDistinguishedName } from "@wildboar/x500";
import readValues from "../database/entry/readValues.js";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";

const GROUP_OF_NAMES: string = groupOfNames["&id"].toString();
const GROUP_OF_UNIQUE_NAMES: string = groupOfUniqueNames["&id"].toString();

const selectOnlyUniqueIdentifier = new EntryInformationSelection(
    {
        select: [
            uniqueIdentifier["&id"],
        ],
    },
);

const selectMemberships = new EntryInformationSelection(
    {
        select: [
            member["&id"],
            uniqueMember["&id"],
        ],
    },
);

/**
 * @summary Higher-order function that produces a function for checking if a user is in a group.
 * @description
 *
 * This is a higher-order function that takes the context object, and equality
 * matcher getter, and returns a new asynchronous function that will return a
 * `boolean` indicating whether the user is a member of the group, or
 * `undefined` if it cannot be determined.
 *
 * @param ctx The context object
 * @param getEqualityMatcher A function that gets an equality matcher from an
 *  attribute type object identifier
 * @returns An async function that takes a user group and user and returns a
 *  boolean indicating whether a user is a member of the group, or `undefined`
 *  if the user is not.
 *
 * @function
 */
export
function getIsGroupMember (
    ctx: Context,
    getEqualityMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): (
    userGroup: NameAndOptionalUID,
    user: NameAndOptionalUID,
) => Promise<boolean | undefined> {
    return async function (
        userGroup: NameAndOptionalUID,
        user: NameAndOptionalUID,
    ): Promise<boolean | undefined> {
        const groupEntry = await dnToVertex(ctx, ctx.dit.root, userGroup.dn);
        if (
            !groupEntry?.dse.objectClass.has(GROUP_OF_NAMES)
            && !groupEntry?.dse.objectClass.has(GROUP_OF_UNIQUE_NAMES)
        ) {
            return undefined;
        }
        if (user.uid) {
            const userEntry = await dnToVertex(ctx, ctx.dit.root, user.dn);
            if (!userEntry) {
                return undefined;
            }
            const { userValues: uniqueIdentifiers } = await readValues(ctx, userEntry, {
                selection: selectOnlyUniqueIdentifier,
            });
            const someUIDMatched: boolean = uniqueIdentifiers
                .some((uid) => !Buffer.compare(
                    Buffer.from(uid.value.bitString),
                    Buffer.from(user.uid!),
                ));
            if (!someUIDMatched) {
                /**
                 * Undefined if the Unique Identifier does not match, because
                 * this is not the same object that is named; that object no
                 * longer exists. (The point of the unique identifier is to
                 * uniquely identify objects between "re-incarnations.")
                 */
                return undefined;
            }
        }
        const { userValues: groupAttributes } = await readValues(ctx, groupEntry, {
            selection: selectMemberships,
        });
        for (const attr of groupAttributes) {
            if (attr.type.isEqualTo(member["&id"])) {
                const decodedValue = _decode_DistinguishedName(attr.value);
                if (compareDistinguishedName(decodedValue, user.dn, getEqualityMatcher)) {
                    return true;
                }
            } else if (attr.type.isEqualTo(uniqueMember["&id"])) {
                const decodedValue = uniqueMember.decoderFor["&Type"]!(attr.value);
                if (compareDistinguishedName(decodedValue.dn, user.dn, getEqualityMatcher)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default getIsGroupMember;

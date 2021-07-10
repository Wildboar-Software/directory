import type { Context } from "../../types";
import type LDAPConnection from "../LDAPConnection";
import type {
    DelRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelRequest.ta";
import type {
    DelResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_insufficientAccessRights,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import findEntry from "../../x500/findEntry";
import deleteEntry from "../../database/deleteEntry";
import { objectNotFound } from "../results";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getAdministrativePoint from "../../dit/getAdministrativePoint";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import { strict as assert } from "assert";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";

// FIXME: Needs an isMemberOfGroup implementation.
const IS_MEMBER = () => false;

export
async function del (
    ctx: Context,
    conn: LDAPConnection,
    req: DelRequest,
    controls: Control[] = [],
): Promise<DelResponse> {
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const authLevel: AuthenticationLevel = {
        basicLevels: new AuthenticationLevel_basicLevels(
            conn.authLevel,
            undefined,
            undefined,
        ),
    };
    const userDN = conn.boundEntry
        ? getDistinguishedName(conn.boundEntry)
        : undefined;
    const userName = userDN
        ? new NameAndOptionalUID(userDN, undefined)
        : undefined;

    const dn = decodeLDAPDN(ctx, req);
    const entry = await findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }
    const admPoint = getAdministrativePoint(entry);
    const admPointDN = admPoint
        ? getDistinguishedName(admPoint)
        : undefined;
    const entryACIs = await getACIItems(ctx, entry);
    const entryACDFTuples: ACDFTuple[] = (entryACIs ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const accessControlled: boolean = Boolean(entryACDFTuples);
    if (accessControlled && !userName) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req,
            Buffer.from("Anonymous users not permitted. Please authenticate first."),
            undefined,
        );
    }

    function checkPermissionsOnEntry (permissions: number[]): boolean {
        if (!accessControlled) {
            return false;
        }
        const { authorized } = bacACDF(
            admPointDN!,
            entryACDFTuples,
            authLevel,
            userName!,
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

    const authorizedToKnowAboutEntry = checkPermissionsOnEntry([
        PERMISSION_CATEGORY_BROWSE,
        PERMISSION_CATEGORY_RETURN_DN,
    ]) || checkPermissionsOnEntry([
        PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
    ]);

    if (!authorizedToKnowAboutEntry) {
        return objectNotFound;
    }

    const authorizedToRemoveEntry = checkPermissionsOnEntry([
        PERMISSION_CATEGORY_REMOVE,
    ]);

    if (!authorizedToRemoveEntry) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req,
            Buffer.from("Access denied."),
            undefined,
        );
    }

    await deleteEntry(ctx, entry);
    if (entry.parent?.children?.length) {
        const entryIndex = entry.parent.children.findIndex((child) => (child.uuid === entry.uuid));
        entry.parent.children.splice(entryIndex, 1);
    }
    return new LDAPResult(
        LDAPResult_resultCode_success, // Success
        req,
        Buffer.from("Deleted", "utf-8"),
        undefined,
    );
}

export default del;

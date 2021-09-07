import type { Context } from "../../types";
import type LDAPConnection from "../LDAPConnection";
import type {
    CompareRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareRequest.ta";
import type {
    CompareResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_compareFalse,
    LDAPResult_resultCode_compareTrue,
    LDAPResult_resultCode_insufficientAccessRights,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import findEntry from "../../x500/findEntry";
import readEntryAttributes from "../../database/readEntryAttributes";
import { objectNotFound } from "../results";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
    PERMISSION_CATEGORY_COMPARE,
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
import { ObjectIdentifier } from "asn1-ts";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import getIsGroupMember from "../../bac/getIsGroupMember";

export
async function compare (
    ctx: Context,
    conn: LDAPConnection,
    req: CompareRequest,
    controls: Control[] = [],
): Promise<CompareResponse> {
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
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

    const dn = decodeLDAPDN(ctx, req.entry);
    const entry = await findEntry(ctx, ctx.dit.root, dn, true);
    if (!entry) {
        return objectNotFound;
    }
    const admPoint = getAdministrativePoint(entry);
    const admPointDN = admPoint
        ? getDistinguishedName(admPoint)
        : undefined;
    const entryACIs = await getACIItems(ctx, entry);
    const entryACDFTuples: ACDFTuple[] = (entryACIs ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const relevantTuples: ACDFTupleExtended[] = (admPointDN && userName)
        ? (await Promise.all(
            entryACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                ...tuple,
                await userWithinACIUserClass(tuple[0], userName, dn, EQUALITY_MATCHER, isMemberOfGroup),
            ]),
        )).filter((tuple) => (tuple[5] > 0))
        : [];
    const accessControlled: boolean = Boolean(entryACDFTuples);
    if (accessControlled && !userName) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.entry,
            Buffer.from("Anonymous users not permitted. Please authenticate first."),
            undefined,
        );
    }

    if (accessControlled) {
        assert(admPoint);
        assert(admPointDN);
        const { authorized: authorizedToKnowAboutEntry } = bacACDF(
            relevantTuples,
            authLevel,
            {
                entry: Array.from(entry.dse.objectClass)
                    .map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
            },
            [
                PERMISSION_CATEGORY_BROWSE,
                PERMISSION_CATEGORY_RETURN_DN,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorizedToKnowAboutEntry) {
            return objectNotFound;
        }
    }

    const desc = normalizeAttributeDescription(req.ava.attributeDesc);
    const attrSpec = ctx.attributes.get(desc);
    if (!attrSpec?.ldapSyntax || !attrSpec.equalityMatcher) {
        throw new Error();
    }
    const syntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
    if (!syntax?.decoder) {
        throw new Error();
    }
    const assertedValue = syntax.decoder(req.ava.assertionValue);

    if (accessControlled) {
        const { authorized: authorizedToAccessAttributeValue } = bacACDF(
            relevantTuples,
            authLevel,
            {
                value: new AttributeTypeAndValue(
                    attrSpec.id,
                    assertedValue,
                ),
            },
            [PERMISSION_CATEGORY_COMPARE],
            EQUALITY_MATCHER,
        );
        const { authorized: authorizedToErrorDisclosure } = bacACDF(
            relevantTuples,
            authLevel,
            {
                value: new AttributeTypeAndValue(
                    attrSpec.id,
                    assertedValue,
                ),
            },
            [PERMISSION_CATEGORY_DISCLOSE_ON_ERROR],
            EQUALITY_MATCHER,
        );
        if (!authorizedToAccessAttributeValue) {
            if (authorizedToErrorDisclosure) {
                return new LDAPResult(
                    LDAPResult_resultCode_insufficientAccessRights,
                    req.entry,
                    Buffer.from("Access denied."),
                    undefined,
                );
            } else {
                return new LDAPResult(
                    LDAPResult_resultCode_compareFalse,
                    req.entry,
                    Buffer.from("Non-Match", "utf-8"),
                    undefined,
                );
            }
        }
    }

    const matcher = attrSpec.equalityMatcher;
    const {
        userAttributes,
        operationalAttributes,
    } = await readEntryAttributes(ctx, entry);
    const match = [ ...userAttributes, ...operationalAttributes ]
        .filter((attr) => attr.id.isEqualTo(attrSpec.id))
        .some((attr) => matcher(assertedValue, attr.value));
    return new LDAPResult(
        match
            ? LDAPResult_resultCode_compareTrue
            : LDAPResult_resultCode_compareFalse,
        req.entry,
        match
            ? Buffer.from("Match", "utf-8")
            : Buffer.from("Non-Match", "utf-8"),
        undefined,
    );
}

export default compare;

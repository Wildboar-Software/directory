import { Context, Vertex, ClientConnection } from "../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import { DER } from "asn1-ts/dist/node/functional";
import readChildren from "../dit/readChildren";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_invalidReference,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ListResult,
    _encode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import {
    ListResultData_listInfo_subordinates_Item as ListItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import { NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import { NameProblem_noSuchObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";

export
async function list_ii (
    ctx: Context,
    conn: ClientConnection,
    admPoints: Vertex[],
    target: Vertex,
    request: ChainedArgument,
    fromDAP: boolean,
): Promise<ChainedResult> {
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const targetACI = [
        ...((accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME) && !target.dse.subentry)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && target.dse.subentry)
            ? target.immediateSuperior?.dse?.admPoint?.subentryACI ?? []
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? target.dse.entryACI ?? []
            : []),
    ];
    const acdfTuples: ACDFTuple[] = (targetACI ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
            ...tuple,
            await userWithinACIUserClass(
                tuple[0],
                conn.boundNameAndUID!, // FIXME:
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    if (accessControlScheme) {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_BROWSE,
                PERMISSION_CATEGORY_RETURN_DN,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorized) {
            // Non-disclosure of the target object is at least addressed in X.501 RBAC!
            throw new errors.NameError(
                "Not permitted to list the target entry.",
                new NameErrorData(
                    NameProblem_noSuchObject,
                    {
                        rdnSequence: [],
                    },
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    const subordinates = await readChildren(ctx, target);
    const excludeShadows: boolean = request.chainedArgument.excludeShadows
        ?? ChainingArguments._default_value_for_excludeShadows;
    const listItems: ListItem[] = [];
    for (const subordinate of subordinates) {
        // TODO: Check limits
        if (!(subordinate.dse.entry) && !(subordinate.dse.alias)) {
            continue;
        }
        if (
            excludeShadows
            && (subordinate.dse.shadow) // TODO: Ignore if writeableCopy
            // writableCopy has been deprecated, but it still constitutes a "copy"
        ) {
            continue;
        }

        if (accessControlScheme) {
            const subordinateDN = [ ...targetDN, subordinate.dse.rdn ];
            const subordinateACI = [
                ...((accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME) && !subordinate.dse.subentry)
                    ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                    : []),
                ...((accessControlSchemesThatUseSubentryACI.has(AC_SCHEME) && subordinate.dse.subentry)
                    ? subordinate.immediateSuperior?.dse?.admPoint?.subentryACI ?? []
                    : []),
                ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                    ? subordinate.dse.entryACI ?? []
                    : []),
            ];
            const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantSubordinateTuples: ACDFTupleExtended[] = (await Promise.all(
                subordinateACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                    ...tuple,
                    await userWithinACIUserClass(
                        tuple[0],
                        conn.boundNameAndUID!, // FIXME:
                        subordinateDN,
                        EQUALITY_MATCHER,
                        isMemberOfGroup,
                    ),
                ]),
            ))
                .filter((tuple) => (tuple[5] > 0));
            const {
                authorized: authorizedToList,
            } = bacACDF(
                relevantSubordinateTuples,
                conn.authLevel,
                {
                    entry: Array.from(subordinate.dse.objectClass).map(ObjectIdentifier.fromString),
                },
                [
                    PERMISSION_CATEGORY_BROWSE,
                    PERMISSION_CATEGORY_RETURN_DN,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToList) {
                continue;
            }
        }

        listItems.push(new ListItem(
            subordinate.dse.rdn,
            Boolean(subordinate.dse.alias),
            Boolean(subordinate.dse.shadow),
        ));
    }
    if (fromDAP && (listItems.length === 0)) {
        throw new errors.ServiceError(
            "Null result from DAP list operation",
            new ServiceErrorData(
                ServiceProblem_invalidReference,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    const result: ListResult = {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                // {
                //     rdnSequence: targetDN,
                // },
                undefined,
                listItems,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        },
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ListResult(result, DER),
    );
}

export default list_ii;


import type { Context, Vertex, ClientConnection } from "../types";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
import { DER } from "asn1-ts/dist/node/functional";
import {
    AdministerPasswordArgument,
    _decode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    AdministerPasswordResult,
    _encode_AdministerPasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordResult.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import setEntryPassword from "../database/setEntryPassword";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import getDistinguishedName from "../x500/getDistinguishedName";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_administerPassword,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-administerPassword.va";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";

// administerPassword OPERATION ::= {
//   ARGUMENT  AdministerPasswordArgument
//   RESULT    AdministerPasswordResult
//   ERRORS    {securityError |
//              updateError}
//   CODE      id-opcode-administerPassword }

// AdministerPasswordArgument ::=
//   OPTIONALLY-PROTECTED-SEQ { AdministerPasswordArgumentData }

// AdministerPasswordArgumentData ::= SEQUENCE {
//   object  [0]  DistinguishedName,
//   newPwd  [1]  UserPwd,
//   ... }

// AdministerPasswordResult ::= CHOICE {
//   null NULL,
//   information OPTIONALLY-PROTECTED-SEQ { AdministerPasswordResultData },
//   ...}

// AdministerPasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

export
async function administerPassword (
    ctx: Context,
    conn: ClientConnection,
    invokeId: InvokeId,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument: AdministerPasswordArgument = _decode_AdministerPasswordArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    if (accessControlScheme) {
        const AC_SCHEME: string = accessControlScheme.toString();
        const relevantACIItems = [
            ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
                ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
                : []),
            ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                ? (target.dse.entryACI ?? [])
                : []),
        ];
        const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
        const EQUALITY_MATCHER = (
            attributeType: OBJECT_IDENTIFIER,
        ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
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
        const {
            authorized: authorizedToModifyEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_MODIFY,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToModifyUserPassword,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                attributeType: userPassword["&id"],
            },
            [
                PERMISSION_CATEGORY_ADD,
                PERMISSION_CATEGORY_REMOVE,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToModifyUserPwd,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                attributeType: userPwd["&id"],
            },
            [
                PERMISSION_CATEGORY_ADD,
                PERMISSION_CATEGORY_REMOVE,
            ],
            EQUALITY_MATCHER,
        );
        if (
            !authorizedToModifyEntry
            || !authorizedToModifyUserPassword
            || !authorizedToModifyUserPwd
        ) {
            throw new errors.SecurityError(
                "Not permitted to modify entry with changePassword operation.",
                new SecurityErrorData(
                    SecurityProblem_noInformation,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    await setEntryPassword(ctx, target, data.newPwd);
    /* Note that the specification says that we should update hierarchical
    operational bindings, but really, no other DSA should have the passwords for
    entries in this DSA. Meerkat DSA will take a principled stance and refuse
    to update HOBs when a password changes. */
    const result: AdministerPasswordResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_administerPassword,
            ),
            undefined,
        ),
        _encode_AdministerPasswordResult(result, DER),
    );
}

export default administerPassword;

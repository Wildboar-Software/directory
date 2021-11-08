import type { Context, Vertex, ClientConnection, OperationReturn } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ChangePasswordArgument,
    _decode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    ChangePasswordResult,
    _encode_ChangePasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordResult.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import setEntryPassword from "../database/setEntryPassword";
import attemptPassword from "../authn/attemptPassword";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
    SecurityProblem_invalidCredentials,
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
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_changePassword,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-changePassword.va";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import type { OperationDispatcherState } from "./OperationDispatcher";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";

// changePassword OPERATION ::= {
//   ARGUMENT  ChangePasswordArgument
//   RESULT    ChangePasswordResult
//   ERRORS    {securityError |
//              updateError }
//   CODE      id-opcode-changePassword }

// ChangePasswordArgument ::= OPTIONALLY-PROTECTED-SEQ { ChangePasswordArgumentData }

// ChangePasswordArgumentData ::= SEQUENCE {
//   object   [0]  DistinguishedName,
//   oldPwd   [1]  UserPwd,
//   newPwd   [2]  UserPwd,
//   ... }

// ChangePasswordResult ::= CHOICE {
//   null        NULL,
//   information OPTIONALLY-PROTECTED-SEQ { ChangePasswordResultData },
//   ...}

// ChangePasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

export
async function changePassword (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument: ChangePasswordArgument = _decode_ChangePasswordArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
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
        const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
        const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
        const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
            acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                ...tuple,
                await userWithinACIUserClass(
                    tuple[0],
                    conn.boundNameAndUID!,
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
                ctx.i18n.t("err:not_authz_cpw"),
                new SecurityErrorData(
                    SecurityProblem_noInformation,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }
    const oldPasswordIsCorrect: boolean | undefined = await attemptPassword(ctx, target, {
        userPwd: data.oldPwd,
    });
    if (!oldPasswordIsCorrect) {
        ctx.log.warn(ctx.i18n.t("log:change_password_incorrect", {
            cid: conn.id,
            uuid: target.dse.uuid,
        }));
        throw new errors.SecurityError(
            ctx.i18n.t("err:old_password_incorrect"),
            new SecurityErrorData(
                SecurityProblem_invalidCredentials,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const promises = await setEntryPassword(ctx, conn, target, data.newPwd);
    await ctx.db.$transaction(promises);
    /* Note that the specification says that we should update hierarchical
    operational bindings, but really, no other DSA should have the passwords for
    entries in this DSA. Meerkat DSA will take a principled stance and refuse
    to update HOBs when a password changes. */
    const result: ChangePasswordResult = {
        null_: null,
    };
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        id_opcode_changePassword,
                    ),
                    undefined,
                ),
                _encode_ChangePasswordResult(result, DER),
            ),
        },
        stats: {},
    };
}

export default changePassword;
import type { Context, Vertex, ClientConnection, OperationReturn } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
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
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import setEntryPassword from "../database/setEntryPassword";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import getDistinguishedName from "../x500/getDistinguishedName";
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
    id_opcode_administerPassword,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-administerPassword.va";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import type { OperationDispatcherState } from "./OperationDispatcher";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";

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
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument: AdministerPasswordArgument = _decode_AdministerPasswordArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const relevantACIItems = getACIItems(accessControlScheme, target, relevantSubentries);
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
                ctx.i18n.t("err:not_authz_apw"),
                new SecurityErrorData(
                    SecurityProblem_invalidCredentials,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }
    const promises = await setEntryPassword(ctx, conn, target, data.newPwd);
    await ctx.db.$transaction(promises);
    /* Note that the specification says that we should update hierarchical
    operational bindings, but really, no other DSA should have the passwords for
    entries in this DSA. Meerkat DSA will take a principled stance and refuse
    to update HOBs when a password changes. */
    const result: AdministerPasswordResult = {
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
                        id_opcode_administerPassword,
                    ),
                    undefined,
                ),
                _encode_AdministerPasswordResult(result, DER),
            ),
        },
        stats: {},
    };
}

export default administerPassword;

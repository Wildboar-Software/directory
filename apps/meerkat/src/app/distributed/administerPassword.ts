import { Buffer } from "node:buffer";
import type { Context, Vertex, ClientAssociation, OperationReturn } from "../types/index.js";
import { ASN1TagClass, ASN1UniversalType, ObjectIdentifier, unpackBits } from "@wildboar/asn1";
import * as errors from "../types/index.js";
import { DER } from "@wildboar/asn1/functional";
import {
    AdministerPasswordArgument,
    _decode_AdministerPasswordArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordResult,
    _encode_AdministerPasswordResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordResultData,
    _encode_AdministerPasswordResultData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/DistributedOperations";
import {
    ChainingResults,
} from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import setEntryPassword from "../database/setEntryPassword.js";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_inappropriateAlgorithms,
} from "@wildboar/x500/DirectoryAbstractService";
import getRelevantSubentries from "../dit/getRelevantSubentries.js";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
} from "@wildboar/x500";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import {
    userPassword,
} from "@wildboar/x500/AuthenticationFramework";
import {
    userPwd,
} from "@wildboar/x500/PasswordPolicy";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    id_opcode_administerPassword,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import getACIItems from "../authz/getACIItems.js";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import bacSettings from "../authz/bacSettings.js";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import preprocessTuples from "../authz/preprocessTuples.js";
import { generateSignature } from "../pki/generateSignature.js";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier.js";
import {
    UpdateErrorData,
    UpdateProblem_insufficientPasswordQuality,
} from "@wildboar/x500/DirectoryAbstractService";
import { updateError } from "@wildboar/x500/DirectoryAbstractService";
import {
    checkPasswordQualityAndHistory,
    CHECK_PWD_QUALITY_NO_SLOTS,
    CHECK_PWD_QUALITY_TOO_SOON,
    CHECK_PWD_QUALITY_OK,
    CHECK_PWD_QUALITY_REUSE,
} from "../password/checkPasswordQuality.js";
import { EncPwdInfo } from "@wildboar/x500/DirectoryAbstractService";
import { pwdAdminSubentry } from "@wildboar/x500/InformationFramework";
import { id_ar_pwdAdminSpecificArea } from "@wildboar/x500/InformationFramework";
import { userPwdHistory } from "@wildboar/x500/PasswordPolicy";
import { pwdReset } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdReset.oa.js";
import { pwdHistorySlots } from "@wildboar/x500/PasswordPolicy";
import { id_scrypt } from "@wildboar/scrypt-0";
import { validateAlgorithmParameters } from "../authn/validateAlgorithmParameters.js";
import { acdf } from "../authz/acdf.js";

const USER_PASSWORD_OID: string = userPassword["&id"].toString();
const USER_PWD_OID: string = userPwd["&id"].toString();

/**
 * @summary The administerPassword operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `administerPassword` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 12.6. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.1.3.
 *
 * This implementation sets the `pwdReset` operational attribute value to `TRUE`
 * to signal that the user must change his or her password upon logging in
 * again.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function administerPassword (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const signErrors: boolean = false; // TODO: Make this configurable.
    const passwordIsPermittedOnThisEntry: boolean = Array.from(target.dse.objectClass.values())
        .some((oid) => {
            const spec = ctx.objectClasses.get(oid);
            if (!spec) {
                return false;
            }
            return (
                spec.mandatoryAttributes.has(USER_PASSWORD_OID)
                || spec.mandatoryAttributes.has(USER_PWD_OID)
                || spec.optionalAttributes.has(USER_PASSWORD_OID)
                || spec.optionalAttributes.has(USER_PWD_OID)
            );
        });
    if (!passwordIsPermittedOnThisEntry) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:not_authz_apw"),
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const argument: AdministerPasswordArgument = _decode_AdministerPasswordArgument(state.operationArgument);
    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     */
     if ("signed" in argument) {
        /*
         No signature verification takes place for the administerPassword operation,
         because it does not have a `SecurityParameters` field, and therefore
         does not relay a certification-path.
         */
    }
    // #endregion Signature validation
    const data = getOptionallyProtectedValue(argument);
    if (
        ("encrypted" in data.newPwd)
        && (
            !data.newPwd.encrypted.algorithmIdentifier.algorithm.isEqualTo(id_scrypt)
            || !validateAlgorithmParameters(data.newPwd.encrypted.algorithmIdentifier)
        )
    ) { // If the new password is encrypted using an algorithm other than Meerkat DSA's algorithm, throw an error.
        throw new errors.SecurityError(
            ctx.i18n.t("err:inappropriate_algs"),
            new SecurityErrorData(
                SecurityProblem_inappropriateAlgorithms,
                undefined,
                new EncPwdInfo(
                    [
                        getScryptAlgorithmIdentifier(),
                    ],
                    undefined,
                    undefined,
                ),
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const targetDN = getDistinguishedName(target);
    const requestor: DistinguishedName | undefined = state.chainingArguments.originator
        ?? assn.boundNameAndUID?.dn;
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    if (accessControlScheme) {
        const relevantACIItems = await getACIItems(
            ctx,
            accessControlScheme,
            target.immediateSuperior,
            target,
            relevantSubentries,
            Boolean(target.dse.subentry),
        );
        const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
        const NAMING_MATCHER = getNamingMatcherGetter(ctx);
        const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
        const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
            accessControlScheme,
            acdfTuples,
            user,
            state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
            targetDN,
            isMemberOfGroup,
            NAMING_MATCHER,
        );
        const authorizedToModifyEntry = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [PERMISSION_CATEGORY_MODIFY],
            relevantTuples,
            user,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            bacSettings,
            true,
        );
        const authorizedToModifyUserPassword = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [
                PERMISSION_CATEGORY_ADD,
                PERMISSION_CATEGORY_REMOVE,
                PERMISSION_CATEGORY_MODIFY,
            ],
            relevantTuples,
            user,
            {
                attributeType: userPassword["&id"],
                operational: false,
            },
            bacSettings,
            true,
        );
        const authorizedToModifyUserPwd = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [
                PERMISSION_CATEGORY_ADD,
                PERMISSION_CATEGORY_REMOVE,
                PERMISSION_CATEGORY_MODIFY,
            ],
            relevantTuples,
            user,
            {
                attributeType: userPwd["&id"],
                operational: false,
            },
            bacSettings,
            true,
        );
        // Permission to modify the user password history is required for administerPassword (in Meerkat DSA).
        const authorizedToModifyPwdHistory = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [
                PERMISSION_CATEGORY_ADD,
                PERMISSION_CATEGORY_REMOVE,
                PERMISSION_CATEGORY_MODIFY,
            ],
            relevantTuples,
            user,
            {
                attributeType: userPwdHistory["&id"],
                operational: true,
            },
            bacSettings,
            true,
        );
        if (
            !authorizedToModifyEntry
            || !authorizedToModifyUserPassword
            || !authorizedToModifyUserPwd
            || !authorizedToModifyPwdHistory
        ) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_apw"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    // #region Password Policy Verification
    // TODO: Password policy applies _per password attribute_. This is something I'll
    // have to change when I re-write Meerkat DSA entirely.
    const pwdAdminPoint = state.admPoints
        .find((ap) => ap.dse.admPoint?.administrativeRole.has(id_ar_pwdAdminSpecificArea.toString()));
    if (pwdAdminPoint) {
        const pwdAdminSubentries = relevantSubentries
            .filter((s) => s.dse.objectClass.has(pwdAdminSubentry["&id"].toString()));
        const passwordQualityIsAdministered: boolean = (pwdAdminSubentries.length > 0);

        if (("encrypted" in data.newPwd) && passwordQualityIsAdministered) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_verify_pwd_quality"),
                new UpdateErrorData(
                    UpdateProblem_insufficientPasswordQuality,
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else if ("clear" in data.newPwd) {

            // #region Ensure at least two slots in password history
            // This is a requirement for administerPassword.

            const minPasswordHistorySlots: number = (await ctx.db.attributeValue.findMany({
                where: {
                    entry_id: {
                        in: pwdAdminSubentries.map((s) => s.dse.id),
                    },
                    type_oid: pwdHistorySlots["&id"].toBytes(),
                    operational: true,
                },
                select: {
                    jer: true,
                },
            }))
                .map(({ jer }) => jer as number)
                // Do not reduce with initialValue = 0! Use undefined, then default to a large number.
                .reduce((acc, curr) => Math.min(Number(acc), Number(curr)), undefined)
                ?? 10_000_000;
            const oldestPasswordTimeInHistory = Number.isSafeInteger(minPasswordHistorySlots)
                ? (await ctx.db.passwordHistory.findMany({
                    where: {
                        entry_id: target.dse.id,
                    },
                    orderBy: [
                        {
                            time: "desc",
                        },
                    ],
                    take: Math.max(minPasswordHistorySlots - 2, 0),
                    select: {
                        time: true,
                    },
                })).pop()?.time
                : undefined;
            if (oldestPasswordTimeInHistory) {
                await ctx.db.passwordHistory.deleteMany({
                    where: {
                        entry_id: target.dse.id,
                        time: {
                            lt: oldestPasswordTimeInHistory,
                        },
                    },
                });
            }
            // #endregion Ensure at least two slots in password history

            for (const pwsub of pwdAdminSubentries) {
                const checkPwdResult = await checkPasswordQualityAndHistory(ctx, target.dse.id, data.newPwd.clear, pwsub);
                if ([
                    CHECK_PWD_QUALITY_OK,
                    CHECK_PWD_QUALITY_TOO_SOON,
                    CHECK_PWD_QUALITY_NO_SLOTS,
                    CHECK_PWD_QUALITY_REUSE,
                ].includes(checkPwdResult)) {
                    // We just ignore these errors. Password administration gets to skip these.
                    continue;
                }
                // Unfortunately, err:pwd_quality cannot contain more info, because the error message will be logged,
                // disclosing information about the attempted password.
                throw new errors.UpdateError(
                    ctx.i18n.t("err:pwd_quality"),
                    new UpdateErrorData(
                        UpdateProblem_insufficientPasswordQuality,
                        undefined,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    } // If there is no password admin point defined, you can do whatever you want.
    // #endregion Password Policy Verification

    const promises = await setEntryPassword(ctx, assn, target, data.newPwd);
    await ctx.db.$transaction([
        ...promises,
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: target.dse.id,
                type_oid: pwdReset["&id"].toBytes(),
            },
        }),
        ctx.db.attributeValue.create({
            data: {
                entry_id: target.dse.id,
                type_oid: pwdReset["&id"].toBytes(),
                operational: true,
                tag_class: ASN1TagClass.universal,
                constructed: false,
                tag_number: ASN1UniversalType.boolean,
                content_octets: Buffer.from([ 0xFF ]),
                jer: true,
                normalized_str: "TRUE",
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }),
    ]);
    /* Note that the specification says that we should update hierarchical
    operational bindings, but really, no other DSA should have the passwords for
    entries in this DSA. Meerkat DSA will take a principled stance and refuse
    to update HOBs when a password changes. */
    /**
     * There are no security parameters in the request data, so a user cannot
     * specify that they want the results to be signed. In the face of this
     * ambiguity, Meerkat DSA will not sign any `administerPassword` and
     * `changePassword` results.
     */
     const resultData: AdministerPasswordResultData = new AdministerPasswordResultData(
        [],
        undefined,
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: AdministerPasswordResult = {
            information: (() => {
                const resultDataBytes = _encode_AdministerPasswordResultData(resultData, DER).toBytes();
                const key = ctx.config.signing?.key;
                if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                    return {
                        unsigned: resultData,
                    };
                }
                const signingResult = generateSignature(key, resultDataBytes);
                if (!signingResult) {
                    return {
                        unsigned: resultData,
                    };
                }
                const [ sigAlg, sigValue ] = signingResult;
                return {
                    signed: new SIGNED(
                        resultData,
                        sigAlg,
                        unpackBits(sigValue),
                        undefined,
                        undefined,
                    ),
                };
            })(),
        };
    const signDSPResult: boolean = (
        (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    state.chainingResults.info,
                    state.chainingResults.crossReferences,
                    createSecurityParameters(
                        ctx,
                        signDSPResult,
                        assn.boundNameAndUID?.dn,
                        id_opcode_administerPassword,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_AdministerPasswordResult(result, DER),
            ),
        },
        stats: {},
    };
}

export default administerPassword;

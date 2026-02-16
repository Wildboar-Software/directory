import dnToVertex from "../dit/dnToVertex.js";
import {
    BindReturn,
    DirectoryBindError,
    DSABindError,
} from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import {
    NameAndOptionalUID,
    pwdResponseValue,
    uniqueIdentifier,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    AuthenticationLevel_basicLevels,
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/BasicAccessControl";
import attemptPassword from "../authn/attemptPassword.js";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import {
    CompareArgumentData,
    _decode_CompareResult,
    _encode_CompareResultData,
    PwdResponseValue_error_passwordExpired,
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_invalidCredentials,
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
    ServiceControls,
    PwdResponseValue,
    _decode_PwdResponseValue,
    _decode_ReadResult,
    _encode_CompareArgumentData,
    _encode_ReadArgumentData,
    _encode_ReadResultData,
    compare,
    EntryInformationSelection,
    ReadArgumentData,
    SimpleCredentials,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_copyShallDo,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../versions.js";
import { read_unique_id, read_clearance } from "../database/utils.js";
import { OperationDispatcher } from "../distributed/OperationDispatcher.js";
import type {
    CompareArgument,
    ReadArgument,
    ServiceControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeValueAssertion,
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { userPwd, UserPwd } from "@wildboar/x500/PasswordPolicy";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { DER } from "@wildboar/asn1/functional";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import {
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import { strict as assert } from "node:assert";
import { clearance, Clearance } from "@wildboar/x500/EnhancedSecurity";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import { generateSIGNED } from "../pki/generateSIGNED.js";
import stringifyDN from "../x500/stringifyDN.js";
import { TRUE_BIT } from "@wildboar/asn1";
import { differenceInSeconds } from "date-fns";

const invalidCredentialsData = new DirectoryBindErrorData(
    versions,
    {
        securityError: SecurityProblem_invalidCredentials,
    },
    // No security parameters will be provided for failed auth attempts.
);

const anonymousBindErrorData = new DirectoryBindErrorData(
    versions,
    {
        securityError: SecurityProblem_inappropriateAuthentication,
    },
    // No security parameters will be provided for failed auth attempts.
);

async function getRemoteSecurityInfo(
    ctx: MeerkatContext,
    dn: DistinguishedName,
    timeLeft: number,
): Promise<[ Clearance[], NameAndOptionalUID["uid"] | undefined ]> {
    let unique_id: NameAndOptionalUID["uid"] | undefined = undefined;
    const clearances: Clearance[] = [];
    if (timeLeft <= 0) {
        ctx.log.debug(ctx.i18n.t("log:no_time_for_remote_security_info", {
            dn: stringifyDN(ctx, dn),
            context: ctx.config.log.boundDN ? "with_dn" : undefined,
        }));
        return [ clearances, unique_id ];
    }
    try {
        const selection = new EntryInformationSelection(
            {
                select: [
                    clearance["&id"],
                    uniqueIdentifier["&id"],
                ],
            },
        );
        const sco: ServiceControlOptions = new Uint8ClampedArray(13);
        sco[ServiceControlOptions_preferChaining] = TRUE_BIT;
        // TODO: Option to use localScope only
        sco[ServiceControlOptions_copyShallDo] = TRUE_BIT;
        sco[ServiceControlOptions_dontSelectFriends] = TRUE_BIT;
        const readArgData = new ReadArgumentData(
            { rdnSequence: dn },
            selection,
            undefined,
            undefined,
            new ServiceControls(
                sco,
                undefined, // No opinion on priority.
                timeLeft,
                undefined,
                undefined,
                65535, // 65K limit on attributes. This is big enough.
            ),
            createSecurityParameters(
                ctx,
                !!ctx.config.signing?.key,
                undefined, // We don't know the recipient yet.
                compare["&operationCode"],
                undefined,
                !!ctx.config.signing?.key, // Yes, definitely sign this, if possible.
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
        );
        const readArg: ReadArgument = generateSIGNED(
            ctx,
            readArgData,
            _encode_ReadArgumentData,
        );
        const readOutcome = await OperationDispatcher.dispatchLocalReadRequest(ctx, readArg);
        const dspResultData = getOptionallyProtectedValue(readOutcome.result);
        const dspCertPath = dspResultData.chainedResult.securityParameters?.certification_path;
        if (("signed" in readOutcome.result) && dspCertPath) {
            await verifySIGNED(
                ctx,
                undefined,
                dspCertPath,
                {
                    absent: null,
                },
                false,
                readOutcome.result.signed,
                _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
                false,
            );
        }
        const result = _decode_ReadResult(dspResultData.result);
        const dapResultData = getOptionallyProtectedValue(result);
        const unusableEntry: boolean = (
            dapResultData.entry.partialName
            || dapResultData.entry.derivedEntry
        ) ?? false;
        const entryInfos = unusableEntry
            ? []
            : dapResultData.entry.information ?? [];
        for (const entryInfo of entryInfos) {
            if (!("attribute" in entryInfo)) {
                continue;
            }
            const attribute = entryInfo.attribute;
            if (attribute.type_.isEqualTo(clearance["&id"])) {
                const cls = attribute.values
                    .map((v) => clearance.decoderFor["&Type"]!(v));
                clearances.push(...cls);
            }
            else if (attribute.type_.isEqualTo(uniqueIdentifier["&id"])) {
                if (attribute.values[0]) {
                    // We only use the first value.
                    unique_id = uniqueIdentifier.decoderFor["&Type"]!(attribute.values[0]);
                }
            }
        }

        // We only check the signature if the response actually included values.
        const gotSomething: boolean = clearances.length > 0 || !!unique_id;
        const dapCertPath = dapResultData.securityParameters?.certification_path;
        if (gotSomething && dapCertPath && ("signed" in result)) {
            await verifySIGNED(
                ctx,
                undefined,
                dapCertPath,
                {
                    absent: null,
                },
                false,
                result.signed,
                _encode_ReadResultData,
                false,
            );
        }
        ctx.log.debug(ctx.i18n.t("log:got_remote_security_info", {
            dn: stringifyDN(ctx, dn),
            context: ctx.config.log.boundDN ? "with_dn" : undefined,
        }));
        return [ clearances, unique_id ];
    } catch (e) {
        ctx.log.debug(ctx.i18n.t("log:failed_to_get_remote_security_info", {
            e,
            dn: stringifyDN(ctx, dn),
            context: ctx.config.log.boundDN ? "with_dn" : undefined,
        }));
        return [ clearances, unique_id ];
    }
}

async function remotePasswordCheckingProcedure(
    ctx: MeerkatContext,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    credentials: SimpleCredentials,
    signErrors: boolean,
    localQualifierPoints: number,
    source: string,
    logInfo: Record<string, any>,
): Promise<BindReturn> {
    let assertable_pwd: UserPwd | undefined;
    if (credentials.password) {
        if ("unprotected" in credentials.password) {
            assertable_pwd = {
                clear: Buffer.from(credentials.password.unprotected).toString("utf-8"),
            };
        } else if ("userPwd" in credentials.password) {
            assertable_pwd = credentials.password.userPwd;
        }
    }
    if (!assertable_pwd || (ctx.config.authn.remotePaswordCompareTimeLimit === 0)) {
        ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
        throw new BindErrorClass(
            ctx.i18n.t("err:invalid_credentials"),
            invalidCredentialsData,
            signErrors,
        );
    }
    assert(ctx.config.authn.remotePaswordCompareTimeLimit > 0);
    ctx.log.debug(ctx.i18n.t("log:checking_remote_pwd", { source }), logInfo);
    const sco: ServiceControlOptions = new Uint8ClampedArray(14);
    sco[ServiceControlOptions_preferChaining] = TRUE_BIT;
    // TODO: Option to use localScope only
    sco[ServiceControlOptions_copyShallDo] = TRUE_BIT;
    sco[ServiceControlOptions_dontMatchFriends] = TRUE_BIT;
    const startTime = new Date();
    const compareArgData = new CompareArgumentData(
        {
            rdnSequence: credentials.name,
        },
        new AttributeValueAssertion(
            userPwd["&id"],
            userPwd.encoderFor["&Type"]!(assertable_pwd, DER),
        ),
        undefined,
        new ServiceControls(
            sco,
            undefined, // No opinion on priority.
            ctx.config.authn.remotePaswordCompareTimeLimit,
        ),
        createSecurityParameters(
            ctx,
            !!ctx.config.signing?.key,
            undefined, // We don't know the recipient yet.
            compare["&operationCode"],
            undefined,
            !!ctx.config.signing?.key, // Yes, definitely sign this, if possible.
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
    );
    /**
     * The X.511 Remote Password Checking Procedure as describe in
     * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
     * Section 10.2.7.
     *
     * This variation does not query the remote DSA for the pwdAttribute.
     * That would be very hard to fit into how Meerkat DSA works without
     * a lot of complicated changes, and since userPwd is the
     * standardized password attribute, no X.500 directories should be
     * using anything else anyway.
     */
    const compareArg: CompareArgument = generateSIGNED(
        ctx,
        compareArgData,
        _encode_CompareArgumentData,
    );
    let matched: boolean = false;
    let pwd_resp: PwdResponseValue | undefined;
    try {
        const outcome = await OperationDispatcher.dispatchLocalCompareRequest(ctx, compareArg);
        const dspResultData = getOptionallyProtectedValue(outcome.result);
        const dspCertPath = dspResultData.chainedResult.securityParameters?.certification_path;
        if (("signed" in outcome.result) && dspCertPath) {
            await verifySIGNED(
                ctx,
                undefined,
                dspCertPath,
                {
                    absent: null,
                },
                false,
                outcome.result.signed,
                _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
                false,
            );
        }
        const result = _decode_CompareResult(dspResultData.result);
        const dapResultData = getOptionallyProtectedValue(result);
        matched = dapResultData.matched;
        const pwdResponseVal = dapResultData.notification
            ?.find((a) => a.type_.isEqualTo(pwdResponseValue["&id"]))
            ?.values[0];
        pwd_resp = pwdResponseVal && _decode_PwdResponseValue!(pwdResponseVal);
        // We only check the DAP signature if a match is reported, since
        // it is more computationally expensive to verify the signature.
        const dapCertPath = dapResultData.securityParameters?.certification_path;
        if (matched && dapCertPath && ("signed" in result)) {
            await verifySIGNED(
                ctx,
                undefined,
                dapCertPath,
                {
                    absent: null,
                },
                false,
                result.signed,
                _encode_CompareResultData,
                false,
            );
        }
    } catch (e) {
        ctx.log.info(ctx.i18n.t("log:error_checking_remote_pwd", { source, e }), logInfo);
        matched = false;
        // Intentional fall through to the !matched case.
    }
    if (!matched) {
        throw new BindErrorClass(
            ctx.i18n.t("err:invalid_credentials"),
            invalidCredentialsData,
            signErrors,
        );
    }

    const timeLeft = differenceInSeconds(new Date(), startTime);
    // TODO: Make whether to do this configurable.
    const [ clearances, unique_id ] = await getRemoteSecurityInfo(ctx, credentials.name, timeLeft);
    return {
        boundVertex: undefined,
        boundNameAndUID: new NameAndOptionalUID(
            credentials.name,
            unique_id, // We just use the first unique identifier.
        ),
        authLevel: {
            basicLevels: new AuthenticationLevel_basicLevels(
                AuthenticationLevel_basicLevels_level_simple,
                localQualifierPoints,
                undefined,
            ),
        },
        pwdResponse: pwd_resp
            ? new PwdResponseValue(
                pwd_resp.warning,
                pwd_resp.error,
            )
            : undefined,
        clearances,
    };
}

/**
 * @summary Attempts Simple Authentication
 * @description
 *
 * This function attempts simple authentication, as defined in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 9.1.2.
 *
 * It checks the validity times `time1` and `time2` as `notBefore` and
 * `notAfter` times for the validity of the authentication attempt.
 *
 * This also performs the Remote Password Checking Procedure as describe in
 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 10.2.7.
 *
 * This variation does not query the remote DSA for the `pwdAttribute`.
 * That would be very hard to fit into how Meerkat DSA works without
 * a lot of complicated changes, and since `userPwd` is the
 * standardized password attribute, no X.500 directories should be
 * using anything else anyway.
 *
 * @param ctx The context object
 * @param BindErrorClass The type of error to be thrown
 * @param credentials The `SimpleCredentials`
 * @param signErrors Whether to sign errors
 * @param localQualifierPoints Local qualifier points (for Authentication Level)
 * @param source The string indicating the source of the authentication attempt
 * @param logInfo Additional logged information
 * @returns Information regarding the bind result
 *
 * @async
 * @function
 */
export
async function attemptSimpleAuth(
    ctx: MeerkatContext,
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
    credentials: SimpleCredentials,
    signErrors: boolean,
    localQualifierPoints: number,
    source: string,
    logInfo: Record<string, any>,
): Promise<BindReturn> {
    const foundEntry = await dnToVertex(ctx, ctx.dit.root, credentials.name);
    if (!credentials.password) {
        if (ctx.config.forbidAnonymousBind) {
            ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
            throw new BindErrorClass(
                ctx.i18n.t("err:anon_bind_disabled"),
                anonymousBindErrorData,
                signErrors,
            );
        }
        const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
        const clearances = foundEntry
            ? await read_clearance(ctx, foundEntry)
            : [];
        return {
            boundVertex: foundEntry,
            boundNameAndUID: new NameAndOptionalUID(
                credentials.name,
                unique_id,
            ),
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    localQualifierPoints,
                    undefined,
                ),
            },
            clearances,
        };
    }
    if (credentials.validity) {
        const now = new Date();
        const minimumTime = credentials.validity.time1
            ? ("utc" in credentials.validity.time1)
                ? credentials.validity.time1.utc
                : credentials.validity.time1.gt
            : undefined;
        const maximumTime = credentials.validity.time2
            ? ("utc" in credentials.validity.time2)
                ? credentials.validity.time2.utc
                : credentials.validity.time2.gt
            : undefined;
        if (minimumTime && (minimumTime.valueOf() > (now.valueOf() + 5000))) { // 5 seconds of tolerance.
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new BindErrorClass(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
            );
        }
        if (maximumTime && (maximumTime.valueOf() < (now.valueOf() - 5000))) { // 5 seconds of tolerance.
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new BindErrorClass(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
            );
        }
    }

    // If this DSA already has this entry, we can just check its password.
    if (foundEntry) {
        const {
            authorized,
            pwdResponse,
            unbind,
        } = await attemptPassword(ctx, foundEntry, credentials);
        if (!authorized) {
            if (pwdResponse?.error === PwdResponseValue_error_passwordExpired) {
                ctx.log.info(ctx.i18n.t("log:dua_bind_pwd_end", {
                    ...logInfo,
                }), logInfo);
                throw new BindErrorClass(
                    ctx.i18n.t("err:pwd_end"),
                    invalidCredentialsData,
                    signErrors,
                    unbind,
                );
            }
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new BindErrorClass(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
                unbind,
            );
        }
        const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
        const clearances = foundEntry
            ? await read_clearance(ctx, foundEntry)
            : [];
        return {
            boundVertex: foundEntry,
            boundNameAndUID: new NameAndOptionalUID(
                getDistinguishedName(foundEntry),
                unique_id, // We just use the first unique identifier.
            ),
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_simple,
                    localQualifierPoints,
                    undefined,
                ),
            },
            pwdResponse,
            clearances,
        };
    }
    // ...otherwise, the entry was not resident in this DSA
    // So we have to perform the remote password checking procedure.
    return remotePasswordCheckingProcedure(
        ctx,
        BindErrorClass,
        credentials,
        signErrors,
        localQualifierPoints,
        source,
        logInfo,
    );
}

import { Context, IndexableOID, Value, Vertex, ClientAssociation, OperationReturn, ChainedError } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import {
    id_sc_subentry,
    id_oc_alias,
    AttributeType,
    Attribute,
    AttributeTypeAndValue,
    id_ar_accessControlSpecificArea,
    id_ar_accessControlInnerArea,
    objectClass,
    aliasedEntryName,
    id_ar_subschemaAdminSpecificArea,
    Context as X500Context,
    id_ar_pwdAdminSpecificArea,
    pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_AddEntryArgument,
    AddEntryResult,
    _encode_AddEntryResult,
    AddEntryResultData,
    _encode_AddEntryResultData,
    UpdateErrorData,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_insufficientPasswordQuality,
    ServiceControlOptions_manageDSAIT,
    SecurityErrorData,
    ServiceErrorData,
    updateError,
    securityError,
    serviceError,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
    ServiceProblem_timeLimitExceeded,
    AbandonedData,
    abandoned,
    ProtectionRequest_signed,
    ErrorProtectionRequest_signed,
    AttributeProblem_constraintViolation,
    AttributeErrorData,
    AttributeErrorData_problems_Item,
    attributeError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ASN1Element,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
    unpackBits,
} from "@wildboar/asn1";
import { getRDN } from "@wildboar/x500";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import {
    ChainingResults,
} from "@wildboar/x500/DistributedOperations";
import { createDse } from "../database/createEntry";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import {
    bacACDF,
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_addEntry,
} from "@wildboar/x500/CommonProtocolSpecification";
import establishSubordinate from "../dop/establishSubordinate";
import { addSeconds, differenceInMilliseconds } from "date-fns";
import { getDateFromTime } from "@wildboar/x500";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import { codeToString } from "@wildboar/x500";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import { naddrToURI } from "@wildboar/x500";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { subschema } from "@wildboar/x500/SchemaAdministration";
import { checkNameForm } from "@wildboar/x500";
import failover from "../utils/failover";
import getACIItems from "../authz/getACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import { id_ar_autonomousArea } from "@wildboar/x500/InformationFramework";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import preprocessTuples from "../authz/preprocessTuples";
import groupByOID from "../utils/groupByOID";
import rdnToID from "../dit/rdnToID";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import { userPwd } from "@wildboar/x500/PasswordPolicy";
import { userPassword } from "@wildboar/x500/AuthenticationFramework";
import { dseType } from "@wildboar/x500/DSAOperationalAttributeTypes";
import isOperationalAttributeType from "../x500/isOperationalAttributeType";
import becomeSuperior from "../dop/establish/becomeSuperior";
import {
    hierarchicalOperationalBinding,
    HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import getDistinguishedName from "../x500/getDistinguishedName";
import saveAccessPoint from "../database/saveAccessPoint";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import { rdnToJson } from "../x500/rdnToJson";
import { getDateFromOBTime } from "../dop/getDateFromOBTime";
import { printInvokeId } from "../utils/printInvokeId";
import { validateEntry } from "../x500/validateNewEntry";
import { ChainingArguments } from "@wildboar/x500/DistributedOperations";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { stringifyDN } from "../x500/stringifyDN";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import {
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import { compareAuthenticationLevel, compareDistinguishedName } from "@wildboar/x500";
import { UserPwd } from "@wildboar/x500/PasswordPolicy";
import {
    checkPasswordQuality,
    CHECK_PWD_QUALITY_OK,
} from "../password/checkPasswordQuality";
import { bindForChaining } from "../net/bindToOtherDSA";
import { dSAProblem } from "@wildboar/x500/SelectedAttributeTypes";
import { id_pr_targetDsaUnavailable } from "@wildboar/x500/SelectedAttributeTypes";
import DSPAssociation from "../dsp/DSPConnection";
import { getShadowIncrementalSteps } from "../dop/getRelevantSOBs";
import { SubordinateChanges } from "@wildboar/x500/DirectoryShadowAbstractService";
import { saveIncrementalRefresh } from "../disp/saveIncrementalRefresh";
import { acdf } from "../authz/acdf";

const ID_AUTONOMOUS: string = id_ar_autonomousArea.toString();
const ID_AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
const ID_AC_INNER: string = id_ar_accessControlInnerArea.toString();
const ID_AR_SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();

function namingViolationErrorData (
    ctx: Context,
    assn: ClientAssociation,
    attributeTypes: AttributeType[],
    signErrors: boolean,
    aliasDereferenced?: boolean,
): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        createSecurityParameters(
            ctx,
            signErrors,
            assn.boundNameAndUID?.dn,
            undefined,
            updateError["&errorCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        aliasDereferenced,
        undefined,
    );
}

/**
 * @summary The addEntry operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `addEntry` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 12.1. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.1.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function addEntry (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const now = new Date();
    if (assn.subentriesCacheExpiration <= now) {
        assn.subentriesCache.clear();
        assn.subentriesCacheExpiration = addSeconds(now, 10);
    }
    const argument = _decode_AddEntryArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     *
     * Meerkat DSA allows operations with invalid signatures to progress
     * through all pre-operation-evaluation procedures leading up to operation
     * evaluation, but with `AuthenticationLevel.basicLevels.signed` set to
     * `FALSE` so that access controls are still respected. Therefore, if we get
     * to this point in the code, and the argument is signed, but the
     * authentication level has the `signed` field set to `FALSE`, we throw an
     * `invalidSignature` error.
     */
    if (
        ("signed" in argument)
        && state.chainingArguments.authenticationLevel
        && ("basicLevels" in state.chainingArguments.authenticationLevel)
        && !state.chainingArguments.authenticationLevel.basicLevels.signed
    ) {
        const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
        const logInfo = {
            context: "arg",
            host: remoteHostIdentifier,
            aid: assn.id,
            iid: printInvokeId(state.invokeId),
            ap: stringifyDN(ctx, requestor ?? []),
        };
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
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
    // #endregion Signature validation
    const targetDN = data.object.rdnSequence;
    const rdn = getRDN(targetDN);
    if (!rdn) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:root_dse_may_not_be_added"),
            namingViolationErrorData(ctx, assn, [], signErrors, state.chainingArguments.aliasDereferenced),
            signErrors,
        );
    }
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const immediateSuperior = state.foundDSE;
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const values: Value[] = data.entry.flatMap(valuesFromAttribute);
    const objectClassValues = data.entry.filter((attr) => attr.type_.isEqualTo(objectClass["&id"]));
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.flatMap((a) => a.values).map((ocv) => ocv.objectIdentifier);
    const objectClassesIndex: Set<IndexableOID> = new Set(objectClasses.map((oc) => oc.toString()));
    const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);

    const {
        structuralObjectClass,
        governingStructureRule,
    } = await validateEntry(
        ctx,
        assn,
        immediateSuperior,
        targetDN,
        rdn,
        data.entry,
        state.chainingArguments.aliasDereferenced ?? ChainingArguments._default_value_for_aliasDereferenced,
        manageDSAIT,
        state.invokeId,
        assn.subentriesCache,
        // If this entry is going to wind up in another DSA, it is up to that
        // DSA to determine if any schema is unrecognized.
        Boolean(data.targetSystem),
        signErrors,
    );

    /**
     * From ITU X.501 (2016), Section 13.3.2:
     *
     * > There shall be one value of the objectClass attribute for the entry's
     * > structural object class and a value for each of its superclasses. top
     * > may be omitted.
     *
     * This means that we can determine if this potential new entry is a
     * subentry by checking that the `subentry` object class is present.
     */
    const isSubentry: boolean = objectClassesIndex.has(id_sc_subentry.toString());
    const isSubschemaSubentry: boolean = isSubentry && objectClasses.some((oc) => oc.isEqualTo(subschema["&id"]));
    const relevantSubentries: Vertex[] = ctx.config.bulkInsertMode
        ? []
        : (await Promise.all(
            state.admPoints.map((ap) => getRelevantSubentries(
                ctx,
                objectClasses,
                targetDN,
                ap,
                undefined,
                assn.subentriesCache,
            )),
        )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = await getACIItems(
        ctx,
        accessControlScheme,
        immediateSuperior,
        undefined,
        relevantSubentries,
        isSubentry,
    );
    const acdfTuples: ACDFTuple[] = ctx.config.bulkInsertMode
        ? []
        : (relevantACIItems ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = ctx.config.bulkInsertMode
        ? []
        : await preprocessTuples(
            accessControlScheme,
            acdfTuples,
            user,
            state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
            targetDN,
            isMemberOfGroup,
            NAMING_MATCHER,
        );
    if (!ctx.config.bulkInsertMode && accessControlScheme) {
        const authorized = acdf(
            ctx,
            accessControlScheme,
            assn,
            immediateSuperior, // This basically doesn't matter, because addingEntry is true.
            [PERMISSION_CATEGORY_ADD],
            relevantTuples,
            user,
            {
                entry: objectClasses,
                siblingsCount: !immediateSuperior.dse.immSupr
                    ? await ctx.db.entry.count({
                        where: {
                            immediate_superior_id: immediateSuperior.dse.id,
                            ...getEntryExistsFilter(),
                        },
                    })
                    : undefined,
            },
            bacSettings,
            true,
            true,
        );
        if (!authorized) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_to_add_entry"),
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

    /**
     * This section checks that the immediate superior is a DSE type under which
     * we can add subordinates. If the user is not permitted to discover the DSE
     * type of the superior, we return an insufficientAccessRights error instead
     * of a namingViolation to avoid disclosing the DSE type of the immediate
     * superior.
     *
     * NOTE: This was copied over to modifyDN.
     */
    if (
        immediateSuperior.dse.alias
        || immediateSuperior.dse.subr
        || immediateSuperior.dse.subentry
        || immediateSuperior.dse.shadow
        || immediateSuperior.dse.sa
        || immediateSuperior.dse.dsSubentry
    ) {
        if (!ctx.config.bulkInsertMode && accessControlScheme) {
            const relevantACIItemsForSuperior = await getACIItems(
                ctx,
                accessControlScheme,
                immediateSuperior.immediateSuperior,
                immediateSuperior,
                relevantSubentries,
                !!immediateSuperior.dse.subentry,
            );
            const acdfTuplesForSuperior: ACDFTuple[] = (relevantACIItemsForSuperior ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuplesForSuperior: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuplesForSuperior,
                user,
                state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                targetDN.slice(0, -1),
                isMemberOfGroup,
                NAMING_MATCHER,
            );

            const superiorObjectClasses = Array
                .from(immediateSuperior.dse.objectClass)
                .map(ObjectIdentifier.fromString);
            const authorizedToReadSuperior = acdf(
                ctx,
                accessControlScheme,
                assn,
                immediateSuperior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                { entry: superiorObjectClasses },
                bacSettings,
                true,
            );

            const notAuthData = new SecurityErrorData(
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
            );

            // If the user is not authorized to read the superior at all, just
            // throw insufficientAccessRights.
            if (!authorizedToReadSuperior) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }

            const authorizedToReadSuperiorDSEType = acdf(
                ctx,
                accessControlScheme,
                assn,
                immediateSuperior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: dseType["&id"],
                    operational: true,
                },
                bacSettings,
                true,
            );

            // TODO: We do not check that the user has permission to the DSEType value!
            // const superiorDSEType = await readValuesOfType(ctx, immediateSuperior, dseType["&id"])[0];
            const authorizedToReadSuperiorObjectClasses = acdf(
                ctx,
                accessControlScheme,
                assn,
                immediateSuperior,
                [ PERMISSION_CATEGORY_READ ],
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: objectClass["&id"],
                    operational: false,
                },
                bacSettings,
                true,
            );
            const superiorObjectClassesAuthorized = superiorObjectClasses
                .filter((oc) => acdf(
                    ctx,
                    accessControlScheme,
                    assn,
                    immediateSuperior,
                    [ PERMISSION_CATEGORY_READ ],
                    relevantTuplesForSuperior,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            objectClass["&id"],
                            _encodeObjectIdentifier(oc, DER),
                        ),
                        operational: false,
                    },
                    bacSettings,
                    true,
                ));

            if (
                (immediateSuperior.dse.alias || immediateSuperior.dse.sa) // superior is some kind of alias, and...
                // // the user does not have one of the basic permissions that
                // // could be used to determine that it is an alias.
                && (
                    !authorizedToReadSuperiorDSEType
                    && !(
                        authorizedToReadSuperiorObjectClasses
                        && superiorObjectClassesAuthorized.some((oc) => oc.isEqualTo(id_oc_alias))
                    )
                    && !(bacACDF(
                        relevantTuplesForSuperior,
                        user,
                        {
                            attributeType: aliasedEntryName["&id"],
                            operational: false,
                        },
                        [ PERMISSION_CATEGORY_READ ],
                        bacSettings,
                        true,
                    ).authorized)
                )
            ) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }

            if (
                // superior is some kind of subentry, and...
                (immediateSuperior.dse.subentry || immediateSuperior.dse.dsSubentry)
                // the user does not have one of the basic permissions that
                // could be used to determine that it is a subentry.
                && (
                    !authorizedToReadSuperiorDSEType
                    && !(
                        authorizedToReadSuperiorObjectClasses
                        && superiorObjectClassesAuthorized.some((oc) => oc.isEqualTo(id_sc_subentry))
                    )
                )
                // NOTE: We don't check for other attribute types, like
                // `subtreeSpecification`, because technically, those could
                // appear in non-subentries too.
            ) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
                    notAuthData,
                    signErrors,
                );
            }
        }
        // If there was no authorization issue with revealing the DSE type of the
        // superior, or if the superior was of DSE type shadow or subr, we can
        // just return the true error: namingViolation.
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_authz_to_add_entry"),
            namingViolationErrorData(
                ctx,
                assn,
                [],
                signErrors,
                state.chainingArguments.aliasDereferenced,
            ),
            signErrors,
        );
    }
    // This check has been removed because there might be times when you want to
    // add a subentry and plan to make the superior an admin point after.
    // NOTE: The error message has been deleted, too.
    // if (isSubentry && !immediateSuperior.dse.admPoint) {
    //     throw new errors.UpdateError(
    //         ctx.i18n.t("err:cannot_add_subentry_below_non_admpoint"),
    //         new UpdateErrorData(
    //             UpdateProblem_namingViolation,
    //             undefined,
    //             [],
    //             createSecurityParameters(
    //                 ctx,
    //                 assn.boundNameAndUID?.dn,
    //                 undefined,
    //                 updateError["&errorCode"],
    //             ),
    //             ctx.dsa.accessPoint.ae_title.rdnSequence,
    //             state.chainingArguments.aliasDereferenced,
    //             undefined,
    //         ),
    //     );
    // }
    /**
     * Adding subentries in other DSAs is expressly forbidden by ITU
     * Recommendation X.518 (2019), Section 19.1.1, item 4.
     */
    if (isSubentry && data.targetSystem) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_add_subentry_in_another_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
                undefined,
                [],
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

    if (!ctx.config.bulkInsertMode) {
        const existingEntryId = await rdnToID(ctx, immediateSuperior.dse.id, rdn);
        if (existingEntryId !== undefined) {
            const existing_dbe = await ctx.db.entry.findUnique({
                where: {
                    id: existingEntryId,
                },
                include: {
                    RDN: {
                        select: {
                            type_oid: true,
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                    },
                    EntryObjectClass: {
                        select: {
                            object_class: true,
                        },
                    },
                },
            });
            // This could happen if the entry is deleted within the tiny span of
            // time between us finding the entry's ID and querying it.
            if (!existing_dbe) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
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
            const existing = await vertexFromDatabaseEntry(ctx, immediateSuperior, existing_dbe);
            const effectiveAccessControlScheme = existing.dse.admPoint?.accessControlScheme
                ?? accessControlScheme;
            if ( // If access control does not apply to the existing entry,...
                !effectiveAccessControlScheme
            ) { // We can inform the user that it does not exist; no need to do any more work.
                throw new errors.UpdateError(
                    ctx.i18n.t("err:entry_already_exists", {
                        context: "with_dn",
                        dn: stringifyDN(ctx, targetDN).slice(0, 512),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_entryAlreadyExists,
                        undefined,
                        [],
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
            const effectiveRelevantSubentries = existing.dse.admPoint?.administrativeRole.has(ID_AUTONOMOUS)
                ? []
                : [ ...relevantSubentries ]; // Must spread to create a new reference. Otherwise...
            if (existing.dse.admPoint?.administrativeRole.has(ID_AC_SPECIFIC)) { // ... (keep going)
                effectiveRelevantSubentries.length = 0; // ...this will modify the target-relevant subentries!
                effectiveRelevantSubentries.push(...(await getRelevantSubentries(
                    ctx,
                    existing,
                    targetDN,
                    existing,
                    undefined,
                    assn.subentriesCache,
                )));
            } else if (existing.dse.admPoint?.administrativeRole.has(ID_AC_INNER)) {
                effectiveRelevantSubentries.push(...(await getRelevantSubentries(
                    ctx,
                    existing,
                    targetDN,
                    existing,
                    undefined,
                    assn.subentriesCache,
                )));
            }
            const subordinateACI = await getACIItems(
                ctx,
                effectiveAccessControlScheme,
                existing.immediateSuperior,
                existing,
                effectiveRelevantSubentries,
                Boolean(existing.dse.subentry),
            );
            const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantSubordinateTuples: ACDFTupleExtended[] = await preprocessTuples(
                effectiveAccessControlScheme,
                subordinateACDFTuples,
                user,
                state.chainingArguments.authenticationLevel ?? UNTRUSTED_REQ_AUTH_LEVEL,
                targetDN,
                isMemberOfGroup,
                NAMING_MATCHER,
            );
            const authorizedToKnowAboutExistingEntry: boolean = acdf(
                ctx,
                effectiveAccessControlScheme,
                assn,
                existing,
                [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                relevantSubordinateTuples,
                user,
                {
                    entry: Array.from(existing.dse.objectClass).map(ObjectIdentifier.fromString),
                },
                bacSettings,
                true,
            );
            if (authorizedToKnowAboutExistingEntry) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:entry_already_exists", {
                        context: "with_dn",
                        dn: stringifyDN(ctx, targetDN).slice(0, 512),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_entryAlreadyExists,
                        undefined,
                        [],
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
            } else {
                /**
                 * If the user is not authorized to know about the existing
                 * entry, we just report a more generic unauthorized error.
                 *
                 * If a user has permission to add an entry beneath the the
                 * target's immediate superior, they could still try adding
                 * similar entries with only variation in name to determine if
                 * they were denied because the entry already exists. Still,
                 * this is a somewhat unlikely scenario, and if they already
                 * have access to add entries, this outcome is kind of
                 * unavoidable anyway.
                 */
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_add_entry"),
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
    }
    const timeRemainingInMilliseconds = timeLimitEndTime
        ? differenceInMilliseconds(timeLimitEndTime, new Date())
        : undefined;
    if (!ctx.config.bulkInsertMode && immediateSuperior.dse.nssr) {
        await checkIfNameIsAlreadyTakenInNSSR(
            ctx,
            assn,
            state.invokeId,
            state.chainingArguments.aliasDereferenced ?? false,
            immediateSuperior.dse.nssr?.nonSpecificKnowledge ?? [],
            targetDN,
            timeRemainingInMilliseconds,
        );
    }
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:time_limit"),
            new ServiceErrorData(
                ServiceProblem_timeLimitExceeded,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    if (!ctx.config.bulkInsertMode && accessControlScheme) {
        const maxValueCountInUse: boolean = relevantTuples
            .some((tuple) => (tuple[2].maxValueCount !== undefined));
        const valueCountByAttribute: Map<IndexableOID, number> = maxValueCountInUse
            ? new Map(
                Object.entries(groupByOID(data.entry, (d) => d.type_))
                    .map(([ key, attributes ]) => [
                        key,
                        attributes
                            .map((attr) => (
                                attr.values.length
                                + (attr.valuesWithContext?.length ?? 0)
                            ))
                            .reduce((acc, curr) => acc + curr, 0)
                    ]),
            )
            : new Map();
        for (const attr of data.entry) {
            const authorizedToAddAttributeType = acdf(
                ctx,
                accessControlScheme,
                assn,
                immediateSuperior,
                [ PERMISSION_CATEGORY_ADD ],
                relevantTuples,
                user,
                {
                    attributeType: attr.type_,
                    valuesCount: valueCountByAttribute.get(attr.type_.toString()),
                    operational: isOperationalAttributeType(ctx, attr.type_),
                },
                bacSettings,
                true,
                true,
            );
            if (!authorizedToAddAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_create_attr_type", {
                        type: attr.type_.toString(),
                    }),
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
        for (const value of values) {
            const authorizedToAddAttributeValue = acdf(
                ctx,
                accessControlScheme,
                assn,
                immediateSuperior,
                [ PERMISSION_CATEGORY_ADD ],
                relevantTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                    contexts: value.contexts?.map((context) => new X500Context(
                        context.contextType,
                        context.contextValues,
                        context.fallback,
                    )),
                    operational: isOperationalAttributeType(ctx, value.type),
                },
                bacSettings,
                true,
                true,
            );
            if (!authorizedToAddAttributeValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_to_create_attr_value", {
                        type: value.type.toString(),
                    }),
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
    }

    if (data.targetSystem && !compareDistinguishedName(
        data.targetSystem.ae_title.rdnSequence,
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        NAMING_MATCHER,
    )) {
        const insufficientAuthForChaining = assn && (
            (
                ("basicLevels" in assn.authLevel)
                && (compareAuthenticationLevel( // Returns true if a > b.
                    ctx.config.chaining.minAuthRequired,
                    assn.authLevel.basicLevels,
                ))
            )
            || !("basicLevels" in assn.authLevel)
        );
        if (insufficientAuthForChaining) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_chaining", {
                    aid: assn.id,
                    context: "add_entry_target_system",
                }),
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

        const targetSystem = data.targetSystem;
        const targetSystem_refers_to_non_specific_subordinate_dsa: boolean = !!(
            immediateSuperior.dse.nssr
                ?.nonSpecificKnowledge
                .some((nssk) => nssk
                    .some((mosap) => compareDistinguishedName(
                        mosap.ae_title.rdnSequence,
                        targetSystem.ae_title.rdnSequence,
                        NAMING_MATCHER,
                    )))
        );
        // DEVIATION: This is not defined in the specifications.
        if (targetSystem_refers_to_non_specific_subordinate_dsa) {
            const dsp_client = await bindForChaining(
                ctx,
                assn,
                op,
                targetSystem,
                state.chainingArguments.aliasDereferenced,
                signErrors,
            );
            if (!dsp_client) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:could_not_add_entry_to_remote_dsa"),
                    new ServiceErrorData(
                        ServiceProblem_unavailable,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        [
                            new Attribute(
                                dSAProblem["&id"],
                                [dSAProblem.encoderFor["&Type"]!(id_pr_targetDsaUnavailable, DER)],
                            ),
                        ],
                    ),
                    signErrors,
                );
            }
            /* Instead of using the APInfo Procedure, we just use the X.500
            Client SDK, since this is non-standard behavior anyway. */
            const outcome = await dsp_client.addEntry({
                ...argument,
                object: data.object,
                entry: data.entry,
                chaining: state.chainingArguments,
            });
            // TODO: Log
            // dsp_client.unbind().then().catch();
            // if (dsp_client.rose.socket?.writable) {
            //     dsp_client.rose.socket?.end(); // Unbind does not necessarily close the socket.
            // }
            if ("result" in outcome) {
                return {
                    result: outcome.result.parameter,
                    stats: {
                        request: ctx.config.bulkInsertMode
                            ? undefined
                            : failover(() => ({
                                operationCode: codeToString(id_opcode_addEntry),
                                ...getStatisticsFromCommonArguments(data),
                                targetNameLength: targetDN.length,
                            }), undefined),
                    },
                };
            }
            else if ("error" in outcome) {
                // TODO: Attempt to decode the error so some information about it can be logged.
                throw new ChainedError(
                    ctx.i18n.t("err:chained_error"),
                    outcome.error.parameter,
                    outcome.error.code,
                    signErrors,
                );
            }
            else if (("reject" in outcome) || ("abort" in outcome)) {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:could_not_add_entry_to_remote_dsa"),
                    new ServiceErrorData(
                        ServiceProblem_unwillingToPerform,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            // else if ("timeout" in outcome) {
            //     throw new Error();
            // }
            // else if ("other" in outcome) {
            //     throw new Error();
            // }
            else {
                throw new errors.ServiceError(
                    ctx.i18n.t("err:could_not_add_entry_to_remote_dsa"),
                    new ServiceErrorData(
                        ServiceProblem_unwillingToPerform,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            serviceError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        [
                            new Attribute(
                                dSAProblem["&id"],
                                [dSAProblem.encoderFor["&Type"]!(id_pr_targetDsaUnavailable, DER)],
                            ),
                        ],
                    ),
                    signErrors,
                );
            }
        }

        const { arg: obArg, response: obResponse } = await establishSubordinate(
            ctx,
            immediateSuperior,
            undefined,
            rdn,
            data.entry,
            data.targetSystem,
            signErrors,
            state.chainingArguments.aliasDereferenced,
            {
                timeLimitInMilliseconds: timeRemainingInMilliseconds,
            },
        );
        if (!(("result" in obResponse) && obResponse.result)) {
            // You have to throw a service error, because this is a DOP response
            // which does not really share errors with DAP or DSP.
            throw new errors.ServiceError(
                ctx.i18n.t("err:could_not_add_entry_to_remote_dsa"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const result = obResponse.result.parameter;
        const resultData = getOptionallyProtectedValue(result);
        // NOTE: The signature is verified in `establishSubordinate()`.
        if (!("roleB_replies" in resultData.initiator)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:received_malformed_dop_response"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const sub2sup = hierarchicalOperationalBinding["&roleB"]!
            .decoderFor["&EstablishParam"]!(resultData.initiator.roleB_replies);
        if (resultData.bindingID?.identifier === undefined) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:no_binding_id_assigned"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const now = new Date();
        const validFrom = (
            obArg.valid?.validFrom
            && ("time" in obArg.valid.validFrom)
            && !(obArg.valid.validFrom instanceof ASN1Element)
        )
            ? getDateFromOBTime(obArg.valid.validFrom.time)
            : now;
        const validUntil = (
            obArg.valid?.validUntil
            && ("time" in obArg.valid.validUntil)
            && !(obArg.valid.validUntil instanceof ASN1Element)
        )
            ? getDateFromOBTime(obArg.valid.validUntil.time)
            : undefined;
        const agreement = new HierarchicalAgreement(
            rdn,
            getDistinguishedName(immediateSuperior),
        );
        const accessPointId: number = await saveAccessPoint(
            ctx,
            resultData.accessPoint,
            Knowledge.SPECIFIC,
        );
        const createdOB = await ctx.db.operationalBinding.create({
            data: {
                accepted: true,
                outbound: true,
                binding_type: hierarchicalOperationalBinding["&id"]!.toString(),
                binding_identifier: Number(resultData.bindingID.identifier),
                binding_version: (resultData.bindingID.version !== undefined)
                    ? Number(resultData.bindingID.version)
                    : 0,
                agreement_ber: Buffer.from(
                    hierarchicalOperationalBinding.encoderFor["&Agreement"]!(agreement, DER).toBytes()
                ),
                access_point: {
                    connect: {
                        id: accessPointId,
                    },
                },
                initiator: OperationalBindingInitiator.ROLE_A,
                initiator_ber: Buffer.from(_encode_SuperiorToSubordinate(obArg.initiator, DER).toBytes()),
                validity_start: validFrom,
                validity_end: validUntil,
                new_context_prefix_rdn: rdnToJson(agreement.rdn),
                immediate_superior: agreement.immediateSuperior.map(rdnToJson),
                requested_time: new Date(),
            },
            select: {
                uuid: true,
            },
        });
        try {
            await becomeSuperior(
                ctx,
                assn,
                obResponse.result.invoke_id,
                agreement,
                sub2sup,
                signErrors,
            );
        } catch (e) {
            // TODO: Terminate the OB
            ctx.db.operationalBinding.update({
                where: {
                    uuid: createdOB.uuid,
                },
                data: {
                    accepted: false,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            })
                .then()
                .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob"), e));
            throw e;
        }
        /**
         * Yes, it is kind of wasteful to query for this entry by RDN
         * instead of merely returning its ID from `becomeSuperior`, but
         * doing so would (1) break consistency between `becomeSuperior()`
         * and `becomeSubordinate()` and (2) it serves as a good smoke test
         * to see if we can actually find the entry we just created by its
         * RDN.
         */
        const createdSubrId = await rdnToID(ctx, immediateSuperior.dse.id, rdn);
        if (createdSubrId === undefined) {
            ctx.db.operationalBinding.update({
                where: {
                    uuid: createdOB.uuid,
                },
                data: {
                    accepted: false,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            })
                .then()
                .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_cancel_ob"), e));
            throw new errors.UnknownError(ctx.i18n.t("err:could_not_find_new_subr"));
        }
        await ctx.db.operationalBinding.update({
            where: {
                uuid: createdOB.uuid,
            },
            data: {
                entry_id: createdSubrId,
            },
        });
        await ctx.db.accessPoint.update({
            where: {
                id: accessPointId,
            },
            data: {
                entry_id: createdSubrId,
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        });
        const signDSPResult: boolean = (
            (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
            && assn.authorizedForSignedResults
        );
        return {
            result: {
                unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                    new ChainingResults(
                        state.chainingResults.info,
                        state.chainingResults.crossReferences,
                        createSecurityParameters(
                            ctx,
                            signDSPResult,
                            assn.boundNameAndUID?.dn,
                            id_opcode_addEntry,
                        ),
                        state.chainingResults.alreadySearched,
                    ),
                    _encode_AddEntryResult({
                        null_: null,
                    }, DER),
                ),
            },
            stats: {
                request: ctx.config.bulkInsertMode
                    ? undefined
                    : failover(() => ({
                        operationCode: codeToString(id_opcode_addEntry),
                        ...getStatisticsFromCommonArguments(data),
                        targetNameLength: targetDN.length,
                        targetSystemNSAPs: data.targetSystem
                            ? data.targetSystem.address.nAddresses
                                .map(naddrToURI)
                                .filter((addr): addr is string => !!addr)
                            : undefined,
                    }), undefined),
            }
        };
    }

    // #region Password Policy Verification
    let password: UserPwd | undefined;
    for (const attr of data.entry) {
        if (
            !attr.type_.isEqualTo(userPwd["&id"])
            && !attr.type_.isEqualTo(userPassword["&id"])
        ) {
            continue;
        }
        const values = [
            ...attr.values,
            ...attr.valuesWithContext?.map((vwc) => vwc.value) ?? [],
        ];
        // userPassword is not technically single-valued, but its usage for
        // the other values are for password history, which a new entry
        // should not have.
        if (password || (values.length !== 1)) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:multiple_passwords_supplied"),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_constraintViolation,
                            attr.type_,
                            undefined,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        undefined,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        const encoded = values[0];
        password = attr.type_.isEqualTo(userPwd["&id"])
            ? userPwd.decoderFor["&Type"]!(encoded)
            : {
                clear: Buffer.from(encoded.octetString).toString("utf-8"),
            };
    }
    // TODO: Password policy applies _per password attribute_. This is something I'll
    // have to change when I re-write Meerkat DSA entirely.
    const pwdAdminPoint = state.admPoints
        .find((ap) => ap.dse.admPoint?.administrativeRole.has(id_ar_pwdAdminSpecificArea.toString()));
    if (pwdAdminPoint && password) {
        const pwdAdminSubentries = relevantSubentries
            .filter((s) => s.dse.objectClass.has(pwdAdminSubentry["&id"].toString()));
        const passwordQualityIsAdministered: boolean = (pwdAdminSubentries.length > 0);

        if (("encrypted" in password) && passwordQualityIsAdministered) {
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
        } else if ("clear" in password) {
            for (const pwsub of pwdAdminSubentries) {
                const checkPwdResult = await checkPasswordQuality(ctx, password.clear, pwsub);
                if (checkPwdResult === CHECK_PWD_QUALITY_OK) {
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

    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:time_limit"),
            new ServiceErrorData(
                ServiceProblem_timeLimitExceeded,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    if (op?.abandonTime) {
        op.events.emit("abandon");
        throw new errors.AbandonError(
            ctx.i18n.t("err:abandoned"),
            new AbandonedData(
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    abandoned["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    /* DEVIATION: This is done to accomodate the creation of new context
    prefixes using chained `addEntry` under an NSSR. */
    const cp: boolean = (
        !!immediateSuperior.dse.immSupr?.specificKnowledge?.length
        && (assn instanceof DSPAssociation)
        && !!assn.boundNameAndUID?.dn?.length
        && immediateSuperior.dse.immSupr.specificKnowledge
            .some((sk) => compareDistinguishedName(
                assn.boundNameAndUID!.dn,
                sk.ae_title.rdnSequence,
                NAMING_MATCHER))
    );
    const newEntry = await createDse(ctx, immediateSuperior, rdn, {
        governingStructureRule: governingStructureRule
            ? Number(governingStructureRule)
            : undefined,
        structuralObjectClass: structuralObjectClass.toString(),
        cp,
    }, data.entry, user?.dn);
    if (isSubentry) {
        assn.subentriesCache.delete(immediateSuperior.dse.id);
    }
    if (!ctx.config.bulkInsertMode) {
        ctx.log.debug(ctx.i18n.t("log:add_entry", {
            aid: assn.id,
            dn: stringifyDN(ctx, targetDN),
            id: newEntry.dse.id,
            uuid: newEntry.dse.uuid,
            euuid: newEntry.dse.entryUUID,
        }));
    }

    /**
     * Because the structure rules, name forms, etc. may have been specified all
     * at once during the creation of the subschema subentry, schema objects may
     * not become recognized by Meerkat DSA in an order that will allow a
     * governing structure rule to be identified for the subschema
     * administrative area's administrative point. (e.g. The DIT structure rules
     * may get inserted in the database before the name forms are indexed.)
     *
     * This means that we cannot rely on attribute drivers to update the
     * governing structure rule of the subschema administrative point. The
     * following section performs this update.
     */
    if (
        isSubschemaSubentry
        && immediateSuperior.dse.admPoint?.administrativeRole.has(ID_AR_SUBSCHEMA)
        && immediateSuperior.dse.structuralObjectClass
    ) { // The immediate superior needs an update to the GSR.
        const structuralRuleThatAppliesToImmediateSuperior = (newEntry.dse.subentry?.ditStructureRules ?? [])
            .find((rule) => {
                if (rule.obsolete) {
                    return false;
                }
                if (rule.superiorStructureRules?.length) {
                    return false;
                }
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (nf.obsolete) {
                    return false;
                }
                if (
                    immediateSuperior.dse.structuralObjectClass
                    && !nf.namedObjectClass.isEqualTo(immediateSuperior.dse.structuralObjectClass)
                ) {
                    return false;
                }
                return checkNameForm(rdn, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (structuralRuleThatAppliesToImmediateSuperior) {
            await ctx.db.entry.update({ // INTENTIONAL_NO_AWAIT
                where: {
                    id: immediateSuperior.dse.id,
                },
                data: {
                    governingStructureRule: Number(structuralRuleThatAppliesToImmediateSuperior.ruleIdentifier),
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }).catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_update_gsr"), e));
        }
    }

    // Update relevant hierarchical operational bindings
    if (!ctx.config.bulkInsertMode && (newEntry.dse.admPoint || newEntry.dse.subentry)) {
        const admPointDN: DistinguishedName = newEntry.dse.admPoint
            ? targetDN
            : targetDN.slice(0, -1);
        updateAffectedSubordinateDSAs(ctx, admPointDN); // INTENTIONAL_NO_AWAIT
        if (newEntry.dse.subentry && newEntry.immediateSuperior?.dse.cp) {
            // DEVIATION:
            // The specification does NOT say that you have to update the
            // superior's subentries for the new CP. Meerkat DSA does this
            // anyway, just without awaiting.
            ctx.jobQueue.push(() => updateSuperiorDSA(
                ctx,
                targetDN.slice(0, -1),
                immediateSuperior,
                state.chainingArguments.aliasDereferenced ?? false,
                undefined,
                signErrors,
            ) // INTENTIONAL_NO_AWAIT
                .then(() => {
                    ctx.log.info(ctx.i18n.t("log:updated_superior_dsa"), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                })
                .catch((e) => {
                    ctx.log.error(ctx.i18n.t("log:failed_to_update_superior_dsa", { e }), {
                        remoteFamily: assn.socket.remoteFamily,
                        remoteAddress: assn.socket.remoteAddress,
                        remotePort: assn.socket.remotePort,
                        association_id: assn.id,
                        invokeID: printInvokeId(state.invokeId),
                    });
                }));
        }
    }

    const sobs = await getShadowIncrementalSteps(ctx, newEntry, { add: data.entry });
    for (const [ sob_id, sob_obid, sob_change ] of sobs) {
        const change = new SubordinateChanges(
            newEntry.dse.rdn,
            sob_change,
        );
        saveIncrementalRefresh(ctx, sob_id, immediateSuperior, change)
            .then() // INTENTIONAL_NO_AWAIT
            .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_save_incremental_update_step", {
                sob_id: sob_obid,
                e,
            })));
    }

    const signResults: boolean = (
        (data.securityParameters?.target === ProtectionRequest_signed)
        && assn.authorizedForSignedResults
    );
    const resultData: AddEntryResultData = new AddEntryResultData(
        [],
        createSecurityParameters(
            ctx,
            signResults,
            assn.boundNameAndUID?.dn,
            id_opcode_addEntry,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: AddEntryResult = signResults
        ? {
            information: (() => {
                const resultDataBytes = _encode_AddEntryResultData(resultData, DER).toBytes();
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
        }
        : {
            information: {
                unsigned: resultData,
            },
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
                        id_opcode_addEntry,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_AddEntryResult(result, DER),
            ),
        },
        stats: {
            request: ctx.config.bulkInsertMode
                ? undefined
                : failover(() => ({
                    operationCode: codeToString(id_opcode_addEntry),
                    ...getStatisticsFromCommonArguments(data),
                    targetNameLength: targetDN.length,
                }), undefined),
        },
    };
}

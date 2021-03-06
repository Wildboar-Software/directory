import { Context, IndexableOID, Value, Vertex, ClientAssociation, OperationReturn } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    _decode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    AddEntryResult,
    _encode_AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
import {
    AddEntryResultData,
    _encode_AddEntryResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResultData.ta";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ASN1Element,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
    unpackBits,
} from "asn1-ts";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import getRDN from "@wildboar/x500/src/lib/utils/getRDN";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult, Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import createEntry from "../database/createEntry";
import {
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    id_opcode_addEntry,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-addEntry.va";
import establishSubordinate from "../dop/establishSubordinate";
import { differenceInMilliseconds } from "date-fns";
import {
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import groupByOID from "../utils/groupByOID";
import rdnToID from "../dit/rdnToID";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import { strict as assert } from "assert";
import { dseType } from "@wildboar/x500/src/lib/collections/attributes";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import isOperationalAttributeType from "../x500/isOperationalAttributeType";
import becomeSuperior from "../dop/establish/becomeSuperior";
import {
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    hierarchicalOperationalBinding,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/hierarchicalOperationalBinding.oa";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import saveAccessPoint from "../database/saveAccessPoint";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import { rdnToJson } from "../x500/rdnToJson";
import { getDateFromOBTime } from "../dop/getDateFromOBTime";
import { printInvokeId } from "../utils/printInvokeId";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import { validateEntry } from "../x500/validateNewEntry";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { stringifyDN } from "../x500/stringifyDN";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";

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
    const objectClassValues = values.filter((attr) => attr.type.isEqualTo(id_at_objectClass));
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.map((ocv) => ocv.value.objectIdentifier);
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
            state.admPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, targetDN, ap)),
        )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = getACIItems(
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
    if (
        !ctx.config.bulkInsertMode
        && accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const { authorized } = bacACDF(
            relevantTuples,
            user,
            {
                entry: objectClasses,
                siblingsCount: !immediateSuperior.dse.immSupr
                    ? await ctx.db.entry.count({
                        where: {
                            immediate_superior_id: immediateSuperior.dse.id,
                            deleteTimestamp: null,
                        },
                    })
                    : undefined,
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            bacSettings,
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
        if (
            !ctx.config.bulkInsertMode
            && accessControlScheme
            && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
        ) {
            const relevantACIItemsForSuperior = getACIItems(
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
            const { authorized: authorizedToReadSuperior } = bacACDF(
                relevantTuplesForSuperior,
                user,
                { entry: superiorObjectClasses },
                [ PERMISSION_CATEGORY_READ ],
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

            const { authorized: authorizedToReadSuperiorDSEType } = bacACDF(
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: dseType["&id"],
                    operational: true,
                },
                [ PERMISSION_CATEGORY_READ ],
                bacSettings,
                true,
            );
            // TODO: We do not check that the user has permission to the DSEType value!
            // const superiorDSEType = await readValuesOfType(ctx, immediateSuperior, dseType["&id"])[0];
            const { authorized: authorizedToReadSuperiorObjectClasses } = bacACDF(
                relevantTuplesForSuperior,
                user,
                {
                    attributeType: objectClass["&id"],
                    operational: false,
                },
                [ PERMISSION_CATEGORY_READ ],
                bacSettings,
                true,
            );
            const superiorObjectClassesAuthorized = superiorObjectClasses
                .filter((oc) => bacACDF(
                    relevantTuplesForSuperior,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            objectClass["&id"],
                            _encodeObjectIdentifier(oc, DER),
                        ),
                        operational: false,
                    },
                    [ PERMISSION_CATEGORY_READ ],
                    bacSettings,
                    true,
                ).authorized);

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
                || !accessControlSchemesThatUseACIItems.has(effectiveAccessControlScheme.toString())
            ) { // We can inform the user that it does not exist; no need to do any more work.
                throw new errors.UpdateError(
                    ctx.i18n.t("err:entry_already_exists"),
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
                effectiveRelevantSubentries.push(...(await getRelevantSubentries(ctx, existing, targetDN, existing)));
            } else if (existing.dse.admPoint?.administrativeRole.has(ID_AC_INNER)) {
                effectiveRelevantSubentries.push(...(await getRelevantSubentries(ctx, existing, targetDN, existing)));
            }
            const subordinateACI = getACIItems(
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
            const { authorized: authorizedToKnowAboutExistingEntry } = bacACDF(
                relevantSubordinateTuples,
                user,
                {
                    entry: Array.from(existing.dse.objectClass).map(ObjectIdentifier.fromString),
                },
                [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                bacSettings,
                true,
            );
            if (authorizedToKnowAboutExistingEntry) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:entry_already_exists"),
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

    if (
        !ctx.config.bulkInsertMode
        && accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
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
            const { authorized: authorizedToAddAttributeType } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: attr.type_,
                    valuesCount: valueCountByAttribute.get(attr.type_.toString()),
                    operational: isOperationalAttributeType(ctx, attr.type_),
                },
                [ PERMISSION_CATEGORY_ADD ],
                bacSettings,
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
            const { authorized: authorizedToAddAttributeValue } = bacACDF(
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
                [PERMISSION_CATEGORY_ADD],
                bacSettings,
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

    // NOTE: This does not actually check if targetSystem is the current DSA.
    // We also do not check if manageDSAIT is set. Even though that would seem
    // to contradict the use of targetSystem, but there's not really any problem
    // here using both.
    if (data.targetSystem) {
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
        const result = establishOperationalBinding.decoderFor["&ResultType"]!(obResponse.result);
        const resultData = getOptionallyProtectedValue(result);
        // TODO: Validate signature.
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
        const obArgData = getOptionallyProtectedValue(obArg);
        assert("roleA_initiates" in obArgData.initiator);
        const now = new Date();
        const validFrom = (
            obArgData.valid?.validFrom
            && ("time" in obArgData.valid.validFrom)
            && !(obArgData.valid.validFrom instanceof ASN1Element)
        )
            ? getDateFromOBTime(obArgData.valid.validFrom.time)
            : now;
        const validUntil = (
            obArgData.valid?.validUntil
            && ("time" in obArgData.valid.validUntil)
            && !(obArgData.valid.validUntil instanceof ASN1Element)
        )
            ? getDateFromOBTime(obArgData.valid.validUntil.time)
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
                    hierarchicalOperationalBinding.encoderFor["&Agreement"]!(agreement, DER).toBytes(),
                ),
                access_point: {
                    connect: {
                        id: accessPointId,
                    },
                },
                initiator: OperationalBindingInitiator.ROLE_A,
                initiator_ber: Buffer.from(obArgData.initiator.roleA_initiates.toBytes()),
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
                obResponse.invokeId,
                agreement,
                sub2sup,
                signErrors,
            );
        } catch (e) {
            ctx.db.operationalBinding.update({
                where: {
                    uuid: createdOB.uuid,
                },
                data: {
                    accepted: false,
                },
            }).then().catch();
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
            }).then().catch();
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
        });
        const signDSPResult: boolean = (
            (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
            && assn.authorizedForSignedResults
        );
        return {
            result: {
                unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                    new ChainingResults(
                        undefined,
                        undefined,
                        createSecurityParameters(
                            ctx,
                            signDSPResult,
                            assn.boundNameAndUID?.dn,
                            id_opcode_addEntry,
                        ),
                        undefined,
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

    const newEntry = await createEntry(ctx, immediateSuperior, rdn, {
        governingStructureRule: governingStructureRule
            ? Number(governingStructureRule)
            : undefined,
        structuralObjectClass: structuralObjectClass.toString(),
    }, values, user?.dn);
    immediateSuperior.subordinates?.push(newEntry);

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
            }).catch(); // TODO: Log
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

    // TODO: Update shadows
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
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        signDSPResult,
                        assn.boundNameAndUID?.dn,
                        id_opcode_addEntry,
                    ),
                    undefined,
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

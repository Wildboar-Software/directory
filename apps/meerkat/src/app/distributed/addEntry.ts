import { Context, IndexableOID, Value, Vertex, ClientAssociation, OperationReturn } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    _decode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_familyRuleViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_contextViolation,
    AttributeProblem_undefinedAttributeType,
    AttributeProblem_constraintViolation,
    AttributeProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { ASN1Element, ObjectIdentifier, OBJECT_IDENTIFIER, TRUE_BIT } from "asn1-ts";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    _encode_AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
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
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
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
import validateObjectClasses from "../x500/validateObjectClasses";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import getStructuralObjectClass from "../x500/getStructuralObjectClass";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import getSubschemaSubentry from "../dit/getSubschemaSubentry";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import extensibleObject from "../ldap/extensibleObject";
import attributeTypesPermittedForEveryEntry from "../x500/attributeTypesPermittedForEveryEntry";
import {
    id_oa_collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-collectiveExclusions.va";
import { id_aca_subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-subentryACI.va";
import { id_aca_prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-prescriptiveACI.va";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import mayAddTopLeveDSE from "../authz/mayAddTopLevelDSE";
import {
    id_aca_accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-accessControlScheme.va";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import groupByOID from "../utils/groupByOID";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import rdnToID from "../dit/rdnToID";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { strict as assert } from "assert";
import {
    subentryNameForm,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentryNameForm.oa";
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

const ALL_ATTRIBUTE_TYPES: string = id_oa_allAttributeTypes.toString();
const ID_AUTONOMOUS: string = id_ar_autonomousArea.toString();
const ID_AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
const ID_AC_INNER: string = id_ar_accessControlInnerArea.toString();

function namingViolationErrorData (
    ctx: Context,
    assn: ClientAssociation,
    attributeTypes: AttributeType[],
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
    const targetDN = data.object.rdnSequence;
    const rdn = getRDN(targetDN);
    if (!rdn) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:root_dse_may_not_be_added"),
            namingViolationErrorData(ctx, assn, [], state.chainingArguments.aliasDereferenced),
        );
    }
    const user = state.chainingArguments.originator
        ? new NameAndOptionalUID(
            state.chainingArguments.originator,
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
    if (objectClassValues.length === 0) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:object_class_not_found"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.map((ocv) => ocv.value.objectIdentifier);
    if (!ctx.config.bulkInsertMode && !validateObjectClasses(ctx, objectClasses)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:invalid_object_classes"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);
    const objectClassesIndex: Set<IndexableOID> = new Set(objectClasses.map((oc) => oc.toString()));

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
    const isAlias: boolean = objectClassesIndex.has(id_oc_alias.toString());
    const isExtensible: boolean = objectClassesIndex.has(extensibleObject.toString());
    const isParent: boolean = objectClassesIndex.has(id_oc_parent.toString());
    const isChild: boolean = objectClassesIndex.has(id_oc_child.toString());
    const isEntry: boolean = (!isSubentry && !isAlias);
    const isFirstLevel: boolean = !!immediateSuperior.dse.root;
    /**
     * It would be impossible to create anything other than first-level DSEs if
     * subentries were not exempt from subschema restrictions, because they must
     * be created before the subschema can be defined!
     *
     * ITU Recommendation X.501 (2016), Section 14.2 states that:
     *
     * > Although subentry and subentryNameForm are specified using the notation
     * > of clause 13, subentries are not regulated by DIT structure or DIT
     * > content rules.
     *
     * However, regarding `subentryNameForm`, Section 14.2.2 states that:
     *
     * > No other name form shall be used for subentries.
     *
     * As such, Meerkat DSA will perform a hard-coded check that subentries have
     * this attribute type exclusively in their RDN.
     */
    const isExemptFromSubschema: boolean = (isSubentry || isFirstLevel);

    if (
        (immediateSuperior.dse.governingStructureRule === undefined) // The immediate superior has no GSR, and...
        && !isExemptFromSubschema
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:no_gsr", { uuid: immediateSuperior.dse.uuid }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    if (
        isSubentry
        && !checkNameForm( // And the name is not valid for a subentry...
            rdn,
            subentryNameForm["&MandatoryAttributes"].map((a) => a["&id"]),
            subentryNameForm["&OptionalAttributes"]?.map((a) => a["&id"]),
        )
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:name_form_invalid", {
                context: "subentry",
            }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    if (isFirstLevel) {
        if (!await mayAddTopLeveDSE(ctx, assn)) {
            ctx.log.debug(ctx.i18n.t("log:not_authz_to_add_top_level", { context: "hint" }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(state.invokeId),
            });
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_to_add_top_level"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
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

    if (isFirstLevel && !data.entry.some((info) => info.type_.isEqualTo(administrativeRole["&id"]))) {
        ctx.log.warn(ctx.i18n.t("log:admin_role_not_present_first_level_dse"), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId(state.invokeId),
        });
        data.entry.push(new Attribute(
            administrativeRole["&id"],
            [_encodeObjectIdentifier(id_ar_autonomousArea, DER)],
            undefined,
        ));
    }

    if (isParent) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_add_object_class_parent"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                [
                    {
                        attribute: new Attribute(
                            id_at_objectClass,
                            [
                                _encodeObjectIdentifier(parent["&id"], DER),
                            ],
                            undefined,
                        ),
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    if (isChild) {
        if (isFirstLevel) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_be_first_level_and_child"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (isAlias) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_be_alias_and_child"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_alias, DER),
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

    if (isParent && isAlias) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_be_parent_and_child"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                [
                    {
                        attribute: new Attribute(
                            id_at_objectClass,
                            [
                                _encodeObjectIdentifier(id_oc_alias, DER),
                                _encodeObjectIdentifier(id_oc_parent, DER),
                            ],
                            undefined,
                        ),
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    const relevantSubentries: Vertex[] = ctx.config.bulkInsertMode
        ? []
        : (await Promise.all(
            state.admPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, targetDN, ap)),
        )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = getACIItems(accessControlScheme, undefined, relevantSubentries, isSubentry);
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
            state.chainingArguments.authenticationLevel ?? assn.authLevel,
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
                        assn.boundNameAndUID?.dn,
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
                undefined,
                relevantSubentries,
                !!immediateSuperior.dse.subentry,
            );
            const acdfTuplesForSuperior: ACDFTuple[] = (relevantACIItemsForSuperior ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuplesForSuperior: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuplesForSuperior,
                user,
                state.chainingArguments.authenticationLevel ?? assn.authLevel,
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
                );
            }
        }
        // If there was no authorization issue with revealing the DSE type of the
        // superior, or if the superior was of DSE type shadow or subr, we can
        // just return the true error: namingViolation.
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_authz_to_add_entry"),
            namingViolationErrorData(ctx, assn, [], state.chainingArguments.aliasDereferenced),
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
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
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
                            assn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
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
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
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
            const subordinateACI = getACIItems(effectiveAccessControlScheme, existing, effectiveRelevantSubentries);
            const subordinateACDFTuples: ACDFTuple[] = (subordinateACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantSubordinateTuples: ACDFTupleExtended[] = await preprocessTuples(
                effectiveAccessControlScheme,
                subordinateACDFTuples,
                user,
                state.chainingArguments.authenticationLevel ?? assn.authLevel,
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
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
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
                            assn.boundNameAndUID?.dn,
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
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
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
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
        return {
            result: {
                unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
                    new ChainingResults(
                        undefined,
                        undefined,
                        createSecurityParameters(
                            ctx,
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

    const missingMandatoryAttributes: Set<IndexableOID> = new Set();
    const optionalAttributes: Set<IndexableOID> = new Set(
        attributeTypesPermittedForEveryEntry.map((oid) => oid.toString()),
    );
    if (isEntry) {
        optionalAttributes.add(id_oa_collectiveExclusions.toString());
        optionalAttributes.add(administrativeRole["&id"].toString());
        optionalAttributes.add(id_aca_accessControlScheme.toString());
        optionalAttributes.add(id_aca_subentryACI.toString());
        optionalAttributes.add(hierarchyParent["&id"].toString());
    }
    if (isSubentry) {
        optionalAttributes.add(id_aca_prescriptiveACI.toString());
    }
    const nonUserApplicationAttributes: AttributeType[] = [];
    if (!ctx.config.bulkInsertMode) {
        if (
            accessControlScheme
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
                                assn.boundNameAndUID?.dn,
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
        }
        for (const value of values) {
            if (
                accessControlScheme
                && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
            ) {
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
                                assn.boundNameAndUID?.dn,
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

        }

        const unrecognizedAttributes: AttributeType[] = [];
        const noUserModAttributes: AttributeType[] = [];
        const dummyAttributes: AttributeType[] = [];
        const collectiveAttributes: AttributeType[] = [];
        const obsoleteAttributes: AttributeType[] = [];
        const incorrectlyMultiValuedAttributes: AttributeType[] = [];
        for (const attr of data.entry) {
            const spec = ctx.attributeTypes.get(attr.type_.toString());
            if (!spec) {
                unrecognizedAttributes.push(attr.type_);
                continue;
            }
            if (spec.usage !== AttributeUsage_userApplications) {
                nonUserApplicationAttributes.push(attr.type_);
            }
            if (spec.noUserModification) {
                noUserModAttributes.push(attr.type_);
            }
            if (spec.dummy) {
                dummyAttributes.push(attr.type_);
            }
            if (spec.collective) {
                collectiveAttributes.push(attr.type_);
                optionalAttributes.add(attr.type_.toString());
            }
            if (spec.obsolete) {
                obsoleteAttributes.push(attr.type_);
            }
            const numberOfValues: number = (attr.values.length + (attr.valuesWithContext?.length ?? 0));
            if (spec.singleValued && (numberOfValues > 1)) {
                incorrectlyMultiValuedAttributes.push(spec.id);
            }
            if (attr.type_.isEqualTo(hierarchyParent["&id"]) && isChild) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:child_cannot_be_in_hierarchy"),
                    new UpdateErrorData(
                        UpdateProblem_familyRuleViolation,
                        [
                            {
                                attribute: attr,
                            },
                            {
                                attribute: new Attribute(
                                    id_at_objectClass,
                                    [
                                        _encodeObjectIdentifier(id_oc_child, DER),
                                    ],
                                    undefined,
                                ),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
        if (
            (unrecognizedAttributes.length > 0)
            || ((noUserModAttributes.length > 0) && !manageDSAIT)
            || (dummyAttributes.length > 0)
            || (!isSubentry && (collectiveAttributes.length > 0))
            || (obsoleteAttributes.length > 0)
            || (incorrectlyMultiValuedAttributes.length > 0)
        ) {
            if (unrecognizedAttributes.length > 0) {
                ctx.log.debug(ctx.i18n.t("err:unrecognized_attribute_type", {
                    oids: unrecognizedAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            if ((noUserModAttributes.length > 0) && !manageDSAIT) {
                ctx.log.debug(ctx.i18n.t("err:no_user_modification", {
                    oids: noUserModAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            if (dummyAttributes.length > 0) {
                ctx.log.debug(ctx.i18n.t("err:cannot_add_dummy_attr", {
                    oids: dummyAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            if (!isSubentry && (collectiveAttributes.length > 0)) {
                ctx.log.debug(ctx.i18n.t("err:cannot_add_collective_attr", {
                    oids: collectiveAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            if (obsoleteAttributes.length > 0) {
                ctx.log.debug(ctx.i18n.t("err:cannot_add_obsolete_attr", {
                    oids: obsoleteAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            if (incorrectlyMultiValuedAttributes.length > 0) {
                ctx.log.debug(ctx.i18n.t("err:single_valued", {
                    oid: incorrectlyMultiValuedAttributes.map((at) => at.toString()).join(", "),
                }));
            }
            const oids: OBJECT_IDENTIFIER[] = [
                ...unrecognizedAttributes,
                ...noUserModAttributes,
                ...dummyAttributes,
                ...collectiveAttributes,
                ...obsoleteAttributes,
                ...incorrectlyMultiValuedAttributes,
            ];
            throw new errors.AttributeError(
                ctx.i18n.t("err:attribute_error_types", {
                    oids: oids.map((oid) => oid.toString()).join(", "),
                }),
                new AttributeErrorData(
                    data.object,
                    [
                        ...unrecognizedAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_undefinedAttributeType,
                                at,
                                undefined,
                            )),
                        ...noUserModAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_constraintViolation,
                                at,
                                undefined,
                            )),
                        ...dummyAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_constraintViolation,
                                at,
                                undefined,
                            )),
                        ...collectiveAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_constraintViolation,
                                at,
                                undefined,
                            )),
                        ...obsoleteAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_constraintViolation,
                                at,
                                undefined,
                            )),
                        ...incorrectlyMultiValuedAttributes
                            .map((at) => new AttributeErrorData_problems_Item(
                                AttributeProblem_invalidAttributeSyntax,
                                at,
                                undefined,
                            )),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

    if (!ctx.config.bulkInsertMode) {
        objectClasses
            .map((oc) => ctx.objectClasses.get(oc.toString()))
            .forEach((oc, i) => {
                const oid = objectClassValues[i].value.objectIdentifier;
                if (!oc) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:unrecognized_object_class", {
                            oid: oid.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(oid, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                if (oc.obsolete) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:cannot_add_obsolete_oc", {
                            oid: oid.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(oid, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                for (const at of oc.mandatoryAttributes) {
                    missingMandatoryAttributes.add(at);
                    optionalAttributes.add(at);
                }
                for (const at of oc.optionalAttributes) {
                    optionalAttributes.add(at);
                }
            });

        const attributeTypes: Set<IndexableOID> = new Set(data.entry.map((attr) => attr.type_.toString()));
        for (const at of attributeTypes.values()) {
            missingMandatoryAttributes.delete(at);
            if (!isExtensible && !optionalAttributes.has(at)) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:attribute_type_not_permitted_by_oc", {
                        oids: at,
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: ObjectIdentifier.fromString(at),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
        if (missingMandatoryAttributes.size > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:missing_mandatory_attributes", {
                    oids: Array.from(missingMandatoryAttributes).join(", "),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    Array.from(missingMandatoryAttributes).map((at) => ({
                        attributeType: ObjectIdentifier.fromString(at),
                    })),
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }

        const attrsFromDN: Value[] = rdn
            .map((atav): Value => ({
                type: atav.type_,
                value: atav.value,
            }));
        const rdnAttributes: Set<IndexableOID> = new Set();
        const duplicatedAFDNs: AttributeType[] = [];
        const unrecognizedAFDNs: AttributeType[] = [];
        const cannotBeUsedInNameAFDNs: AttributeType[] = [];
        const unmatchedAFDNs: AttributeType[] = [];
        for (const afdn of attrsFromDN) {
            const oid: string = afdn.type.toString();
            if (rdnAttributes.has(oid)) {
                duplicatedAFDNs.push(afdn.type);
                continue;
            } else {
                rdnAttributes.add(oid);
            }
            const spec = ctx.attributeTypes.get(afdn.type.toString());
            if (!spec) {
                unrecognizedAFDNs.push(afdn.type);
                continue;
            }
            if (spec.validator) {
                try {
                    spec.validator(afdn.value);
                } catch {
                    throw new errors.NameError(
                        ctx.i18n.t("err:invalid_attribute_syntax", {
                            type: afdn.type.toString(),
                        }),
                        new NameErrorData(
                            NameProblem_invalidAttributeSyntax,
                            {
                                rdnSequence: targetDN,
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            const matcher = getNamingMatcherGetter(ctx)(afdn.type);
            if (!matcher) {
                cannotBeUsedInNameAFDNs.push(afdn.type);
                continue;
            }
            const someAttributeMatched = values.some((attr) => (
                /**
                 * According to ITU Recommendation X.501 (2019), Section 8.5:
                 *
                 * > A distinguished value may have contexts attached, but such
                 * > context information is not part of a distinguished name.
                 *
                 * I have left this code here, but commented out so posterity
                 * can see that distinguished values MAY have contexts.
                 */
                // (!attr.contexts || (attr.contexts.length === 0))
                attr.type.isEqualTo(afdn.type)
                && matcher(attr.value, afdn.value)
            ));
            if (!someAttributeMatched) {
                unmatchedAFDNs.push(afdn.type);
                continue;
            }
        }

        if (duplicatedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_duplicated", {
                    oids: duplicatedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, duplicatedAFDNs, state.chainingArguments.aliasDereferenced),
            );
        }

        if (unrecognizedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_unrecognized", {
                    oids: unrecognizedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, unrecognizedAFDNs, state.chainingArguments.aliasDereferenced),
            );
        }

        if (cannotBeUsedInNameAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_prohibited_in_naming", {
                    oids: cannotBeUsedInNameAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, cannotBeUsedInNameAFDNs, state.chainingArguments.aliasDereferenced),
            );
        }

        if (unmatchedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_values_not_present_in_entry", {
                    oids: unmatchedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, unmatchedAFDNs, state.chainingArguments.aliasDereferenced),
            );
        }
    }

    if (isSubschemaSubentry) {
        const subschemaThatAlreadyExists = await ctx.db.entry.findFirst({
            where: {
                immediate_superior_id: immediateSuperior.dse.id,
                deleteTimestamp: null,
                subentry: true,
                EntryObjectClass: {
                    some: {
                        object_class: subschema["&id"].toString(),
                    },
                },
            },
            select: {
                dseUUID: true,
            },
        });
        if (subschemaThatAlreadyExists) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:one_subschema", {
                    uuid: subschemaThatAlreadyExists.dseUUID,
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        const subtreeSpec = data.entry
            .find((attr) => attr.type_.isEqualTo(subtreeSpecification["&id"]));
        if (subtreeSpec) {
            const ssValues = subtreeSpec.values.length;
            const ssValuesWithContext = (subtreeSpec.valuesWithContext?.length ?? 0);
            if ((ssValues !== 1) || (ssValuesWithContext > 0)) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:subschema_whole_area"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: subtreeSpecification["&id"],
                            }
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            const invalidSubtreeForSubschema = subtreeSpec.values
                .map((v) => _decode_SubtreeSpecification(v))
                .some((ss) => (
                    ((ss.base !== undefined) && (ss.base.length > 0))
                    || ![ undefined, 0 ].includes(ss.minimum as number)
                    || ![ undefined, 0 ].includes(ss.maximum as number)
                    || ss.specificExclusions?.length
                    || ss.specificationFilter
                ));
            if (invalidSubtreeForSubschema) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:subschema_whole_area"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: subtreeSpecification["&id"],
                            }
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
    }

    // Subschema validation
    let governingStructureRule: number | undefined;
    const schemaSubentry = isSubentry // Schema rules only apply to entries.
        ? undefined
        : await getSubschemaSubentry(ctx, immediateSuperior);
    if (!isSubentry && schemaSubentry) { // Schema rules only apply to entries.
        const newEntryIsANewSubschema = objectClasses.some((oc) => oc.isEqualTo(subschema["&id"]));
        assert(schemaSubentry.dse.subentry);
        const structuralRule = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
            .filter((rule) => (
                !rule.obsolete
                && (
                    (
                        newEntryIsANewSubschema
                        && (rule.superiorStructureRules === undefined)
                    )
                    || (
                        !newEntryIsANewSubschema
                        && (immediateSuperior.dse.governingStructureRule !== undefined)
                        && rule.superiorStructureRules?.includes(immediateSuperior.dse.governingStructureRule)
                    )
                )
            ))
            .find((rule) => {
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                    return false;
                }
                if (nf.obsolete) {
                    return false;
                }
                return checkNameForm(rdn, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (!structuralRule) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:no_dit_structural_rules"),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        governingStructureRule = Number(structuralRule.ruleIdentifier);
        const contentRule = (schemaSubentry.dse.subentry?.ditContentRules ?? [])
            .find((rule) => !rule.obsolete && rule.structuralObjectClass.isEqualTo(structuralObjectClass));
        const auxiliaryClasses = objectClasses
            .filter((oc) => ctx.objectClasses.get(oc.toString())?.kind == ObjectClassKind_auxiliary);
        if (contentRule) {
            const permittedAuxiliaries: Set<IndexableOID> = new Set(
                contentRule.auxiliaries?.map((oid) => oid.toString()));
            for (const ac of auxiliaryClasses) {
                if (!permittedAuxiliaries.has(ac.toString())) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:aux_oc_not_permitted_by_dit_content_rule", {
                            aoc: ac.toString(),
                            soc: structuralObjectClass.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(ac, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            /**
             * According to ITU Recommendation X.501 (2016), Section 13.8.2:
             *
             * > the optional components specify user attribute types which an
             * > entry to which the DIT content rule applies may contain in
             * > addition to those which it may contain according to its
             * > structural and auxiliary object classes;
             *
             * Meerkat DSA knowingly will not observe this feature.
             * Circumstantially allowing attributes to be added in spite of the
             * object class constraints would make it difficult to enforce
             * schema. What happens when you move the entry? What happens when
             * you move, change, or remove the content rule? Meerkat DSA does
             * not have to handle these tricky cases, because it will not permit
             * additional attribute types.
             */
            // const optionalAttributes: Set<IndexableOID> = new Set(
            //     contentRule.optional?.map((oid) => oid.toString()));
            const mandatoryAttributesRemaining: Set<IndexableOID> = new Set(
                contentRule.mandatory?.map((oid) => oid.toString()));
            const precludedAttributes: Set<IndexableOID> = new Set(
                contentRule.precluded?.map((oid) => oid.toString()));
            for (const attr of data.entry) {
                mandatoryAttributesRemaining.delete(attr.type_.toString());
                if (precludedAttributes.has(attr.type_.toString())) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:attr_type_precluded", {
                            oid: attr.type_.toString(),
                            soc: structuralObjectClass.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attributeType: attr.type_,
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (mandatoryAttributesRemaining.size > 0) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:dit_content_rule_missing_mandatory_attributes", {
                        soc: structuralObjectClass.toString(),
                        oids: Array.from(mandatoryAttributesRemaining.values()).join(" "),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        Array.from(mandatoryAttributesRemaining.values())
                            .map(ObjectIdentifier.fromString)
                            .map((oid) => ({
                                attributeType: oid,
                            })),
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        } else {
            /**
             * From ITU Recommendation X.501 (2016), Section 13.8.1:
             *
             * > If no DIT content rule is present for a structural object
             * > class, then entries of that class shall contain only the
             * > attributes permitted by the structural object class definition.
             *
             * This implementation will simply check that there are no
             * auxiliary classes at all. Theoretically, this could exclude
             * auxiliary classes that have only optional attributes that overlap
             * with those of the structural object class, but at that point,
             * there is almost no point in including the auxiliary object class.
             */

            if (auxiliaryClasses.length > 0) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:aux_oc_forbidden_because_no_dit_content_rules", {
                        oids: auxiliaryClasses.map((oid) => oid.toString()).join(", "),
                        soc: structuralObjectClass.toString(),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    id_at_objectClass,
                                    auxiliaryClasses
                                        .map((ac) => _encodeObjectIdentifier(ac, DER)),
                                    undefined,
                                ),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }

        const contextUseRules = (schemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        const contextRulesIndex: Map<IndexableOID, DITContextUseDescription> = new Map(
            contextUseRules.map((rule) => [ rule.identifier.toString(), rule ]),
        );
        for (const value of values) {
            const applicableRule = contextRulesIndex.get(value.type.toString())
                ?? contextRulesIndex.get(ALL_ATTRIBUTE_TYPES);
            /**
             * From ITU Recommendation X.501 (2016), Section 13.10.1:
             *
             * > If no DIT Context Use definition is present for a given
             * > attribute type, then values of attributes of that type shall
             * > contain no context lists.
             */
            if (!applicableRule) {
                if (value.contexts && (value.contexts.length > 0)) {
                    throw new errors.AttributeError(
                        ctx.i18n.t("err:no_contexts_permitted", {
                            oid: value.type.toString(),
                        }),
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    value.type,
                                    value.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    continue;
                }
            }

            const mandatoryContextsRemaining: Set<IndexableOID> = new Set(
                applicableRule.information.mandatoryContexts?.map((con) => con.toString()),
            );
            const permittedContexts: OBJECT_IDENTIFIER[] = [
                ...applicableRule.information.mandatoryContexts ?? [],
                ...applicableRule.information.optionalContexts ?? [],
            ];
            const permittedContextsIndex: Set<IndexableOID> = new Set(permittedContexts.map((con) => con.toString()));
            // Add default context values
            for (const contextType of permittedContextsIndex.values()) {
                const contextSpec = ctx.contextTypes.get(contextType);
                if (
                    (contextSpec?.defaultValue)
                    && (
                        !value.contexts?.length // If there are no contexts
                        // Or there are no contexts of the defaulting context type
                        || !value.contexts.some((c) => c.contextType.isEqualTo(contextSpec.id))
                    )
                ) {
                    const defaultValue = contextSpec.defaultValue();
                    const defaultedContext: X500Context = new X500Context(
                        contextSpec.id,
                        [ defaultValue ],
                        undefined,
                    );
                    if (value.contexts) {
                        value.contexts.push(defaultedContext);
                    } else {
                        value.contexts = [ defaultedContext ];
                    }
                }
            }
            for (const context of value.contexts?.values() ?? []) {
                const ID: string = context.contextType.toString();
                mandatoryContextsRemaining.delete(ID);
                if (!permittedContextsIndex.has(ID)) {
                    throw new errors.AttributeError(
                        ctx.i18n.t("err:context_type_prohibited_by_context_use_rule", {
                            ct: ID,
                            at: value.type.toString(),
                        }),
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    value.type,
                                    value.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (mandatoryContextsRemaining.size > 0) {
                throw new errors.AttributeError(
                    ctx.i18n.t("err:missing_required_context_types", {
                        attr: value.type.toString(),
                        oids: Array.from(mandatoryContextsRemaining.values()).join(", "),
                    }),
                    new AttributeErrorData(
                        {
                            rdnSequence: targetDN,
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_contextViolation,
                                value.type,
                                value.value,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
    }
    if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:time_limit"),
            new ServiceErrorData(
                ServiceProblem_timeLimitExceeded,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
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
                    assn.boundNameAndUID?.dn,
                    undefined,
                    abandoned["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    const newEntry = await createEntry(ctx, immediateSuperior, rdn, {
        governingStructureRule,
        structuralObjectClass: structuralObjectClass.toString(),
    }, values, assn.boundNameAndUID?.dn);
    immediateSuperior.subordinates?.push(newEntry);

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
            updateSuperiorDSA(
                ctx,
                targetDN.slice(0, -1),
                immediateSuperior,
                state.chainingArguments.aliasDereferenced ?? false,
            ); // INTENTIONAL_NO_AWAIT
        }
    }

    // TODO: Update shadows
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
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
                }), undefined),
        },
    };
}

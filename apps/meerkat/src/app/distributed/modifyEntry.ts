import {
    Context,
    IndexableOID,
    Vertex,
    Value,
    ClientAssociation,
    OperationReturn,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import {
    _decode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryResult,
    _encode_ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import {
    ModifyEntryResultData,
    _encode_ModifyEntryResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_objectClassModificationProhibited,
    UpdateProblem_familyRuleViolation,
    UpdateProblem_notAllowedOnRDN,
    UpdateProblem_namingViolation,
    UpdateProblem_insufficientPasswordQuality,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    ObjectClassKind,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    AttributeProblem_contextViolation,
    AttributeProblem_undefinedAttributeType,
    AttributeProblem_constraintViolation,
    AttributeProblem_invalidAttributeSyntax,
    AttributeProblem_attributeOrValueAlreadyExists,
    AttributeProblem_noSuchAttributeOrValue,
    AttributeProblem_inappropriateMatching,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    DERElement,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    ASN1Construction,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
    unpackBits,
} from "asn1-ts";
import {
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getDistinguishedName from "../x500/getDistinguishedName";
import type { Prisma } from "@prisma/client";
import addValues from "../database/entry/addValues";
import removeValues from "../database/entry/removeValues";
import removeAttribute from "../database/entry/removeAttribute";
import dseFromDatabaseEntry from "../database/dseFromDatabaseEntry";
import { strict as assert } from "assert";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
    PERMISSION_CATEGORY_READ,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../authz/getIsGroupMember";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_modifyEntry,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyEntry.va";
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
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_dontSelectFriends,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    id_oa_collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-collectiveExclusions.va";
import readPermittedEntryInformation from "../database/entry/readPermittedEntryInformation";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEntryModificationStatistics from "../telemetry/getEntryModificationStatistics";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics";
import validateObjectClasses from "../x500/validateObjectClasses";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import getSubschemaSubentry from "../dit/getSubschemaSubentry";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import extensibleObject from "../ldap/extensibleObject";
import attributeTypesPermittedForEveryEntry from "../x500/attributeTypesPermittedForEveryEntry";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    FamilyReturn_memberSelect_contributingEntriesOnly,
    FamilyReturn_memberSelect_participatingEntriesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";
import readFamily from "../database/family/readFamily";
import readCompoundEntry from "../database/family/readCompoundEntry";
import convertSubtreeToFamilyInformation from "../x500/convertSubtreeToFamilyInformation";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    FamilyEntries,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyEntries.ta";
import {
    family_information,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/family-information.oa";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import getACIItems from "../authz/getACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import { MINIMUM_MAX_ATTR_SIZE } from "../constants";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import compareElements from "@wildboar/x500/src/lib/comparators/compareElements";
import readValuesOfType from "../utils/readValuesOfType";
import rdnToJson from "../x500/rdnToJson";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { id_aca_subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-subentryACI.va";
import { id_aca_prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-prescriptiveACI.va";
import {
    id_aca_accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-accessControlScheme.va";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import {
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import isOperationalAttributeType from "../x500/isOperationalAttributeType";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { stringifyDN } from "../x500/stringifyDN";
import { printInvokeId } from "../utils/printInvokeId";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import {
    pwdModifyEntryAllowed,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { getAdministrativePoints } from "../dit/getAdministrativePoints";
import {
    id_ar_pwdAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-pwdAdminSpecificArea.va";
import { pwdAdminSubentry } from "@wildboar/x500/src/lib/collections/objectClasses";
import { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import {
    checkPasswordQuality,
    CHECK_PWD_QUALITY_OK,
} from "../password/checkPasswordQuality";
import { attributeValueFromDB } from "../database/attributeValueFromDB";
import {
    SubordinateChanges,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SubordinateChanges.ta";
import { getShadowIncrementalSteps } from "../dop/getRelevantSOBs";
import { saveIncrementalRefresh } from "../disp/saveIncrementalRefresh";
import { governingStructureRule } from "@wildboar/x500/src/lib/collections/attributes";
import { acdf } from "../authz/acdf";

type ValuesIndex = Map<IndexableOID, Value[]>;
type ContextRulesIndex = Map<IndexableOID, DITContextUseDescription>;
interface Patch {
    addedValues: ValuesIndex;
    removedValues: ValuesIndex;
    removedAttributes: Set<IndexableOID>;
}

const USER_PASSWORD: string = userPassword["&id"].toString();
const USER_PWD: string = userPwd["&id"].toString();
const ALL_ATTRIBUTE_TYPES: string = id_oa_allAttributeTypes.toString();

const notPermittedData =  (
    ctx: Context,
    assn: ClientAssociation,
    aliasDereferenced: boolean | undefined,
    signErrors: boolean,
) => new SecurityErrorData(
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
    aliasDereferenced,
    undefined,
);

/**
 * @summary Determine whether an ASN.1 value may be used in arithmetic operations
 * @description
 *
 * Determines whether an ASN.1 value may be used in arithmetic operations.
 *
 * @param el The value whose suitability for arithmetic is to be determined
 * @returns Whether the value may be used in arithmetic operations
 *
 * @function
 */
export function isAcceptableTypeForAlterValues (el: ASN1Element): boolean {
    return (
        (el.tagClass === ASN1TagClass.universal)
        && (
            (el.tagNumber === ASN1UniversalType.integer)
            || (el.tagNumber === ASN1UniversalType.realNumber)
        )
    );
}

/**
 * @summary Higher-order function that gets a function for adding two values
 * @description
 *
 * This higher-order function returns a function that takes an in-memory value
 * and adds the value given by `toBeAddedElement` (or subtracts if the
 * `toBeAddedElement` encodes a negative `INTEGER` or `REAL`).
 *
 * @param ctx The context object
 * @param vertex The DSE
 * @param type_ The attribute type object identifier
 * @param toBeAddedElement The ASN.1 value to be added
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A function that can be used to add to a given in-memory value
 *
 * @function
 */
function getValueAlterer (
    ctx: Context,
    vertex: Vertex,
    type_: OBJECT_IDENTIFIER,
    toBeAddedElement: ASN1Element,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): (value: Value) => Value {
    const toBeAdded = (toBeAddedElement.tagNumber === ASN1UniversalType.integer)
        ? Number(toBeAddedElement.integer)
        : toBeAddedElement.real;
    return (value: Value): Value => {
        const attributeErrorData = () => {
            return new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(vertex),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_constraintViolation,
                        type_,
                        value.value,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            );
        };
        if (!isAcceptableTypeForAlterValues(value.value)) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:invalid_type_for_alter_values"),
                attributeErrorData(),
                signErrors,
            );
        }
        if (value.value.tagNumber !== toBeAddedElement.tagNumber) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:invalid_type_for_alter_values"),
                attributeErrorData(),
                signErrors,
            );
        }
        const currentValue = (value.value.tagNumber === ASN1UniversalType.integer)
            ? Number(value.value.integer)
            : value.value.real;
        return {
            ...value,
            value: new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                value.value.tagNumber,
                (currentValue + toBeAdded),
            ),
        };
    };
}

/**
 * @summary If the attribute has multiple values, check if it MAY have multiple values
 * @description
 *
 * This function checks if an attribute has multiple values. If it does, it then
 * checks if that attribute type is single-valued. If the attribute type is
 * single-valued, but there were multiple values given by a user, an error is
 * thrown.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param target The target DSE
 * @param attr The attribute to be added
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 *
 * @function
 */
function checkAttributeArity (
    ctx: Context,
    assn: ClientAssociation,
    target: Vertex,
    attr: Attribute,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): void {
    const numberOfValues: number = (attr.values.length + (attr.valuesWithContext?.length ?? 0));
    if (numberOfValues <= 1) {
        return;
    }
    const TYPE_OID: string = attr.type_.toString();
    const spec = ctx.attributeTypes.get(TYPE_OID);
    if (!spec) {
        return; // This should be covered elsewhere.
    }
    if (spec.singleValued) {
        const targetDN = getDistinguishedName(target);
        throw new errors.AttributeError(
            ctx.i18n.t("err:single_valued", {
                oid: TYPE_OID,
            }),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_invalidAttributeSyntax,
                        attr.type_,
                        undefined,
                    ),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
}

/**
 * @summary Determine whether an attribute is already present in a DSE
 * @description
 *
 * This function returns a `boolean` indicating whether an attribute is already
 * present in a DSE.
 *
 * @param ctx The context object
 * @param target The target DSE
 * @param type_ The attribute whose presence is to be determined
 * @returns A `boolean` indicating whether the attribute is already present in
 *  the entry.
 *
 * @function
 * @async
 */
async function checkAttributePresence (
    ctx: Context,
    target: Vertex,
    type_: AttributeType,
): Promise<boolean> {
    const TYPE_OID: string = type_.toString();
    const spec = ctx.attributeTypes.get(TYPE_OID);
    if (!spec) {
        return false;
    }
    if (spec.driver?.isPresent) {
        return spec.driver.isPresent(ctx, target);
    }
    return !!(await ctx.db.attributeValue.findFirst({
        where: {
            entry_id: target.dse.id,
            type_oid: type_.toBytes(),
        },
        select: {
            id: true,
        },
    }));
}

/**
 * @summary Check if the user has permission to add values
 * @description
 *
 * This function checks if a user has permission to add certain attribute types
 * and values to an entry based on access controls. Subschema and other
 * concerns, such as attributes being obsolete, are not checked by this
 * function; this function only evaluates access control.
 *
 * @param modificationType The modification type
 * @param attribute The attribute containing the values to be added
 * @param ctx The context object
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param assn The client association
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 *
 * @function
 */
function checkPermissionToAddValues (
    target: Vertex,
    modificationType: "addAttribute" | "addValues",
    attribute: Attribute,
    ctx: Context,
    user: NameAndOptionalUID | undefined | null,
    assn: ClientAssociation,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): void {
    if (!accessControlScheme) {
        return;
    }
    const values = valuesFromAttribute(attribute);
    const authorizedForAttributeType = acdf(
        ctx,
        accessControlScheme,
        assn,
        target,
        [ PERMISSION_CATEGORY_ADD ],
        relevantACDFTuples,
        user,
        {
            attributeType: attribute.type_,
            operational: isOperationalAttributeType(ctx, attribute.type_),
        },
        bacSettings,
        true,
    );
    if (!authorizedForAttributeType) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:not_authz_mod", {
                mod: modificationType,
                type: attribute.type_.toString(),
            }),
            notPermittedData(ctx, assn, aliasDereferenced, signErrors),
            signErrors,
        );
    }
    for (const value of values) {
        const authorizedForValue = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [ PERMISSION_CATEGORY_ADD ],
            relevantACDFTuples,
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
        );
        if (!authorizedForValue) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: modificationType,
                    type: attribute.type_.toString(),
                }),
                notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                signErrors,
            );
        }
    }
}

// TODO: Password policy applies _per password attribute_. This is something I'll
// have to change when I re-write Meerkat DSA entirely.
async function checkPermissionToModifyPassword (
    ctx: Context,
    entry: Vertex,
    targetDN: DistinguishedName,
): Promise<boolean> {
    const pwdAdminPoint = getAdministrativePoints(entry)
        .find((ap) => ap.dse.admPoint?.administrativeRole.has(id_ar_pwdAdminSpecificArea.toString()));
    if (!pwdAdminPoint) {
        // If there is no password admin point defined, you can do whatever you want.
        return true;
    }
    const pwdAdminSubentries = (await getRelevantSubentries(ctx, entry, targetDN, pwdAdminPoint))
        .filter((s) => s.dse.objectClass.has(pwdAdminSubentry["&id"].toString()));

    /**
     * Technically, there is supposed to be only one password admin subentry per
     * password attribute, but we just check that all of them permit password
     * changes via modifyEntry. In Meerkat DSA, there is one hard-coded password
     * attribute.
     */
    return (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: pwdAdminSubentries.map((s) => s.dse.id),
            },
            type_oid: pwdModifyEntryAllowed["&id"].toBytes(),
            operational: true,
        },
        select: {
            jer: true,
        },
    }))
        .map(({ jer }) => jer as boolean)
        .every((x) => x);
}

/**
 * @summary Throw an error if a non-modifiable attribute type would be modified
 * @description
 *
 * This function determines whether the request would attempt to modify a
 * non-modifiable attribute type, not including access control. Access controls
 * are not checked in this function; this function checks other reasons why an
 * attribute type may not be modified.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param attributeType The attribute type the user is attempting to modify
 * @param entry The entry that will be modified
 * @param targetDN The target distinguished name
 * @param isSubentry Whether the entry is a subentry
 * @param manageDSAIT Whether the manageDSAIT flag was set
 * @param isRemoving Whether the attribute type is being removed
 * @param aliasDereferenced Whether an alias was dereferenced in finding the entry
 *
 * @function
 */
function checkAbilityToModifyAttributeType (
    ctx: Context,
    assn: ClientAssociation,
    attributeType: AttributeType,
    entry: Vertex,
    targetDN: DistinguishedName,
    isSubentry: boolean,
    manageDSAIT: boolean,
    isRemoving: boolean, // For accomodating obsolete attribute types.
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): void {
    const TYPE_OID: string = attributeType.toString();
    const spec = ctx.attributeTypes.get(TYPE_OID);
    if (!spec) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:unrecognized_attribute_type", {
                oids: TYPE_OID,
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_undefinedAttributeType,
                        attributeType,
                        undefined,
                    ),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (spec.noUserModification && !manageDSAIT) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:no_user_modification", {
                oids: TYPE_OID,
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
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (spec.dummy) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:cannot_add_dummy_attr", {
                oids: spec.id.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_constraintViolation,
                        spec.id,
                        undefined,
                    ),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (spec.collective && !isSubentry) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:cannot_add_collective_attr", {
                oids: spec.id.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_constraintViolation,
                        spec.id,
                        undefined,
                    ),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (spec.obsolete && !isRemoving) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:cannot_add_obsolete_attr", {
                oids: spec.id.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_constraintViolation,
                        spec.id,
                        undefined,
                    ),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
}

/**
 * @summary Update a patch object with added values
 * @description
 *
 * This function adds added values to a patch object and, if those values are
 * present in the "removed values" part of the patch, they are removed from
 * there.
 *
 * @param patch The patch of pending changes to the entry
 * @param type_ The attribute type affected
 * @param toAdd The values to add
 * @param equalityMatcher The equality matcher for that type
 *
 * @function
 */
function addValuesToPatch (
    patch: Patch,
    type_: AttributeType,
    toAdd: Value[],
    equalityMatcher?: EqualityMatcher,
): void {
    const TYPE_OID: IndexableOID = type_.toString();
    const addedValues = patch.addedValues.get(TYPE_OID);
    if (addedValues) {
        addedValues.push(...toAdd);
    } else {
        patch.addedValues.set(TYPE_OID, toAdd);
    }
    const removedValues = patch.removedValues.get(TYPE_OID);
    if (removedValues) {
        patch.removedValues.set(TYPE_OID, removedValues
            .filter((rv) => {
                return toAdd.some((addedValue) => {
                    if (compareElements(addedValue.value, rv.value)) {
                        return false; // We have "un-removed" the removed value by "re-adding" it.
                    }
                    try {
                        if (equalityMatcher && equalityMatcher(addedValue.value, rv.value)) {
                            return false; // We have "un-removed" the removed value by "re-adding" it.
                        }
                    } catch {
                        return true; // If the equality matcher fails, we just assume they are not a match.
                    }
                    return true;
                })
            }));
    }
    patch.removedAttributes.delete(TYPE_OID);
}

/**
 * @summary Update a patch object with removed values
 * @description
 *
 * This function adds removed values to a patch object and, if those values are
 * present in the "added values" part of the patch, they are removed from there.
 *
 * @param patch The patch of pending changes to the entry
 * @param type_ The attribute type affected
 * @param toRemove The values to remove
 * @param equalityMatcher The equality matcher for that type
 *
 * @function
 */
function removeValuesFromPatch (
    patch: Patch,
    type_: AttributeType,
    toRemove: Value[],
    equalityMatcher?: EqualityMatcher,
): void {
    const TYPE_OID: IndexableOID = type_.toString();
    const removedValues = patch.removedValues.get(TYPE_OID);
    if (removedValues) {
        removedValues.push(...toRemove);
    } else {
        patch.removedValues.set(TYPE_OID, toRemove);
    }
    const addedValues = patch.addedValues.get(TYPE_OID);
    if (addedValues) {
        patch.addedValues.set(TYPE_OID, addedValues
            .filter((av) => {
                return toRemove.some((removedValue) => {
                    if (compareElements(removedValue.value, av.value)) {
                        return false; // We have "un-added" the value by removing it.
                    }
                    try {
                        if (equalityMatcher && equalityMatcher(removedValue.value, av.value)) {
                            return false; // We have "un-added" the value by removing it.
                        }
                    } catch {
                        return true; // If the equality matcher fails, we just assume they are not a match.
                    }
                    return true;
                })
            }));
    }
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `addAttribute` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `addAttribute` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeAddAttribute (
    target: Vertex,
    mod: Attribute,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    checkAttributeArity(ctx, assn, entry, mod, aliasDereferenced, signErrors);
    /**
     * This is done before checking if the attribute is already present to avoid
     * disclosing its presence. Once you've added the attribute, its presence is
     * already known, so this is not a problem beyond this point.
     */
    checkPermissionToAddValues(
        target,
        "addAttribute",
        mod,
        ctx,
        user,
        assn,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
        signErrors,
    );
    const isPresent: boolean = await checkAttributePresence(ctx, entry, mod.type_);
    if (isPresent) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:attribute_already_exists", {
                type: mod.type_.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_attributeOrValueAlreadyExists,
                        mod.type_,
                        undefined,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const values = valuesFromAttribute(mod);
    addValuesToPatch(patch, mod.type_, values, getNamingMatcherGetter(ctx)(mod.type_));
    return addValues(ctx, entry, values, undefined, true, signErrors);
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `removeAttribute` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `removeAttribute` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeRemoveAttribute (
    target: Vertex,
    mod: AttributeType,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    if (entry.dse.rdn.some((atav) => atav.type_.isEqualTo(mod))) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_allowed_on_rdn"),
            new UpdateErrorData(
                UpdateProblem_notAllowedOnRDN,
                [
                    {
                        attributeType: mod,
                    },
                ],
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
            ),
            signErrors,
        );
    }
    /**
     * This is intentionally checked before even checking if the attribute is
     * present so that we avoid revealing whether it exists already or not.
     */
    if (accessControlScheme) {
        const authorizedForAttributeType = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [ PERMISSION_CATEGORY_REMOVE ],
            relevantACDFTuples,
            user,
            {
                attributeType: mod,
                operational: isOperationalAttributeType(ctx, mod),
            },
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "removeAttribute",
                    type: mod.toString(),
                }),
                notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                signErrors,
            );
        }
    }
    const isPresent: boolean = await checkAttributePresence(ctx, entry, mod);
    if (!isPresent) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:no_such_attribute_or_value", {
                type: mod.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_noSuchAttributeOrValue,
                        mod,
                        undefined,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const TYPE_OID: string = mod.toString();
    patch.addedValues.delete(TYPE_OID);
    patch.removedValues.delete(TYPE_OID); // Delete because we removed the whole attribute anyway.
    patch.removedAttributes.add(TYPE_OID);
    return removeAttribute(ctx, entry, mod);
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `addValues` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `addValues` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeAddValues (
    target: Vertex,
    mod: Attribute,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    const equalityMatcher: boolean = !!bacSettings.getEqualityMatcher(mod.type_);
    if (!equalityMatcher) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:no_equality_matching_rule_defined_for_type", {
                oid: mod.type_.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_inappropriateMatching,
                        mod.type_,
                        undefined,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    checkAttributeArity(ctx, assn, entry, mod, aliasDereferenced, signErrors);
    checkPermissionToAddValues(
        target,
        "addValues",
        mod,
        ctx,
        user,
        assn,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
        signErrors,
    );
    const values = valuesFromAttribute(mod);
    addValuesToPatch(patch, mod.type_, values, getNamingMatcherGetter(ctx)(mod.type_));
    return addValues(ctx, entry, values, undefined, true, signErrors);
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `removeValues` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `removeValues` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeRemoveValues (
    target: Vertex,
    mod: Attribute,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    const equalityMatcher: boolean = !!bacSettings.getEqualityMatcher(mod.type_);
    if (!equalityMatcher) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:no_equality_matching_rule_defined_for_type", {
                oid: mod.type_.toString(),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_inappropriateMatching,
                        mod.type_,
                        undefined,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    const EQUALITY_MATCHER = getNamingMatcherGetter(ctx)(mod.type_);
    const values = valuesFromAttribute(mod);
    const rdnValueOfType = entry.dse.rdn.find((atav) => atav.type_.isEqualTo(mod.type_));
    if (
        rdnValueOfType
        && EQUALITY_MATCHER
        && values.some((value) => EQUALITY_MATCHER(value.value, rdnValueOfType.value))
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:not_allowed_on_rdn"),
            new UpdateErrorData(
                UpdateProblem_notAllowedOnRDN,
                [
                    {
                        attribute: new Attribute(
                            rdnValueOfType.type_,
                            [ rdnValueOfType.value ],
                            undefined,
                        ),
                    },
                ],
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
            ),
            signErrors,
        )
    }
    if (accessControlScheme) {
        const authorizedForAttributeType = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [ PERMISSION_CATEGORY_REMOVE ],
            relevantACDFTuples,
            user,
            {
                attributeType: mod.type_,
                operational: isOperationalAttributeType(ctx, mod.type_),
            },
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "removeValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                signErrors,
            );
        }
        for (const value of values) {
            const authorizedForValue = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_REMOVE ],
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                    operational: isOperationalAttributeType(ctx, value.type),
                },
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "removeValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }
    removeValuesFromPatch(patch, mod.type_, values, EQUALITY_MATCHER);
    // DEVIATION: This does not check if the values exist.
    // It also does not check if the attribute exists, but the specification is
    // not clear as to whether that is required.
    return removeValues(ctx, entry, values);
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `alterValues` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `alterValues` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeAlterValues (
    target: Vertex,
    mod: AttributeTypeAndValue,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    if (!isAcceptableTypeForAlterValues(mod.value)) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:invalid_type_for_alter_values"),
            new AttributeErrorData(
                {
                    rdnSequence: getDistinguishedName(entry),
                },
                [
                    new AttributeErrorData_problems_Item(
                        AttributeProblem_constraintViolation,
                        mod.type_,
                        mod.value,
                    ),
                ],
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (accessControlScheme) {
        const authorizedForAttributeType = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            [
                PERMISSION_CATEGORY_MODIFY, // DEVIATION: More strict than spec.
                PERMISSION_CATEGORY_REMOVE,
            ],
            relevantACDFTuples,
            user,
            {
                attributeType: mod.type_,
                operational: isOperationalAttributeType(ctx, mod.type_),
            },
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "alterValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                signErrors,
            );
        }
    }
    const alterer = getValueAlterer(
        ctx,
        entry,
        mod.type_,
        mod.value,
        aliasDereferenced,
        signErrors,
    );
    const values = await readValuesOfType(ctx, entry, mod.type_);
    if (accessControlScheme) {
        for (const value of values) {
            const authorizedForValue = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [
                    PERMISSION_CATEGORY_MODIFY, // DEVIATION: More strict than spec.
                    PERMISSION_CATEGORY_REMOVE,
                ],
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                    operational: isOperationalAttributeType(ctx, value.type),
                },
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "alterValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const newValues = values.map(alterer);
    if (accessControlScheme) {
        for (const value of newValues) {
            const authorizedForValue = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                // DEVIATON: X.511 does not explicitly require add permissions
                // for the newly-produced values, but I think this is an error.
                [ PERMISSION_CATEGORY_ADD ],
                relevantACDFTuples,
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
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "alterValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }
    { // Modify the delta values.
        patch.addedValues.set(TYPE_OID, newValues);
        patch.removedValues.set(TYPE_OID, values);
    }
    return [
        ...(await removeValues(ctx, entry, values)),
        ...(await addValues(ctx, entry, newValues, undefined, true, signErrors)),
    ];
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `resetValue` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `resetValue` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeResetValue (
    target: Vertex,
    mod: AttributeType,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    const where: Prisma.AttributeValueWhereInput = {
        entry_id: entry.dse.id,
        type_oid: mod.toBytes(),
        ContextValue: {
            some: {
                fallback: false,
            },
        },
    };
    if (accessControlScheme) {
        // This is not incorrect. Contexts are only maintained for userApplications
        // attribute types, so this mod can just read right from this table.
        const rows = await ctx.db.attributeValue.findMany({
            where,
            select: {
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        });
        for (const row of rows) {
            const el = attributeValueFromDB(row);
            const authorizedForAttributeType = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                // DEVIATON: X.511 does not explicitly require add permissions
                // for the newly-produced values, but I think this is an error.
                [ PERMISSION_CATEGORY_REMOVE ],
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        mod,
                        el,
                    ),
                    operational: isOperationalAttributeType(ctx, mod),
                },
                bacSettings,
                true,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "resetValue",
                        type: mod.toString(),
                    }),
                    notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }
    const oldValues = await readValuesOfType(ctx, entry, mod);
    // This will not update operational attributes, but that does not
    // matter, because it only remove values having some context, and per X.501,
    // operational attributes are forbidden from having contexts.
    const TYPE_OID: IndexableOID = mod.toString();
    if (oldValues.length) {
        const keep = (value: Value) => !Array.from(value.contexts?.values() ?? [])
            .some((context) => (context.fallback === false));
        const keptValues = oldValues.filter(keep);
        const discardedValues = oldValues.filter((v) => !keep(v));
        patch.addedValues.set(TYPE_OID, keptValues);
        patch.removedValues.set(TYPE_OID, discardedValues);
    }
    return [
        // This is not incorrect. Contexts are only maintained for userApplications
        // attribute types, so this mod can just delete right from this table.
        ctx.db.attributeValue.deleteMany({
            where,
        }),
    ];
}

/**
 * @summary Produce the `PrismaPromise`s to execute a `replaceValues` modification
 * @description
 *
 * This function produces the `PrismaPromise`s needed to execute a
 * `replaceValues` modification, as defined in ITU Recommendation X.511 (2016),
 * Section 12.3.2.
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * @param mod The modification
 * @param ctx The context object
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeReplaceValues (
    target: Vertex,
    mod: Attribute,
    ctx: Context,
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    checkAttributeArity(ctx, assn, entry, mod, aliasDereferenced, signErrors);
    const TYPE_OID: string = mod.type_.toString();
    const values = valuesFromAttribute(mod);
    if (accessControlScheme) {
        const authorizedForAttributeType = acdf(
            ctx,
            accessControlScheme,
            assn,
            target,
            // DEVIATON: X.511 does not explicitly require add permissions
            // for the newly-produced values, but I think this is an error.
            [ PERMISSION_CATEGORY_ADD ],
            relevantACDFTuples,
            user,
            {
                attributeType: mod.type_,
                operational: isOperationalAttributeType(ctx, mod.type_),
            },
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "replaceValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                signErrors,
            );
        }
        const existingValues = await readValuesOfType(ctx, entry, mod.type_);
        for (const xv of existingValues) {
            const authorizedForValue = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_REMOVE ],
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        mod.type_,
                        xv.value,
                    ),
                    operational: isOperationalAttributeType(ctx, mod.type_),
                },
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "replaceValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, assn, aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }
    const oldValues = await readValuesOfType(ctx, entry, mod.type_);
    patch.removedValues.set(TYPE_OID, oldValues);
    addValuesToPatch(patch, mod.type_, values, getNamingMatcherGetter(ctx)(mod.type_));
    return [
        ...(await removeAttribute(ctx, entry, mod.type_)),
        // Second to last argument to addValues() is false, because we don't want to check
        // if the potentially added values already exist, because we are just
        // going to wipe out all that exist and replace them.
        ...(await addValues(ctx, entry, values, undefined, false, signErrors)),
    ];
}

/**
 * @summary Evaluate an added attribute or values against context rules
 * @description
 *
 * This function both checks that the DIT context use rules are satisfied
 * and applies default context values, if there are any defined. These are
 * separate features, but it turns out that they innately share a lot of
 * code, so it will preferable to merge these two features into a single
 * function.
 *
 * Note that we do not handle the default context value post-processing
 * steps described in ITU Recommendation X.501 (2016), Section 13.9.2. As
 * far as I can see, these only exist to save storage space.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param targetDN The target distinguished name
 * @param attribute The X.500 directory attribute whose contexts are to be
 *  evaluated for compliance to the context rules
 * @param contextRuleIndex The index of applicable context rules
 * @param aliasDereferenced Whether an alias was dereferenced when finding the
 *  target DSE.
 * @returns An attribute that is populated with default context values
 *
 * @function
 */
function handleContextRule (
    ctx: Context,
    assn: ClientAssociation,
    targetDN: DistinguishedName,
    attribute: Attribute,
    contextRuleIndex: ContextRulesIndex,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Attribute {
    const rule = contextRuleIndex.get(attribute.type_.toString())
        ?? contextRuleIndex.get(ALL_ATTRIBUTE_TYPES);
    if (!rule) {
        if (attribute.valuesWithContext?.length) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:no_contexts_permitted", {
                    oid: attribute.type_.toString(),
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    attribute.valuesWithContext.map((vwc) => new AttributeErrorData_problems_Item(
                        AttributeProblem_contextViolation,
                        attribute.type_,
                        vwc.value,
                    )),
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        return attribute;
    }
    if (rule.information.mandatoryContexts?.length && attribute.values.length) {
        /**
         * If every mandatory context has a default value defined, we do not
         * need to fail: the default value will be applied and this
         * requirement will be satisfied.
         */
        const everyRequiredContextHasADefaultValue: boolean = rule
            .information
            .mandatoryContexts
            .every((mc) => !!ctx.contextTypes.get(mc.toString())?.defaultValue);
        if (!everyRequiredContextHasADefaultValue) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:missing_required_context_types", {
                    attr: attribute.type_.toString(),
                    oids: rule.information.mandatoryContexts.map((mc) => mc.toString()).join(", "),
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: [],
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_contextViolation,
                            attribute.type_,
                            undefined,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }
    const permittedContexts: OBJECT_IDENTIFIER[] = [
        ...(rule.information.mandatoryContexts ?? []),
        ...(rule.information.optionalContexts ?? []),
    ];
    const permittedContextsIndex: Set<IndexableOID> = new Set(permittedContexts.map((pc) => pc.toString()));
    for (const vwc of (attribute.valuesWithContext ?? [])) {
        const mandatoryContextsRemaining: Set<IndexableOID> = new Set(
            rule.information.mandatoryContexts?.map((mc) => mc.toString()),
        );
        for (const context of vwc.contextList) {
            const TYPE_OID: string = context.contextType.toString();
            if (!permittedContextsIndex.has(TYPE_OID)) {
                throw new errors.AttributeError(
                    ctx.i18n.t("err:context_type_prohibited_by_context_use_rule", {
                        ct: TYPE_OID,
                        at: attribute.type_.toString(),
                    }),
                    new AttributeErrorData(
                        {
                            rdnSequence: targetDN,
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_contextViolation,
                                attribute.type_,
                                vwc.value,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            mandatoryContextsRemaining.delete(TYPE_OID);
        }
        if (mandatoryContextsRemaining.size > 0) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:missing_required_context_types", {
                    attr: attribute.type_.toString(),
                    oids: Array.from(mandatoryContextsRemaining.values()).join(", "),
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_contextViolation,
                            attribute.type_,
                            vwc.value,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    /**
     * Everything from here onwards adds default context values to the
     * attribute, per ITU Recommendation X.501 (2016), Section 13.9.2.
     */
    let current: Attribute = attribute.valuesWithContext?.length
        ? attribute
        : new Attribute(
            attribute.type_,
            attribute.values,
            []
        );
    for (const ct of permittedContexts) { // TODO: This is O(n^2).
        const spec = ctx.contextTypes.get(ct.toString());
        if (!spec) {
            continue; // This is intentional. This is not supposed to throw.
        }
        if (!spec.defaultValue) {
            continue; // This is intentional. This is not supposed to throw.
        }
        const defaultValueGetter = spec.defaultValue;
        for (const vwc of (current.valuesWithContext ?? [])) {
            const hasContextOfThisType: boolean = vwc.contextList
                .some((context) => (context.contextType.isEqualTo(ct)));
            if (hasContextOfThisType) {
                continue;
            }
            vwc.contextList.push(new X500Context(
                ct,
                [ defaultValueGetter() ],
                true, // The specification is not clear on whether the default context value should be a fallback.
            ));
        }
        // We do not need to track which values to remove: they will all be
        // removed, because, if we've made it this far in the code, we've
        // established that there will be default context values to apply.
        for (const value of current.values) {
            current.valuesWithContext!.push(new Attribute_valuesWithContext_Item(
                value,
                [
                    new X500Context(
                        ct,
                        [ defaultValueGetter() ],
                        true, // The specification is not clear on whether the default context value should be a fallback.
                    ),
                ],
            ));
        }
        current = new Attribute(
            attribute.type_,
            [],
            attribute.valuesWithContext,
        );
    }
    return current;
};

/**

 *
 */

/**
 * @summary Produce the `PrismaPromise`s needed to execute an entry modification.
 * @description
 *
 * Rather than doing the entry modification directly, this function returns
 * `PrismaPromise`s, which can be used by the Prisma ORM to perform all of the
 * necessary updates as a part of a transaction. This is important, because the
 * specification mandates that all of the modifications in a `modifyEntry`
 * operation must pass or fail as a unit.
 *
 * Depending on the modification type, this function will "route" the arguments
 * to a function that is specific for that modification type.
 *
 * Note: from ITU Recommendation X.501 (2016), Section 13.4.7:
 *
 * > If no equality matching rule is indicated, the Directory:
 * >
 * > a) treats values of this attribute as having type ANY, i.e., the Directory may not check that those values
 * > conform with the data type or any other rule indicated for the attribute;
 * >
 * > b) does not permit the attribute to be used for naming;
 * >
 * > c) does not allow individual values of multi-valued attributes to be added or removed;
 * >
 * > d) does not perform comparisons of values of the attribute;
 * >
 * > e) will not attempt to evaluate AVAs using values of such an attribute type.
 *
 * @param ctx The context object
 * @param state The operation dispatcher state
 * @param relevantSubentries Subentries that were determined to apply to the
 *  target entry
 * @param assn The client association
 * @param user The requestor (not the bound user, because the request could have
 *  been chained)
 * @param entry The target DSE
 * @param targetDN The target DSE's distinguished name
 * @param mod The modification
 * @param patch The accumulated patch that will apply to the entry
 * @param accessControlScheme The object identifier of the access control scheme
 *  that applies to this entry
 * @param relevantACDFTuples The Basic Access Control Decision Function tuples
 *  that apply to the current user
 * @param precludedAttributes The set of strings of dot-delimited object
 *  identifiers of attribute types that are precluded by the relevant DIT
 *  content rules
 * @param contextRuleIndex A map of context rules by the dot-delimited object
 *  identifier string that identifies the attribute type to which the rule
 *  applies.
 * @param isSubentry Whether the entry is a subentry
 * @param manageDSAIT Whether the `manageDSAIT` flag was set in the request
 * @param aliasDereferenced Whether an alias was dereferenced in the process of
 *  locating this entry.
 * @returns A promise that resolves to an array of `PrismaPromise`s.
 *
 * @function
 * @async
 */
async function executeEntryModification (
    ctx: Context,
    state: OperationDispatcherState,
    relevantSubentries: Vertex[],
    assn: ClientAssociation,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    targetDN: DistinguishedName,
    mod: EntryModification,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    precludedAttributes: Set<IndexableOID>,
    contextRuleIndex: ContextRulesIndex,
    isSubentry: boolean,
    manageDSAIT: boolean,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    const target = state.foundDSE;

    const commonArguments = [
        ctx,
        assn,
        user,
        entry,
        patch,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
        signErrors,
    ] as const;

    const check = (
        attributeType: AttributeType,
        isRemoving: boolean,
    ) => checkAbilityToModifyAttributeType(
        ctx,
        assn,
        attributeType,
        entry,
        targetDN,
        isSubentry,
        manageDSAIT,
        isRemoving,
        aliasDereferenced,
        signErrors,
    );

    const checkPassword = async (attr: Attribute) => {
        // In the coming re-write, this should use the `pwdAttribute` attribute to determine this.
        const modifyingAPasswordAttribute: boolean = (
            attr.type_.isEqualTo(userPwd["&id"])
            || attr.type_.isEqualTo(userPassword["&id"])
        );
        if (!modifyingAPasswordAttribute) {
            return;
        }
        const permitted: boolean = !modifyingAPasswordAttribute
            || await checkPermissionToModifyPassword(ctx, entry, targetDN);
        if (!permitted) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mpw", { context: "pwd_admin" }),
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
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        // #region Password Policy Verification

        const values = [
            ...attr.values,
            ...attr.valuesWithContext?.map((vwc) => vwc.value) ?? [],
        ];
        const encoded = values[0];
        const password: UserPwd = attr.type_.isEqualTo(userPwd["&id"])
            ? userPwd.decoderFor["&Type"]!(encoded)
            : {
                clear: Buffer.from(encoded.octetString).toString("utf-8"),
            };
        // TODO: Password policy applies _per password attribute_. This is something I'll
        // have to change when I re-write Meerkat DSA entirely.
        const pwdAdminPoint = state.admPoints
            .find((ap) => ap.dse.admPoint?.administrativeRole.has(id_ar_pwdAdminSpecificArea.toString()));
        if (!pwdAdminPoint) {
            return;
        }
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
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        } else if ("clear" in password) {
            for (const pwsub of pwdAdminSubentries) {
                const checkPwdResult = await checkPasswordQuality(ctx, password.clear, pwsub);
                if (checkPwdResult === CHECK_PWD_QUALITY_OK) {
                    return;
                }
                // Unfortunately, err:pwd_quality cannot contain more info,
                // because the error message will be logged,
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
                        aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        } // If there is no password admin point defined, you can do whatever you want.
        // #endregion Password Policy Verification
    };

    const checkContextRule = (attribute: Attribute): Attribute => handleContextRule(
        ctx,
        assn,
        targetDN,
        attribute,
        contextRuleIndex,
        aliasDereferenced,
        signErrors,
    );

    const checkPreclusion = (attributeType: AttributeType) => {
        if (precludedAttributes.has(attributeType.toString())) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:attr_type_precluded", {
                    oid: attributeType.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attributeType,
                        },
                    ],
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
                ),
                signErrors,
            );
        }
    };

    if ("addAttribute" in mod) {
        check(mod.addAttribute.type_, false);
        await checkPassword(mod.addAttribute);
        checkPreclusion(mod.addAttribute.type_);
        const attrWithDefaultContexts = checkContextRule(mod.addAttribute);
        return executeAddAttribute(target, attrWithDefaultContexts, ...commonArguments);
    }
    else if ("removeAttribute" in mod) {
        check(mod.removeAttribute, true);
        return executeRemoveAttribute(target, mod.removeAttribute, ...commonArguments);
    }
    else if ("addValues" in mod) {
        check(mod.addValues.type_, false);
        await checkPassword(mod.addValues);
        checkPreclusion(mod.addValues.type_);
        const attrWithDefaultContexts = checkContextRule(mod.addValues);
        return executeAddValues(target, attrWithDefaultContexts, ...commonArguments);
    }
    else if ("removeValues" in mod) {
        check(mod.removeValues.type_, true);
        return executeRemoveValues(target, mod.removeValues, ...commonArguments);
    }
    else if ("alterValues" in mod) {
        check(mod.alterValues.type_, false);
        return executeAlterValues(target, mod.alterValues, ...commonArguments);
    }
    else if ("resetValue" in mod) {
        check(mod.resetValue, true);
        const contextRule = contextRuleIndex.get(mod.resetValue.toString())
            ?? contextRuleIndex.get(ALL_ATTRIBUTE_TYPES);;
        if (contextRule?.information.mandatoryContexts?.length) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:cannot_reset_mandatory_contexts", {
                    oid: mod.resetValue.toString(),
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_contextViolation,
                            mod.resetValue,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        return executeResetValue(target, mod.resetValue, ...commonArguments);
    }
    else if ("replaceValues" in mod) {
        check(mod.replaceValues.type_, false);
        await checkPassword(mod.replaceValues);
        checkPreclusion(mod.replaceValues.type_);
        const attrWithDefaultContexts = checkContextRule(mod.replaceValues);
        return executeReplaceValues(target, attrWithDefaultContexts, ...commonArguments);
    }
    else {
        // TODO: Log not-understood alternative.
        return []; // Any other alternative not understood.
    }
}

/**
 * @summary The modifyEntry operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `modifyEntry` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 12.3. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.1.3.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function modifyEntry (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_ModifyEntryArgument(state.operationArgument);
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
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const timeLimitEndTime: Date | undefined = state.chainingArguments.timeLimit
        ? getDateFromTime(state.chainingArguments.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
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
    };
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
    const isSubentry: boolean = Boolean(target.dse.subentry);
    const isAlias: boolean = Boolean(target.dse.alias);
    const isExtensible: boolean = target.dse.objectClass.has(extensibleObject.toString());
    // const isParent: boolean = target.dse.objectClass.has(id_oc_parent.toString());
    // const isChild: boolean = target.dse.objectClass.has(id_oc_child.toString());
    const isEntry: boolean = (!isSubentry && !isAlias);
    const isFirstLevel: boolean = !!target.immediateSuperior?.dse.root;
    const manageDSAIT: boolean = (state.effectiveServiceControls?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const noSubtypeSelection: boolean = (
        state.effectiveServiceControls?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT);
    const dontSelectFriends: boolean = (
        state.effectiveServiceControls?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT);
    const attributeSizeLimit: number | undefined = (
        Number.isSafeInteger(Number(data.serviceControls?.attributeSizeLimit))
        && (Number(data.serviceControls?.attributeSizeLimit) >= MINIMUM_MAX_ATTR_SIZE)
    )
        ? Number(data.serviceControls!.attributeSizeLimit)
        : undefined;
    const EQUALITY_MATCHER = getNamingMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const targetDN = getDistinguishedName(target);
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantSubentries: Vertex[] = ctx.config.bulkInsertMode
        ? []
        : (await Promise.all(
            state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
        )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = await getACIItems(
        ctx,
        accessControlScheme,
        target.immediateSuperior,
        target,
        relevantSubentries,
        Boolean(target.dse.subentry),
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

    const authorizedToEntry = (permissions: number[]): boolean => !accessControlScheme || acdf(
        ctx,
        accessControlScheme,
        assn,
        target,
        permissions,
        relevantTuples,
        user,
        {
            entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
        },
        bacSettings,
        true,
    );

    if (!ctx.config.bulkInsertMode && accessControlScheme) {
        const authorizedToModifyEntry: boolean = authorizedToEntry([ PERMISSION_CATEGORY_MODIFY ]);
        if (!authorizedToModifyEntry) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_modify_entry"),
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

    const requiredAttributes: Set<IndexableOID> = new Set();
    const precludedAttributes: Set<IndexableOID> = new Set();
    const permittedAuxiliaries: Set<IndexableOID> = new Set();
    const contextRulesIndex: ContextRulesIndex = new Map();
    const subschemaSubentry = await getSubschemaSubentry(ctx, target, new Map());
    if (!ctx.config.bulkInsertMode && subschemaSubentry && !isSubentry) {
        const contentRule = (subschemaSubentry.dse.subentry?.ditContentRules ?? [])
            // .find(), because there should only be one per SOC.
            .find((rule) => (
                !rule.obsolete
                && target.dse.structuralObjectClass
                && rule.structuralObjectClass.isEqualTo(target.dse.structuralObjectClass)
            ));
        contentRule?.mandatory?.forEach((ma) => requiredAttributes.add(ma.toString()));
        contentRule?.precluded?.forEach((pa) => precludedAttributes.add(pa.toString()));
        contentRule?.auxiliaries?.forEach((aux) => permittedAuxiliaries.add(aux.toString()));
        const contextUseRules = (subschemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        contextUseRules.forEach((rule) => contextRulesIndex.set(rule.identifier.toString(), rule));
    }

    const pendingUpdates: Prisma.PrismaPromise<any>[] = [];
    const patch: Patch = {
        addedValues: new Map(),
        removedValues: new Map(),
        removedAttributes: new Set(),
    };
    for (const mod of data.changes) {
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
        checkTimeLimit();
        pendingUpdates.push(
            ...(await executeEntryModification(
                ctx,
                state,
                relevantSubentries,
                assn,
                user,
                target,
                targetDN,
                mod,
                patch,
                accessControlScheme,
                relevantTuples,
                precludedAttributes,
                contextRulesIndex,
                isSubentry,
                manageDSAIT,
                state.chainingArguments.aliasDereferenced,
                signErrors,
            )),
        );
    }

    /**
     * Unfortunately, we have to check the whole patch to make sure that the
     * user did not attempt to sneak a non-permitted number of values for
     * given attribute types by breaking added values up into separate
     * modifications.
     */
    for (const [ type_, values ] of patch.addedValues.entries()) {
        const spec = ctx.attributeTypes.get(type_);
        if (spec?.singleValued && (values.length > 1)) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:single_valued", {
                    context: "added",
                    oid: type_,
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_invalidAttributeSyntax,
                            values[0].type,
                        ),
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
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
        if (!ctx.config.bulkInsertMode && accessControlScheme) {
            const deletedValues = patch.removedValues.get(type_)?.length ?? 0;
            const typeOid = ObjectIdentifier.fromString(type_);
            const authorizedForAttributeType = acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_ADD ],
                relevantTuples,
                user,
                {
                    attributeType: typeOid,
                    valuesCount: (values.length - deletedValues),
                    operational: isOperationalAttributeType(ctx, typeOid),
                },
                bacSettings,
                true,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "*",
                        type: type_,
                    }),
                    notPermittedData(ctx, assn, state.chainingArguments.aliasDereferenced, signErrors),
                    signErrors,
                );
            }
        }
    }

    const attributesThatWillBeRemoved: Set<IndexableOID> = new Set(patch.removedAttributes.values());
    for (const [ type_, removedValues ] of patch.removedValues.entries()) {
        const spec = ctx.attributeTypes.get(type_);
        const alreadyPresentValues: number = spec?.driver?.countValues
            ? await spec.driver.countValues(ctx, target, relevantSubentries)
            : await ctx.db.attributeValue.count({
                where: {
                    entry_id: target.dse.id,
                    type_oid: spec?.id.toBytes() ?? removedValues[0].type.toBytes(),
                },
            });
        if (removedValues.length < alreadyPresentValues) {
            continue;
        }
        if (spec?.driver?.hasValue) {
            const everyValueDeleted: boolean = (await Promise.all(
                removedValues.map((rv) => spec.driver!.hasValue!(ctx, target, rv)))).every((d) => d);
            if (everyValueDeleted) {
                attributesThatWillBeRemoved.add(type_);
            }
        } else {
            const typeOID = ObjectIdentifier.fromString(type_);
            const matcher = EQUALITY_MATCHER(typeOID);
            const existingValues = await readValuesOfType(ctx, target, typeOID);
            const everyValueDeleted: boolean = existingValues
                .every((v) => removedValues
                    .some((rv) => matcher
                        ? matcher(v.value, rv.value)
                        : compareElements(v.value, rv.value)));
            if (everyValueDeleted) {
                attributesThatWillBeRemoved.add(type_);
            }
        }
    }

    const optionalAttributes: Set<IndexableOID> = new Set(
        attributeTypesPermittedForEveryEntry.map((oid) => oid.toString()),
    );
    if (isEntry) {
        optionalAttributes.add(id_oa_collectiveExclusions.toString());
        optionalAttributes.add(administrativeRole["&id"].toString());
        optionalAttributes.add(id_aca_accessControlScheme.toString());
        optionalAttributes.add(id_aca_subentryACI.toString());
        optionalAttributes.add(hierarchyParent["&id"].toString());
        optionalAttributes.add(governingStructureRule["&id"].toString());
    }
    if (isSubentry) {
        optionalAttributes.add(id_aca_prescriptiveACI.toString());
    }
    const addedObjectClasses = patch.addedValues.get(objectClass["&id"].toString())
        ?.map((value) => value.value.objectIdentifier) ?? [];
    if (addedObjectClasses.some((oc) => oc.isEqualTo(subschema["&id"]))) {
        const subschemaThatAlreadyExists = await ctx.db.entry.findFirst({
            where: {
                immediate_superior_id: target.immediateSuperior!.dse.id,
                ...getEntryExistsFilter(),
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
        const subtreeSpecAdded = patch.addedValues.get(subtreeSpecification["&id"].toString());
        const subtreeSpecRemoved = patch.removedValues.get(subtreeSpecification["&id"].toString());
        if (subtreeSpecAdded || subtreeSpecRemoved) {
            const existingSubtrees = await ctx.db.attributeValue.count({
                where: {
                    entry_id: target.dse.id,
                    type_oid: subtreeSpecification["&id"].toBytes(),
                },
            });
            const totalSubtrees = (existingSubtrees + (subtreeSpecAdded?.length ?? 0) - (subtreeSpecRemoved?.length ?? 0));
            if (totalSubtrees > 0) {
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
            const invalidSubtreeForSubschema = (subtreeSpecAdded ?? [])
                .map((v) => _decode_SubtreeSpecification(v.value))
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
    }
    for (const ocid of addedObjectClasses) {
        if (ctx.config.bulkInsertMode) {
            continue;
        }
        const spec = ctx.objectClasses.get(ocid.toString());
        if (!spec) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:unrecognized_object_class", {
                    oid: ocid.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(ocid, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
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
        if (spec.obsolete) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_add_obsolete_oc", {
                    oid: ocid.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(ocid, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
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
        /**
         * NOTE: You cannot even tolerate modifications that make the entry a
         * subclass of the original structural object class for these reasons
         * (inclusively):
         *
         * 1. ITU Recommendation X.501 (2016), Section 8.3.2 specifically
         *    forbids it.
         * 2. Entries are constrained by where they can be placed in the DIT by
         *    their structural object class, with no supertyping or subtying
         *    being taken into consideration.
         */
        if (spec.kind === ObjectClassKind.structural) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_change_soc", {
                    oid: ocid.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassModificationProhibited,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(ocid, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
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
        } else if (
            (spec.kind === ObjectClassKind_auxiliary)
            && !permittedAuxiliaries.has(spec.id.toString())
            && !isSubentry // Subentries are not regulated by subschema.
        ) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:aux_oc_not_permitted_by_dit_content_rule", {
                    aoc: spec.id.toString(),
                    soc: target.dse.structuralObjectClass?.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(spec.id, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
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
        Array.from(spec.mandatoryAttributes).forEach((attr) => requiredAttributes.add(attr));
        Array.from([
            ...spec.mandatoryAttributes.values(),
            ...spec.optionalAttributes.values(),
        ]).forEach((attr) => optionalAttributes.add(attr));
    }
    const alreadyPresentObjectClasses = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    for (const ocid of alreadyPresentObjectClasses) {
        const spec = ctx.objectClasses.get(ocid.toString());
        if (!spec) {
            // Note that we do not throw here, because that would make it
            // impossible to modify an entry that has an unrecognized object
            // class.
            ctx.log.warn(ctx.i18n.t("log:entry_has_unrecognized_object_class", {
                oid: ocid.toString(),
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(state.invokeId),
            });
            continue;
        }
        Array.from(spec.mandatoryAttributes).forEach((attr) => requiredAttributes.add(attr));
        Array.from([
            ...spec.mandatoryAttributes.values(),
            ...spec.optionalAttributes.values(),
        ]).forEach((attr) => optionalAttributes.add(attr));
    }

    if (!ctx.config.bulkInsertMode) { // Check required attributes
        const missingRequiredAttributeTypes: Set<IndexableOID> = new Set();
        for (const ra of Array.from(requiredAttributes)) {
            // Check that no required attributes are removed.
            if (attributesThatWillBeRemoved.has(ra)) {
                missingRequiredAttributeTypes.add(ra);
                continue;
            }
            // Check that all newly-required attributes are...
            const deltaValues = patch.addedValues.get(ra);
            if (!deltaValues?.length) { // added if not already present.
                const spec = ctx.attributeTypes.get(ra);
                const alreadyPresentValues: number = spec?.driver?.countValues
                    ? await spec.driver.countValues(ctx, target, relevantSubentries)
                    : await ctx.db.attributeValue.count({
                        where: {
                            entry_id: target.dse.id,
                            type_oid: ObjectIdentifier.fromString(ra).toBytes(),
                        },
                    });
                if (alreadyPresentValues === 0) {
                    missingRequiredAttributeTypes.add(ra);
                }
            }
        }
        if (missingRequiredAttributeTypes.size > 0) {
            const missing: string[] = Array.from(missingRequiredAttributeTypes);
            throw new errors.UpdateError(
                // FIXME: i18n
                `Missing required attribute types: ${missing.join(" ")}`,
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    missing
                        .map(ObjectIdentifier.fromString)
                        .map((attributeType) => ({ attributeType })),
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
    }
    const addsExtensibleObjectClass: boolean = addedObjectClasses
        .some((oc) => oc.isEqualTo(extensibleObject));
    if (
        !ctx.config.bulkInsertMode
        && !isExtensible
        && !addsExtensibleObjectClass
        && !isSubentry
    ) { // Check optional attributes
        const nonPermittedAttributeTypes: Set<IndexableOID> = new Set();
        for (const type_ of Array.from(patch.addedValues.keys())) {
            if (!optionalAttributes.has(type_.toString())) {
                if (isSubentry && ctx.attributeTypes.get(type_.toString())?.collective) {
                    continue; // You can write any collective attribute to a subentry.
                }
                nonPermittedAttributeTypes.add(type_);
            }
        }
        if (nonPermittedAttributeTypes.size > 0) {
            const nonPermitted: string[] = Array.from(nonPermittedAttributeTypes);
            throw new errors.UpdateError(
                ctx.i18n.t("err:attribute_type_not_permitted_by_oc", {
                    oids: nonPermitted.join(", "),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    nonPermitted
                        .map(ObjectIdentifier.fromString)
                        .map((attributeType) => ({ attributeType })),
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
    }

    if (!ctx.config.bulkInsertMode) { // Other validation.
        const objectClasses = [
            ...alreadyPresentObjectClasses,
            ...addedObjectClasses,
        ];
        if (!validateObjectClasses(ctx, objectClasses)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:invalid_object_classes"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
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

        /**
         * From ITU Recommendation X.501 (2016), Section 13.3.3:
         *
         * > The parent object class is derived by the presence of an
         * > immediately subordinate family member, marked by the presence of
         * > a child object class value. It may not be directly administered.
         */
        {
            const hasParentObjectClass: boolean = addedObjectClasses
                .some((oc) => oc.isEqualTo(parent["&id"]));
            if (hasParentObjectClass) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:cannot_add_object_class_parent"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    objectClass["&id"],
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

        const hasChildObjectClass: boolean = objectClasses
            .some((oc) => oc.isEqualTo(child["&id"]));
        const hasAliasObjectClass: boolean = objectClasses
            .some((oc) => oc.isEqualTo(alias["&id"]));

        if (hasChildObjectClass) {
            if (isFirstLevel) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:cannot_be_first_level_and_child"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    objectClass["&id"],
                                    [
                                        _encodeObjectIdentifier(alias["&id"], DER),
                                        _encodeObjectIdentifier(child["&id"], DER),
                                    ],
                                    undefined,
                                ),
                            },
                        ],
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
            /**
             * From ITU Recommendation X.501 (2016), Section 13.3.3:
             *
             * > Neither the parent nor the child object classes shall be combined
             * > with the alias object class to form an alias entry.
             */
            if (hasAliasObjectClass) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:cannot_be_alias_and_child"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    objectClass["&id"],
                                    [
                                        _encodeObjectIdentifier(alias["&id"], DER),
                                        _encodeObjectIdentifier(child["&id"], DER),
                                    ],
                                    undefined,
                                ),
                            },
                        ],
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
        }
        if (target.dse.objectClass.has(parent["&id"].toString()) && hasAliasObjectClass) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_be_alias_and_parent"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(alias["&id"], DER),
                                    _encodeObjectIdentifier(parent["&id"], DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
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
        const inHierarchy = await ctx.attributeTypes
            .get(hierarchyParent["&id"].toString())!.driver!.isPresent!(ctx, target);
        if (
            hasChildObjectClass
            && (patch.addedValues.has(hierarchyParent["&id"].toString()) || inHierarchy)
        ) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:child_cannot_be_in_hierarchy"),
                new UpdateErrorData(
                    UpdateProblem_familyRuleViolation,
                    [
                        {
                            attributeType: hierarchyParent["&id"],
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
    const isAdmPoint: boolean = patch.addedValues.has(administrativeRole["&id"].toString());
    pendingUpdates.unshift(ctx.db.entry.update({
        where: {
            id: target.dse.id,
        },
        data: {
            modifiersName: user?.dn.map(rdnToJson),
            modifyTimestamp: new Date(),
            admPoint: isAdmPoint || undefined, // Even if no new admin roles were added, it could already be an admin point.
        },
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
    checkTimeLimit();
    try {
        await ctx.db.$transaction(pendingUpdates);
    } catch (e) {
        // If the update failed, reload the entry to negate any in-memory
        // changes that took place. This same code exists in modifyDN.
        const dbe = await ctx.db.entry.findUnique({
            where: {
                id: target.dse.id,
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
        if (dbe) {
            try {
                target.dse = await dseFromDatabaseEntry(ctx, dbe);
            } catch {
                // NOOP: This succeeding is not really that critical. This can
                // silently fail.
            }
        }
        throw e;
    }
    const dbe = await ctx.db.entry.findUnique({
        where: {
            id: target.dse.id,
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
    if (dbe) {
        target.dse = await dseFromDatabaseEntry(ctx, dbe);
    } else {
        ctx.log.warn(ctx.i18n.t("log:entry_deleted_while_being_modified", {
            id: target.dse.uuid,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId(state.invokeId),
        });
    }
    ctx.log.debug(ctx.i18n.t("log:mod_entry", {
        aid: assn.id,
        dn: stringifyDN(ctx, targetDN),
        id: target.dse.id,
        uuid: target.dse.uuid,
        euuid: target.dse.entryUUID,
    }));

    if (
        patch.addedValues.has(USER_PASSWORD)
        || patch.addedValues.has(USER_PWD)
    ) {
        ctx.log.info(ctx.i18n.t("log:password_changed", {
            cid: assn.id,
            uuid: target.dse.uuid,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId(state.invokeId),
        });
    }

    /**
     * The X.500 specifications state that first-level DSEs MUST be
     * administrative points, but does not elaborate. For technical reasons, it
     * is hard to check _before_ the update if all values of
     * `administrativeRole` have been removed, and therefore, that the entry is
     * no longer an administrative point. However, we can _automatically_
     * make the entry an autonomous administrative point if it no longer appears
     * to be an administrative point. This means that users will no longer be
     * presented with an error if they modify first-level DSEs such that they
     * are no longer administrative points, but it gets the job done.
     */
    if (!target.dse.admPoint && target.immediateSuperior?.dse.root) {
        const autonomousId = _encodeObjectIdentifier(id_ar_autonomousArea, DER);
        await ctx.db.$transaction([
            ctx.db.entry.update({
                where: {
                    id: target.dse.id,
                },
                data: {
                    admPoint: true,
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ctx.db.attributeValue.create({
                data: {
                    entry_id: target.dse.id,
                    type_oid: administrativeRole["&id"].toBytes(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.objectIdentifier,
                    content_octets: autonomousId.value,
                    jer: id_ar_autonomousArea.toJSON(),
                    normalized_str: id_ar_autonomousArea.toString(),
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
        ]);
        const dbe = await ctx.db.entry.findUnique({
            where: {
                id: target.dse.id,
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
        if (dbe) {
            target.dse = await dseFromDatabaseEntry(ctx, dbe);
        } else {
            ctx.log.warn(ctx.i18n.t("log:entry_deleted_while_being_modified", {
                id: target.dse.uuid,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(state.invokeId),
            });
        }
    }

    // Update relevant hierarchical operational bindings
    if (!ctx.config.bulkInsertMode && (target.dse.admPoint || target.dse.subentry)) {
        const admPoint: Vertex | undefined = target.dse.admPoint
            ? target
            : target.immediateSuperior;
        assert(admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        updateAffectedSubordinateDSAs(ctx, admPointDN); // INTENTIONAL_NO_AWAIT
        // DEVIATION: from the specification: we update the subordinates AFTER we update the DN locally.
        if (target.dse.subentry && target.immediateSuperior?.dse.cp) {
            // DEVIATION:
            // The specification does NOT say that you have to update the
            // superior's subentries for the new CP. Meerkat DSA does this
            // anyway, just without awaiting.
            updateSuperiorDSA(
                ctx,
                targetDN.slice(0, -1),
                target.immediateSuperior,
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
                });
        }
    }

    const sobs = await getShadowIncrementalSteps(ctx, target, { modify: data.changes });
    for (const [ sob_id, sob_obid, sob_change ] of sobs) {
        const change = new SubordinateChanges(
            target.dse.rdn,
            sob_change,
        );
        saveIncrementalRefresh(ctx, sob_id, target.immediateSuperior!, change)
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
    let resultData: ModifyEntryResultData = new ModifyEntryResultData(
        undefined,
        [],
        createSecurityParameters(
            ctx,
            signResults,
            assn.boundNameAndUID?.dn,
            id_opcode_modifyEntry,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );

    if (
        data.selection
        && (
            !accessControlScheme
            || authorizedToEntry([ PERMISSION_CATEGORY_READ ])
        )
    ) {
        const permittedEntryInfo = await readPermittedEntryInformation(
            ctx,
            assn,
            target,
            user,
            relevantTuples,
            accessControlScheme,
            {
                selection: data.selection,
                relevantSubentries,
                operationContexts: data.operationContexts,
                attributeSizeLimit,
                noSubtypeSelection,
                dontSelectFriends,
                outputAttributeTypes: state.outputAttributeTypes,
            },
        );
        const familyReturn = state.effectiveFamilyReturn ?? data.selection?.familyReturn;
        if (
            target.dse.familyMember
            && familyReturn
            && (familyReturn.memberSelect !== FamilyReturn_memberSelect_contributingEntriesOnly)
            && (familyReturn.memberSelect !== FamilyReturn_memberSelect_participatingEntriesOnly)
        ) {
            const familySelect: Set<IndexableOID> | null = familyReturn.familySelect?.length
                ? new Set(familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const family = await readFamily(ctx, target);
            const familyMembers: Vertex[] = readCompoundEntry(family).next().value;
            const permittedEinfos = await Promise.all(
                familyMembers
                    .slice(1) // Skip the first member, which is the read entry.
                    .map((member) => readPermittedEntryInformation(
                        ctx,
                        assn,
                        member,
                        user,
                        relevantTuples,
                        accessControlScheme,
                        {
                            selection: data.selection,
                            relevantSubentries,
                            operationContexts: data.operationContexts,
                            outputAttributeTypes: state.outputAttributeTypes,
                        },
                    )),
            );
            const permittedEinfoIndex: Map<number, EntryInformation_information_Item[]> = new Map(
                permittedEinfos.map((einfo, i) => [ familyMembers[i].dse.id, einfo.information ]),
            );
            const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
                family,
                (vertex: Vertex) => permittedEinfoIndex.get(vertex.dse.id) ?? [],
            )
                .filter((fe) => (!familySelect || familySelect.has(fe.family_class.toString())));
            const familyInfoAttr: Attribute = new Attribute(
                family_information["&id"],
                familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
                undefined,
            );
            permittedEntryInfo.information.push({
                attribute: familyInfoAttr,
            });
        }
        resultData = new ModifyEntryResultData(
            new EntryInformation(
                {
                    rdnSequence: getDistinguishedName(target),
                },
                !target.dse.shadow,
                permittedEntryInfo.information,
                permittedEntryInfo.discloseIncompleteEntry
                    ? permittedEntryInfo.incompleteEntry
                    : false,
                undefined,
                undefined,
            ),
            resultData._unrecognizedExtensionsList,
            resultData.securityParameters,
            resultData.performer,
            resultData.aliasDereferenced,
            resultData.notification,
        );
    }

    const result: ModifyEntryResult = signResults
        ? {
            information: (() => {
                const resultDataBytes = _encode_ModifyEntryResultData(resultData, DER).toBytes();
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
                        id_opcode_modifyEntry,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_ModifyEntryResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_modifyEntry),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                modifications: data.changes.map(getEntryModificationStatistics),
                eis: data.selection
                    ? getEntryInformationSelectionStatistics(data.selection)
                    : undefined,
            }), undefined),
        },
    };
}

export default modifyEntry;

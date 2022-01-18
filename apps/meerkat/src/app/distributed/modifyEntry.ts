import {
    Context,
    IndexableOID,
    Vertex,
    Value,
    ClientConnection,
    OperationReturn,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryResult,
    _encode_ModifyEntryResult,
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
import { AttributeErrorData_problems_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    BERElement,
    DERElement,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    ASN1Construction,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
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
import type { PrismaPromise } from "@prisma/client";
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
import bacACDF, {
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
    ModifyEntryResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResultData.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEntryModificationStatistics from "../telemetry/getEntryModificationStatistics";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics";
import validateObjectClasses from "../x500/validateObjectClasses";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
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
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import { MINIMUM_MAX_ATTR_SIZE } from "../constants";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import { addValue } from "../database/drivers/administrativeRole";
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

type ValuesIndex = Map<IndexableOID, Value[]>;
type ContextRulesIndex = Map<IndexableOID, DITContextUseDescription>;
interface Patch {
    addedValues: ValuesIndex;
    removedValues: ValuesIndex;
    removedAttributes: Set<IndexableOID>;
}

const USER_PASSWORD: string = userPassword["&id"].toString();
const USER_PWD: string = userPwd["&id"].toString();

const notPermittedData =  (
    ctx: Context,
    conn: ClientConnection,
    aliasDereferenced?: boolean,
) => new SecurityErrorData(
    SecurityProblem_insufficientAccessRights,
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
    aliasDereferenced,
    undefined,
);

function isAcceptableTypeForAlterValues (el: ASN1Element): boolean {
    return (
        (el.tagClass === ASN1TagClass.universal)
        && (
            (el.tagNumber === ASN1UniversalType.integer)
            || (el.tagNumber === ASN1UniversalType.realNumber)
        )
    );
}

function getValueAlterer (
    ctx: Context,
    vertex: Vertex,
    type_: OBJECT_IDENTIFIER,
    toBeAddedElement: ASN1Element,
    aliasDereferenced?: boolean,
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
            );
        }
        if (value.value.tagNumber !== toBeAddedElement.tagNumber) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:invalid_type_for_alter_values"),
                attributeErrorData(),
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

function checkAttributeArity (
    ctx: Context,
    conn: ClientConnection,
    target: Vertex,
    attr: Attribute,
    aliasDereferenced?: boolean,
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
                oids: TYPE_OID,
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
}

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
            type: TYPE_OID,
        },
        select: {
            id: true,
        },
    }));
}

// FIXME: Why is this here?
function checkEqualityMatchingPermitted (
    ctx: Context,
    target: Vertex,
    type_: AttributeType,
): boolean {
    const TYPE_OID: string = type_.toString();
    const spec = ctx.attributeTypes.get(TYPE_OID);
    return !!spec?.equalityMatchingRule;
}

function checkPermissionToAddValues (
    modificationType: "addAttribute" | "addValues",
    attribute: Attribute,
    ctx: Context,
    user: NameAndOptionalUID | undefined | null,
    conn: ClientConnection,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): void {
    if (
        !accessControlScheme
        || !accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        return;
    }
    const values = valuesFromAttribute(attribute);
    const {
        authorized: authorizedForAttributeType,
    } = bacACDF(
        relevantACDFTuples,
        user,
        {
            attributeType: attribute.type_,
        },
        [
            PERMISSION_CATEGORY_ADD,
        ],
        bacSettings,
        true,
    );
    if (!authorizedForAttributeType) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:not_authz_mod", {
                mod: modificationType,
                type: attribute.type_.toString(),
            }),
            notPermittedData(ctx, conn, aliasDereferenced),
        );
    }
    for (const value of values) {
        const {
            authorized: authorizedForValue,
        } = bacACDF(
            relevantACDFTuples,
            user,
            {
                value: new AttributeTypeAndValue(
                    value.type,
                    value.value,
                ),
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            bacSettings,
            true,
        );
        if (!authorizedForValue) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: modificationType,
                    type: attribute.type_.toString(),
                }),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
    }
}

function checkAbilityToModifyAttributeType (
    ctx: Context,
    conn: ClientConnection,
    attributeType: AttributeType,
    entry: Vertex,
    targetDN: DistinguishedName,
    isSubentry: boolean,
    manageDSAIT: boolean,
    isRemoving: boolean, // For accomodating obsolete attribute types.
    aliasDereferenced?: boolean,
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
}

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

async function executeAddAttribute (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    checkAttributeArity(ctx, conn, entry, mod, aliasDereferenced);
    /**
     * This is done before checking if the attribute is already present to avoid
     * disclosing its presence. Once you've added the attribute, its presence is
     * already known, so this is not a problem beyond this point.
     */
    checkPermissionToAddValues(
        "addAttribute",
        mod,
        ctx,
        user,
        conn,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    const values = valuesFromAttribute(mod);
    addValuesToPatch(patch, mod.type_, values, bacSettings.getEqualityMatcher(mod.type_));
    return addValues(ctx, entry, values);
}

async function executeRemoveAttribute (
    mod: AttributeType,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        )
    }
    /**
     * This is intentionally checked before even checking if the attribute is
     * present so that we avoid revealing whether it exists already or not.
     */
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const { authorized: authorizedForAttributeType } = bacACDF(
            relevantACDFTuples,
            user,
            { attributeType: mod },
            [ PERMISSION_CATEGORY_REMOVE ],
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "removeAttribute",
                    type: mod.toString(),
                }),
                notPermittedData(ctx, conn, aliasDereferenced),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    const TYPE_OID: string = mod.toString();
    patch.addedValues.delete(TYPE_OID);
    patch.removedValues.delete(TYPE_OID); // Delete because we removed the whole attribute anyway.
    patch.removedAttributes.add(TYPE_OID);
    return removeAttribute(ctx, entry, mod);
    // REVIEW: Do you want to also fail if per-value remove is not granted?
}

async function executeAddValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    checkAttributeArity(ctx, conn, entry, mod, aliasDereferenced);
    checkPermissionToAddValues(
        "addValues",
        mod,
        ctx,
        user,
        conn,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
    );
    const values = valuesFromAttribute(mod);
    addValuesToPatch(patch, mod.type_, values, bacSettings.getEqualityMatcher(mod.type_));
    return addValues(ctx, entry, values);
}

async function executeRemoveValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    // FIXME: Use the naming matcher here.
    const EQUALITY_MATCHER = bacSettings.getEqualityMatcher(mod.type_);
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        )
    }
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const {
            authorized: authorizedForAttributeType,
        } = bacACDF(
            relevantACDFTuples,
            user,
            { attributeType: mod.type_ },
            [ PERMISSION_CATEGORY_REMOVE ],
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "removeValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
        for (const value of values) {
            const {
                authorized: authorizedForValue,
            } = bacACDF(
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                },
                [ PERMISSION_CATEGORY_REMOVE ],
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "removeValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, conn, aliasDereferenced),
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

async function executeAlterValues (
    mod: AttributeTypeAndValue,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
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
                    undefined,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const { authorized: authorizedForAttributeType } = bacACDF(
            relevantACDFTuples,
            user,
            { attributeType: mod.type_ },
            [
                PERMISSION_CATEGORY_MODIFY, // DEVIATION: More strict than spec.
                PERMISSION_CATEGORY_REMOVE,
            ],
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "alterValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
    }
    const alterer = getValueAlterer(ctx, entry, mod.type_, mod.value, aliasDereferenced);
    const values = await readValuesOfType(ctx, entry, mod.type_);
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        for (const value of values) {
            const { authorized: authorizedForValue } = bacACDF(
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                },
                // DEVIATON: X.511 requires Add permissions, but I think this is
                // a mistake. Why would you need permission to add values that
                // you are changing? Instead, Meerkat DSA checks for modify and
                // remove permissions.
                [
                    PERMISSION_CATEGORY_MODIFY,
                    PERMISSION_CATEGORY_REMOVE,
                ],
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "alterValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const newValues = values.map(alterer);
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        for (const value of newValues) {
            const { authorized: authorizedForValue } = bacACDF(
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        value.type,
                        value.value,
                    ),
                },
                // DEVIATON: X.511 does not explicitly require add permissions
                // for the newly-produced values, but I think this is an error.
                [ PERMISSION_CATEGORY_ADD ],
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "alterValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, conn, aliasDereferenced),
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
        ...(await addValues(ctx, entry, newValues)),
    ];
}

async function executeResetValue (
    mod: AttributeType,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    const where = {
        entry_id: entry.dse.id,
        type: mod.toString(),
        ContextValue: {
            some: {
                fallback: false,
            },
        },
    };
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        // This is not incorrect. Contexts are only maintained for userApplications
        // attribute types, so this mod can just read right from this table.
        const rows = await ctx.db.attributeValue.findMany({
            where,
            select: {
                ber: true,
            },
        });
        for (const row of rows) {
            const el = new BERElement();
            el.fromBytes(row.ber);
            const {
                authorized: authorizedForAttributeType,
            } = bacACDF(
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        mod,
                        el,
                    ),
                },
                [
                    PERMISSION_CATEGORY_REMOVE,
                ],
                bacSettings,
                true,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "resetValue",
                        type: mod.toString(),
                    }),
                    notPermittedData(ctx, conn, aliasDereferenced),
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

async function executeReplaceValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    user: NameAndOptionalUID | undefined | null,
    entry: Vertex,
    patch: Patch,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    checkAttributeArity(ctx, conn, entry, mod, aliasDereferenced);
    const TYPE_OID: string = mod.type_.toString();
    const values = valuesFromAttribute(mod);
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const {
            authorized: authorizedForAttributeType,
        } = bacACDF(
            relevantACDFTuples,
            user,
            {
                attributeType: mod.type_,
            },
            [ PERMISSION_CATEGORY_ADD ],
            bacSettings,
            true,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod", {
                    mod: "replaceValues",
                    type: mod.type_.toString(),
                }),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
        const existingValues = await readValuesOfType(ctx, entry, mod.type_);
        for (const xv of existingValues) {
            const {
                authorized: authorizedForValue,
            } = bacACDF(
                relevantACDFTuples,
                user,
                {
                    value: new AttributeTypeAndValue(
                        mod.type_,
                        xv.value,
                    ),
                },
                [ PERMISSION_CATEGORY_REMOVE ],
                bacSettings,
                true,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "replaceValues",
                        type: mod.type_.toString(),
                    }),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    const oldValues = await readValuesOfType(ctx, entry, mod.type_);
    patch.removedValues.set(TYPE_OID, oldValues);
    addValuesToPatch(patch, mod.type_, values, bacSettings.getEqualityMatcher(mod.type_));
    return [
        ...(await removeAttribute(ctx, entry, mod.type_)),
        // Last argument to addValues() is false, because we don't want to check
        // if the potentially added values already exist, because we are just
        // going to wipe out all that exist and replace them.
        ...(await addValues(ctx, entry, values, undefined, false)),
    ];
}

/**
 * This function both checks that the DIT context use rules are satisfied
 * and applies default context values, if there are any defined. These are
 * separate features, but it turns out that they innately share a lot of
 * code, so it will preferable to merge these two features into a single
 * function.
 *
 * Note that we do not handle the default context value post-processing
 * steps described in ITU Recommendation X.501 (2016), Section 13.9.2. As
 * far as I can see, these only exist to save storage space.
 */
function handleContextRule (
    ctx: Context,
    conn: ClientConnection,
    targetDN: DistinguishedName,
    attribute: Attribute,
    contextRuleIndex: ContextRulesIndex,
    aliasDereferenced?: boolean,
): Attribute {
    const rule = contextRuleIndex.get(attribute.type_.toString());
    if (!rule) {
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
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
                            conn.boundNameAndUID?.dn,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        attributeError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
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
 * From ITU Recommendation X.501 (2016), Section 13.4.7:
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
 */
async function executeEntryModification (
    ctx: Context,
    conn: ClientConnection,
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
): Promise<PrismaPromise<any>[]> {

    const commonArguments = [
        ctx,
        conn,
        user,
        entry,
        patch,
        accessControlScheme,
        relevantACDFTuples,
        aliasDereferenced,
    ] as const;

    const check = (attributeType: AttributeType, isRemoving: boolean) => {
        checkAbilityToModifyAttributeType(
            ctx,
            conn,
            attributeType,
            entry,
            targetDN,
            isSubentry,
            manageDSAIT,
            isRemoving,
            aliasDereferenced,
        );
    };

    const checkContextRule = (attribute: Attribute): Attribute => {
        return handleContextRule(
            ctx,
            conn,
            targetDN,
            attribute,
            contextRuleIndex,
            aliasDereferenced,
        );
    };

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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
    };

    if ("addAttribute" in mod) {
        check(mod.addAttribute.type_, false);
        checkPreclusion(mod.addAttribute.type_);
        const attrWithDefaultContexts = checkContextRule(mod.addAttribute);
        return executeAddAttribute(attrWithDefaultContexts, ...commonArguments);
    }
    else if ("removeAttribute" in mod) {
        check(mod.removeAttribute, true);
        return executeRemoveAttribute(mod.removeAttribute, ...commonArguments);
    }
    else if ("addValues" in mod) {
        check(mod.addValues.type_, false);
        checkPreclusion(mod.addValues.type_);
        const attrWithDefaultContexts = checkContextRule(mod.addValues);
        return executeAddValues(attrWithDefaultContexts, ...commonArguments);
    }
    else if ("removeValues" in mod) {
        check(mod.removeValues.type_, true);
        return executeRemoveValues(mod.removeValues, ...commonArguments);
    }
    else if ("alterValues" in mod) {
        check(mod.alterValues.type_, false);
        return executeAlterValues(mod.alterValues, ...commonArguments);
    }
    else if ("resetValue" in mod) {
        check(mod.resetValue, true);
        return executeResetValue(mod.resetValue, ...commonArguments);
    }
    else if ("replaceValues" in mod) {
        check(mod.replaceValues.type_, false);
        checkPreclusion(mod.replaceValues.type_);
        const attrWithDefaultContexts = checkContextRule(mod.replaceValues);
        return executeReplaceValues(attrWithDefaultContexts, ...commonArguments);
    }
    else {
        return []; // Any other alternative not understood.
    }
}

/**
 * @summary Modify an entry
 * @description
 *
 * ## Implementation
 *
 * ### Schema Validation
 *
 * ### System Schema Validation
 *
 * There are some attributes that may be added to any entry of any object class,
 * such as `administrativeRole`, because there is no object class defined for
 * every DSE type, and thus, these special attributes are used to validate if
 * the DSE is, de facto, of a given type.
 *
 * Continuing on the aforementioned example, the mere presence of an
 * `administrativeRole` attribute is what determines whether Meerkat DSA views
 * the entry as an administrative point.
 *
 * @param ctx
 * @param target
 * @param admPoints
 * @param request
 * @returns
 */
export
async function modifyEntry (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_ModifyEntryArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(Number(state.invokeId.present))
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
    const isEntry: boolean = (!isSubentry && !isAlias); // REVIEW: I could not find documentation if this is true.
    const isFirstLevel: boolean = !!target.immediateSuperior?.dse.root;
    const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const noSubtypeSelection: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT);
    const dontSelectFriends: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT);
    const attributeSizeLimit: number | undefined = (
        Number.isSafeInteger(Number(data.serviceControls?.attributeSizeLimit))
        && (Number(data.serviceControls?.attributeSizeLimit) >= MINIMUM_MAX_ATTR_SIZE)
    )
        ? Number(data.serviceControls!.attributeSizeLimit)
        : undefined;
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const targetDN = getDistinguishedName(target);
    const user = state.chainingArguments.originator
        ? new NameAndOptionalUID(
            state.chainingArguments.originator,
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
    const relevantACIItems = getACIItems(accessControlScheme, target, relevantSubentries);
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
            state.chainingArguments.authenticationLevel ?? conn.authLevel,
            targetDN,
            isMemberOfGroup,
            NAMING_MATCHER,
        );

    const authorizedToEntry = (permissions: number[]): boolean => {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            user,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            permissions,
            bacSettings,
            true,
        );
        return authorized;
    };

    if (
        !ctx.config.bulkInsertMode
        && accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const authorizedToModifyEntry: boolean = authorizedToEntry([ PERMISSION_CATEGORY_MODIFY ]);
        if (!authorizedToModifyEntry) {
            throw new errors.SecurityError(
                "Not permitted to modify entry.", // FIXME: Internationalize
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
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

    const requiredAttributes: Set<IndexableOID> = new Set();
    const precludedAttributes: Set<IndexableOID> = new Set();
    const permittedAuxiliaries: Set<IndexableOID> = new Set();
    const contextRulesIndex: ContextRulesIndex = new Map();
    const subschemaSubentry = await getSubschemaSubentry(ctx, target);
    if (!ctx.config.bulkInsertMode && subschemaSubentry && !target.dse.subentry) {
        const contentRule = (subschemaSubentry.dse.subentry?.ditContentRules ?? [])
            .filter((rule) => !rule.obsolete)
            // .find(), because there should only be one per SOC.
            .find((rule) => (
                target.dse.structuralObjectClass
                && rule.structuralObjectClass.isEqualTo(target.dse.structuralObjectClass)
            ));
        contentRule?.mandatory?.forEach((ma) => requiredAttributes.add(ma.toString()));
        contentRule?.precluded?.forEach((pa) => precludedAttributes.add(pa.toString()));
        const contextUseRules = (subschemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        contextUseRules.forEach((rule) => contextRulesIndex.set(rule.identifier.toString(), rule));
    }

    const pendingUpdates: PrismaPromise<any>[] = [
        ctx.db.entry.update({
            where: {
                id: target.dse.id,
            },
            data: {
                modifiersName: conn.boundNameAndUID?.dn.map(rdnToJson),
                modifyTimestamp: new Date(),
            },
        }),
    ];
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        checkTimeLimit();
        pendingUpdates.push(
            ...(await executeEntryModification(
                ctx,
                conn,
                user,
                target,
                targetDN,
                mod,
                patch,
                accessControlScheme,
                relevantTuples,
                precludedAttributes,
                contextRulesIndex,
                Boolean(target.dse.subentry),
                manageDSAIT,
                state.chainingArguments.aliasDereferenced,
            )),
        );
    }

    const maxValueCountInUse: boolean = relevantTuples
        .some((tuple) => (tuple[2].maxValueCount !== undefined));
    if (maxValueCountInUse) {
        /**
         * Unfortunately, we have to check the BAC for all add types again, because
         * we have to make sure that the maxValueCount will not be exceeded, if it
         * is defined. This cannot be done within the individual modification
         * executors, because:
         *
         * 1. Nefarious users may try to break up attributes into smaller
         *    modifications so that each attribute individually does not exceed
         *    the limit, even though they do collectively.
         * 2. Some values that are added will be removed by subsequent
         *    modifications.
         */
        for (const [ type_, values ] of patch.addedValues.entries()) {
            const deletedValues = patch.removedValues.get(type_)?.length ?? 0;
            const {
                authorized: authorizedForAttributeType,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: ObjectIdentifier.fromString(type_),
                    valuesCount: (values.length - deletedValues),
                },
                [
                    PERMISSION_CATEGORY_ADD,
                ],
                bacSettings,
                true,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod", {
                        mod: "*",
                        type: type_,
                    }),
                    notPermittedData(ctx, conn, state.chainingArguments.aliasDereferenced),
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
                    type: type_,
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
    }
    if (isSubentry) {
        optionalAttributes.add(id_aca_prescriptiveACI.toString());
    }
    const addedObjectClasses = patch.addedValues.get(objectClass["&id"].toString())
        ?.map((value) => value.value.objectIdentifier) ?? [];
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        } else if (
            (spec.kind === ObjectClassKind_auxiliary)
            && !permittedAuxiliaries.has(spec.id.toString())
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
            }));
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
                            type: ra,
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
                `Missing required attribute types: ${missing.join(" ")}`,
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    missing
                        .map(ObjectIdentifier.fromString)
                        .map((attributeType) => ({ attributeType })),
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
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
    const addsExtensibleObjectClass: boolean = addedObjectClasses
        .some((oc) => oc.isEqualTo(extensibleObject["&id"]));
    if (!ctx.config.bulkInsertMode && !isExtensible && !addsExtensibleObjectClass) { // Check optional attributes
        const nonPermittedAttributeTypes: Set<IndexableOID> = new Set();
        for (const type_ of Array.from(patch.addedValues.keys())) {
            if (!optionalAttributes.has(type_.toString())) {
                if (target.dse.subentry && ctx.attributeTypes.get(type_.toString())?.collective) {
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
                        conn.boundNameAndUID?.dn,
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
                            conn.boundNameAndUID?.dn,
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
                            conn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
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
                            conn.boundNameAndUID?.dn,
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
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
                        conn.boundNameAndUID?.dn,
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

    if (op?.abandonTime) {
        op.events.emit("abandon");
        throw new errors.AbandonError(
            ctx.i18n.t("err:abandoned"),
            new AbandonedData(
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    conn.boundNameAndUID?.dn,
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
    checkTimeLimit();
    await ctx.db.$transaction(pendingUpdates);
    const dbe = await ctx.db.entry.findUnique({
        where: {
            id: target.dse.id,
        },
    });
    if (dbe) {
        target.dse = await dseFromDatabaseEntry(ctx, dbe);
    } else {
        ctx.log.warn(ctx.i18n.t("log:entry_deleted_while_being_modified", {
            id: target.dse.uuid,
        }));
    }

    if (
        patch.addedValues.has(USER_PASSWORD)
        || patch.addedValues.has(USER_PWD)
    ) {
        ctx.log.info(ctx.i18n.t("log:password_changed", {
            cid: conn.id,
            uuid: target.dse.uuid,
        }));
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
        const addAdministrativeRoleUpdates: PendingUpdates = {
            entryUpdate: {},
            otherWrites: [],
        };
        await addValue(ctx, target, {
            type: administrativeRole["&id"],
            value: _encodeObjectIdentifier(id_ar_autonomousArea, DER),
        }, addAdministrativeRoleUpdates);
        await ctx.db.$transaction([
            ctx.db.entry.update({
                where: {
                    id: target.dse.id,
                },
                data: addAdministrativeRoleUpdates.entryUpdate,
            }),
            ...addAdministrativeRoleUpdates.otherWrites,
        ]);
        const dbe = await ctx.db.entry.findUnique({
            where: {
                id: target.dse.id,
            },
        });
        if (dbe) {
            target.dse = await dseFromDatabaseEntry(ctx, dbe);
        } else {
            ctx.log.warn(ctx.i18n.t("log:entry_deleted_while_being_modified", {
                id: target.dse.uuid,
            }));
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
            ); // INTENTIONAL_NO_AWAIT
        }
    }

    // TODO: Update Shadows

    if (data.selection) {
        if (
            accessControlScheme
            && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
            && !authorizedToEntry([ PERMISSION_CATEGORY_READ ])
        ) {
            const result: ModifyEntryResult = {
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
                                id_opcode_modifyEntry,
                            ),
                            undefined,
                        ),
                        _encode_ModifyEntryResult(result, DER),
                    ),
                },
                stats: {},
            };
        }
        const permittedEntryInfo = await readPermittedEntryInformation(
            ctx,
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
            },
        );
        if (
            target.dse.familyMember
            && data.selection?.familyReturn
            && (data.selection.familyReturn.memberSelect !== FamilyReturn_memberSelect_contributingEntriesOnly)
            && (data.selection.familyReturn.memberSelect !== FamilyReturn_memberSelect_participatingEntriesOnly)
        ) {
            const familySelect: Set<IndexableOID> | null = data.selection?.familyReturn?.familySelect?.length
                ? new Set(data.selection.familyReturn.familySelect.map((oid) => oid.toString()))
                : null;
            const family = await readFamily(ctx, target);
            const familyMembers: Vertex[] = readCompoundEntry(family).next().value;
            const permittedEinfos = await Promise.all(
                familyMembers
                    .slice(1) // Skip the first member, which is the read entry.
                    .map((member) => readPermittedEntryInformation(
                        ctx,
                        member,
                        user,
                        relevantTuples,
                        accessControlScheme,
                        {
                            selection: data.selection,
                            relevantSubentries,
                            operationContexts: data.operationContexts,
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
        const result: ModifyEntryResult = {
            information: {
                unsigned: new ModifyEntryResultData(
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
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        id_opcode_modifyEntry,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            },
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
                            id_opcode_modifyEntry,
                        ),
                        undefined,
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

    const result: ModifyEntryResult = {
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
                        id_opcode_modifyEntry,
                    ),
                    undefined,
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

import {
    Context,
    IndexableOID,
    Vertex,
    Value,
    ClientConnection,
    OperationReturn,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { TRUE_BIT } from "asn1-ts";
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
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_objectClassModificationProhibited,
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
import readValues from "../database/entry/readValues";
import dseFromDatabaseEntry from "../database/dseFromDatabaseEntry";
import { strict as assert } from "assert";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import isPrefix from "../x500/isPrefix";
import updateSubordinate from "../dop/updateSubordinate";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import findEntry from "../x500/findEntry";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_MODIFY,
    PERMISSION_CATEGORY_READ,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
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
import codeToString from "../x500/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEntryModificationStatistics from "../telemetry/getEntryModificationStatistics";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics";
import validateObjectClasses from "../x500/validateObjectClasses";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
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
// import {
//     id_oc_parent,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
// import {
//     id_oc_child,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";

type ValuesIndex = Map<IndexableOID, Value[]>;
type ContextRulesIndex = Map<IndexableOID, DITContextUseDescription>;

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
            el.tagNumber === ASN1UniversalType.integer
            || el.tagNumber === ASN1UniversalType.realNumber
        )
    );
}

function getValueAlterer (toBeAddedElement: ASN1Element): (value: Value) => Value {
    const toBeAdded = (toBeAddedElement.tagNumber === ASN1UniversalType.integer)
        ? toBeAddedElement.integer
        : toBeAddedElement.real;
    return (value: Value): Value => {
        if (!isAcceptableTypeForAlterValues(value.value)) {
            throw new Error();
        }
        if (value.value.tagNumber !== toBeAddedElement.tagNumber) {
            throw new Error();
        }
        const currentValue = (value.value.tagNumber === ASN1UniversalType.integer)
            ? value.value.integer
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

function checkPermissionToAddValues (
    attribute: Attribute,
    ctx: Context,
    conn: ClientConnection,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): void {
    if (!accessControlScheme) {
        return;
    }
    const values = valuesFromAttribute(attribute);
    const {
        authorized: authorizedForAttributeType,
    } = bacACDF(
        relevantACDFTuples,
        authLevel,
        {
            attributeType: attribute.type_,
        },
        [
            PERMISSION_CATEGORY_ADD,
        ],
        equalityMatcherGetter,
    );
    if (!authorizedForAttributeType) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:not_authz_mod"),
            notPermittedData(ctx, conn, aliasDereferenced),
        );
    }
    for (const value of values) {
        const {
            authorized: authorizedForValue,
        } = bacACDF(
            relevantACDFTuples,
            authLevel,
            {
                value: new AttributeTypeAndValue(
                    value.id,
                    value.value,
                ),
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            equalityMatcherGetter,
        );
        if (!authorizedForValue) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod"),
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
    const spec = ctx.attributes.get(TYPE_OID);
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
    if ((spec.usage !== AttributeUsage_userApplications) && !manageDSAIT) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:missing_managedsait_flag", {
                oids: spec.id.toString(),
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
    if (spec.noUserModification) {
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

async function executeAddAttribute (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    checkPermissionToAddValues(
        mod,
        ctx,
        conn,
        accessControlScheme,
        relevantACDFTuples,
        authLevel,
        equalityMatcherGetter,
        aliasDereferenced,
    );
    const values = valuesFromAttribute(mod);
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const deltaValues = delta.get(TYPE_OID);
    if (deltaValues) {
        deltaValues.push(...values);
    } else {
        delta.set(TYPE_OID, values);
    }
    return addValues(ctx, entry, values, []);
}

async function executeRemoveAttribute (
    mod: AttributeType,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    delta.delete(mod.toString());
    if (accessControlScheme) {
        const {
            authorized: authorizedForAttributeType,
        } = bacACDF(
            relevantACDFTuples,
            authLevel,
            {
                attributeType: mod,
            },
            [
                PERMISSION_CATEGORY_REMOVE,
            ],
            equalityMatcherGetter,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod"),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
    }
    return removeAttribute(ctx, entry, mod, []);
    // REVIEW: Do you want to also fail if per-value remove is not granted?
}

async function executeAddValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    checkPermissionToAddValues(
        mod,
        ctx,
        conn,
        accessControlScheme,
        relevantACDFTuples,
        authLevel,
        equalityMatcherGetter,
        aliasDereferenced,
    );
    const values = valuesFromAttribute(mod);
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const deltaValues = delta.get(TYPE_OID);
    if (deltaValues) {
        deltaValues.push(...values);
    } else {
        delta.set(TYPE_OID, values);
    }
    return addValues(ctx, entry, values, []);
}

async function executeRemoveValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    const values = valuesFromAttribute(mod);
    if (accessControlScheme) {
        const {
            authorized: authorizedForAttributeType,
        } = bacACDF(
            relevantACDFTuples,
            authLevel,
            {
                attributeType: mod.type_,
            },
            [
                PERMISSION_CATEGORY_REMOVE,
            ],
            equalityMatcherGetter,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod"),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
        for (const value of values) {
            const {
                authorized: authorizedForValue,
            } = bacACDF(
                relevantACDFTuples,
                authLevel,
                {
                    value: new AttributeTypeAndValue(
                        value.id,
                        value.value,
                    ),
                },
                [
                    PERMISSION_CATEGORY_REMOVE,
                ],
                equalityMatcherGetter,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod"),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    const valuesToBeDeleted: Set<string> = new Set(
        values?.map((v) => Buffer.from(v.value.toBytes()).toString("base64")),
    );
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const deltaValues = delta.get(TYPE_OID);
    if (deltaValues) {
        const newValues = deltaValues
            .filter((dv) => !valuesToBeDeleted.has(Buffer.from(dv.value.toBytes()).toString("base64")));
        delta.set(TYPE_OID, newValues);
    }
    return removeValues(ctx, entry, values, []);
}

async function executeAlterValues (
    mod: AttributeTypeAndValue,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    if (!isAcceptableTypeForAlterValues(mod.value)) {
        throw new Error();
    }
    if (accessControlScheme) {
        const {
            authorized: authorizedForAttributeType,
        } = bacACDF(
            relevantACDFTuples,
            authLevel,
            {
                attributeType: mod.type_,
            },
            [
                PERMISSION_CATEGORY_REMOVE,
            ],
            equalityMatcherGetter,
        );
        if (!authorizedForAttributeType) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod"),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
    }
    const TYPE_OID: IndexableOID = mod.type_.toString();
    const alterer = getValueAlterer(mod.value);
    { // Modify the delta values.
        const deltaValues = delta.get(TYPE_OID);
        if (deltaValues) {
            const newValues = deltaValues.map(alterer);
            delta.set(TYPE_OID, newValues);
        }
    }
    const eis = new EntryInformationSelection(
        {
            select: [ mod.type_ ],
        },
        undefined,
        {
            select: [ mod.type_ ],
        },
        undefined,
        undefined,
        undefined,
    );
    const {
        userAttributes,
        operationalAttributes,
    } = await readValues(ctx, entry, eis);
    const values = [
        ...userAttributes,
        ...operationalAttributes,
    ];
    if (accessControlScheme) {
        for (const value of values) {
            const {
                authorized: authorizedForValue,
            } = bacACDF(
                relevantACDFTuples,
                authLevel,
                {
                    value: new AttributeTypeAndValue(
                        value.id,
                        value.value,
                    ),
                },
                [
                    PERMISSION_CATEGORY_ADD,
                    PERMISSION_CATEGORY_REMOVE,
                ],
                equalityMatcherGetter,
            );
            if (!authorizedForValue) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod"),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    const newValues = values.map(alterer);
    return [
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: entry.dse.id,
                type: mod.type_.toString(),
            },
        }),
        ...(await addValues(ctx, entry, newValues, [])),
    ];
}

async function executeResetValue (
    mod: AttributeType,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
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
    if (accessControlScheme) {
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
                authLevel,
                {
                    value: new AttributeTypeAndValue(
                        mod,
                        el,
                    ),
                },
                [
                    PERMISSION_CATEGORY_REMOVE,
                ],
                equalityMatcherGetter,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod"),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    // This will not update operational attributes, but that does not
    // matter, because it only remove values having some context, and per X.501,
    // operational attributes are forbidden from having contexts.
    const TYPE_OID: IndexableOID = mod.toString();
    { // Updating the delta values
        const deltaValues = delta.get(TYPE_OID);
        if (deltaValues) {
            const newDeltaValues = deltaValues
                .filter((dv) => !Array.from(dv.contexts.values())
                    .some((context) => (context.fallback === false)));
            delta.set(TYPE_OID, newDeltaValues);
        }
    }
    return [
        ctx.db.attributeValue.deleteMany({
            where,
        }),
    ];
}

async function executeReplaceValues (
    mod: Attribute,
    ctx: Context,
    conn: ClientConnection,
    entry: Vertex,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {
    const TYPE_OID: string = mod.type_.toString();
    const values = valuesFromAttribute(mod);
    const where = {
        entry_id: entry.dse.id,
        type: TYPE_OID,
    };
    if (accessControlScheme) {
        const {
            authorized: authorizedForValue,
        } = bacACDF(
            relevantACDFTuples,
            authLevel,
            {
                attributeType: mod.type_,
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            equalityMatcherGetter,
        );
        if (!authorizedForValue) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_mod"),
                notPermittedData(ctx, conn, aliasDereferenced),
            );
        }
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
                authLevel,
                {
                    value: new AttributeTypeAndValue(
                        mod.type_,
                        el,
                    ),
                },
                [
                    PERMISSION_CATEGORY_REMOVE,
                ],
                equalityMatcherGetter,
            );
            if (!authorizedForAttributeType) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_mod"),
                    notPermittedData(ctx, conn, aliasDereferenced),
                );
            }
        }
    }
    delta.set(TYPE_OID, values);
    return [
        ctx.db.attributeValue.deleteMany({
            where,
        }),
        ...(await addValues(ctx, entry, values, [])),
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
                    undefined,
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
    entry: Vertex,
    targetDN: DistinguishedName,
    mod: EntryModification,
    delta: ValuesIndex,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    relevantACDFTuples: ACDFTupleExtended[],
    authLevel: AuthenticationLevel,
    equalityMatcherGetter: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
    precludedAttributes: Set<IndexableOID>,
    contextRuleIndex: ContextRulesIndex,
    isSubentry: boolean,
    manageDSAIT: boolean,
    aliasDereferenced?: boolean,
): Promise<PrismaPromise<any>[]> {

    const commonArguments = [
        ctx,
        conn,
        entry,
        delta,
        accessControlScheme,
        relevantACDFTuples,
        authLevel,
        equalityMatcherGetter,
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
                    undefined,
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
        ? conn.invocations.get(state.invokeId.present)
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
    const isExtensible: boolean = target.dse.objectClass.has(extensibleObject.toString()); // TODO: Support this being added.
    // const isParent: boolean = target.dse.objectClass.has(id_oc_parent.toString());
    // const isChild: boolean = target.dse.objectClass.has(id_oc_child.toString());
    const isEntry: boolean = (!isSubentry && !isAlias); // REVIEW: I could not find documentation if this is true.
    const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const relevantACIItems = [ // FIXME: subentries
        ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? (target.dse.entryACI ?? [])
            : []),
    ];
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
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

    const authorizedToEntry = (permissions: number[]): boolean => {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            permissions,
            EQUALITY_MATCHER,
        );
        return authorized;
    };

    if (accessControlScheme) {
        const authorizedToModifyEntry: boolean = authorizedToEntry([ PERMISSION_CATEGORY_MODIFY ]);
        if (!authorizedToModifyEntry) {
            throw new errors.SecurityError(
                "Not permitted to modify entry.",
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
    if (subschemaSubentry && !target.dse.subentry) {
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

    const pendingUpdates: PrismaPromise<any>[] = [];
    const delta: ValuesIndex = new Map();
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
                target,
                targetDN,
                mod,
                delta,
                accessControlScheme,
                relevantTuples,
                conn.authLevel,
                EQUALITY_MATCHER,
                precludedAttributes,
                contextRulesIndex,
                Boolean(target.dse.subentry),
                manageDSAIT,
                state.chainingArguments.aliasDereferenced,
            )),
        );
    }

    const optionalAttributes: Set<IndexableOID> = new Set(
        attributeTypesPermittedForEveryEntry.map((oid) => oid.toString()),
    );
    if (isEntry) {
        optionalAttributes.add(id_oa_collectiveExclusions.toString());
        optionalAttributes.add(administrativeRole["&id"].toString());
    }
    const addedObjectClasses = delta.get(objectClass["&id"].toString())
        ?.map((value) => value.value.objectIdentifier) ?? [];
    for (const ocid of addedObjectClasses) {
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
        Array.from(spec.optionalAttributes).forEach((attr) => optionalAttributes.add(attr));
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
        Array.from(spec.optionalAttributes).forEach((attr) => optionalAttributes.add(attr));
    }

    { // Check required attributes
        const missingRequiredAttributeTypes: Set<IndexableOID> = new Set();
        for (const ra of Array.from(requiredAttributes)) {
            const deltaValues = delta.get(ra);
            if (!deltaValues?.length) {
                // FIXME: Blocked on implementing attribute count() driver.
                const alreadyPresentValues = await ctx.db.attributeValue.count({
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
    if (!isExtensible && !addsExtensibleObjectClass) { // Check optional attributes
        const nonPermittedAttributeTypes: Set<IndexableOID> = new Set();
        for (const type_ of Array.from(delta.keys())) {
            if (!optionalAttributes.has(type_.toString())) {
                if (target.dse.subentry && ctx.attributes.get(type_.toString())?.collective) {
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

    { // Other validation.
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

        /**
         * From ITU Recommendation X.501 (2016), Section 13.3.3:
         *
         * > Neither the parent nor the child object classes shall be combined
         * > with the alias object class to form an alias entry.
         */
        if (hasChildObjectClass && hasAliasObjectClass) {
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

    // Update relevant hierarchical operational bindings
    if (target.dse.admPoint || target.dse.subentry) {
        const admPoint: Vertex | undefined = target.dse.admPoint
            ? target
            : target.immediateSuperior;
        assert(admPoint?.dse.admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        const now = new Date();
        const relevantOperationalBindings = await ctx.db.operationalBinding.findMany({
            where: {
                binding_type: id_op_binding_hierarchical.toString(),
                validity_start: {
                    gte: now,
                },
                validity_end: {
                    lte: now,
                },
                accepted: true,
                OR: [
                    { // Local DSA initiated role A (meaning local DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: true,
                    },
                    { // Remote DSA initiated role B (meaning local DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: false,
                    },
                ],
            },
            select: {
                binding_identifier: true,
                binding_version: true,
                access_point: true,
                agreement_ber: true,
            },
        });
        for (const ob of relevantOperationalBindings) {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            if (!isPrefix(ctx, admPointDN, agreement.immediateSuperior)) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            try {
                const subrDN: DistinguishedName = [
                    ...agreement.immediateSuperior,
                    agreement.rdn,
                ];
                const subr = await findEntry(ctx, ctx.dit.root, subrDN);
                if (!subr) {
                    ctx.log.warn(ctx.i18n.t("log:subr_for_hob_not_found", {
                        obid: bindingID.identifier.toString(),
                        version: bindingID.version.toString(),
                    }));
                    continue;
                }
                assert(subr.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                updateSubordinate(
                    ctx,
                    bindingID,
                    subr.immediateSuperior,
                    undefined,
                    subr.dse.rdn,
                    accessPoint,
                )
                    .catch((e) => {
                        ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                            obid: bindingID.identifier.toString(),
                            version: bindingID.version.toString(),
                            e: e.message,
                        }));
                    });
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                    e: e.message,
                }));
                continue;
            }
        }
    }

    // TODO: Update Shadows

    if (data.selection) {
        const authorizedToModifyEntry: boolean = authorizedToEntry([ PERMISSION_CATEGORY_READ ]);
        if (!authorizedToModifyEntry) {
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
            conn.authLevel,
            relevantTuples,
            accessControlScheme,
            data.selection,
            relevantSubentries,
            data.operationContexts,
        );
        const result: ModifyEntryResult = {
            information: {
                unsigned: new ModifyEntryResultData(
                    new EntryInformation(
                        {
                            rdnSequence: getDistinguishedName(target),
                        },
                        !target.dse.shadow,
                        permittedEntryInfo.information,
                        permittedEntryInfo.incompleteEntry,
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
                    undefined,
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

import { Context, Vertex, Value, ClientAssociation, OperationReturn, IndexableOID } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier, INTEGER } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import {
    ModifyDNResult,
    _encode_ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_objectClassViolation,
    UpdateProblem_familyRuleViolation,
    UpdateProblem_noSuchSuperior,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import getRDN from "@wildboar/x500/src/lib/utils/getRDN";
import findEntry from "../x500/findEntry";
import { strict as assert } from "assert";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import removeValues from "../database/entry/removeValues";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
    PERMISSION_CATEGORY_IMPORT,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import getAdministrativePoints from "../dit/getAdministrativePoints";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_modifyDN,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyDN.va";
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
    ServiceProblem_timeLimitExceeded
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import type { OperationDispatcherState } from "./OperationDispatcher";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import checkIfNameIsAlreadyTakenInNSSR from "./checkIfNameIsAlreadyTakenInNSSR";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import getSubschemaSubentry from "../dit/getSubschemaSubentry";
import readValues from "../database/entry/readValues";
import { EntryInformationSelection } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import extensibleObject from "../ldap/extensibleObject";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import getACIItems from "../authz/getACIItems";
import { differenceInMilliseconds } from "date-fns";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import updateAffectedSubordinateDSAs from "../dop/updateAffectedSubordinateDSAs";
import updateSuperiorDSA from "../dop/updateSuperiorDSA";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import permittedToFindDSE from "../authz/permittedToFindDSE";

function withinThisDSA (vertex: Vertex) {
    return (
        !vertex.dse.shadow
        && !vertex.dse.immSupr
        // && !vertex.dse.supr // Goes in the root
        && !vertex.dse.subr
        && !vertex.dse.rhob
        && !vertex.dse.nssr
        && !vertex.dse.sa
        && !vertex.dse.xr
        && !vertex.dse.glue
    );
}

async function allSubordinatesWithinThisDSA (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> {
    const externalDSEs = await ctx.db.entry.findMany({
        where: {
            materialized_path: {
                startsWith: vertex.materializedPath.length
                    ? `${vertex.materializedPath}.${vertex.dse.id}`
                    : vertex.dse.id.toString(),
            },
            OR: [
                {
                    subr: true,
                },
                {
                    nssr: true,
                },
                {
                    immSupr: true,
                },
                {
                    rhob: true,
                },
                {
                    shadow: true,
                },
                {
                    sa: true,
                },
                {
                    xr: true,
                },
                {
                    glue: true,
                },
            ],
        },
    });
    return (externalDSEs.length > 0);
}

export
async function modifyDN (
    ctx: Context,
    conn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    if (!withinThisDSA(target)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:target_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
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
    if (!target.immediateSuperior || !withinThisDSA(target.immediateSuperior)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:target_superior_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
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
    const argument = _decode_ModifyDNArgument(state.operationArgument);
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
    const targetDN = getDistinguishedName(target);
    const objectClasses: OBJECT_IDENTIFIER[] = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    const isExtensible: boolean = target.dse.objectClass.has(extensibleObject.toString());
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    if (
        target.dse.objectClass.has(id_oc_child.toString())
        && data.newSuperior // Renaming a child entry is not a problem, but moving it is.
        // It is only a problem if the new prefix is actually different than what is present.
        && !compareDistinguishedName(targetDN.slice(0, -1), data.newSuperior, NAMING_MATCHER)
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_move_child"),
            new UpdateErrorData(
                UpdateProblem_familyRuleViolation,
                [
                    {
                        attributeType: id_oc_child,
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
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = getACIItems(accessControlScheme, target, relevantSubentries);
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const user = state.chainingArguments.originator
        ? new NameAndOptionalUID(
            state.chainingArguments.originator,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel ?? conn.authLevel,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        if (data.newRDN) {
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    entry: objectClasses,
                },
                [
                    PERMISSION_CATEGORY_RENAME,
                ],
                bacSettings,
                true,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_modify_rdn"),
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
        if (data.newSuperior) {
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    entry: objectClasses,
                },
                [
                    PERMISSION_CATEGORY_EXPORT,
                ],
                bacSettings,
                true,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_export"),
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
    }
    const newPrefixDN = (data.newSuperior ?? targetDN.slice(0, -1));
    const oldRDN = target.dse.rdn;
    const newRDN = data.newRDN ?? getRDN(targetDN);
    const destinationDN = [
        ...newPrefixDN,
        newRDN,
    ];
    if ((data.object.length === 0) || (destinationDN.length === 0)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:root_dse_cannot_be_moved"),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
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
    const newSuperior = data.newSuperior
        ? await findEntry(ctx, ctx.dit.root, data.newSuperior)
        : null; // `null` means we did not try.
    if (newSuperior === undefined) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            ctx.i18n.t("err:no_such_superior"),
            new UpdateErrorData(
                UpdateProblem_noSuchSuperior,
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
    const superior = newSuperior ?? target.immediateSuperior;
    assert(superior);

    // Access control for the new location.
    if (data.newSuperior) {
        const newAdmPoints = getAdministrativePoints(superior);
        const relevantSubentries: Vertex[] = (await Promise.all(
            newAdmPoints.map((ap) => getRelevantSubentries(ctx, objectClasses, destinationDN, ap)),
        )).flat();
        const newAccessControlScheme = [ ...newAdmPoints ] // Array.reverse() works in-place, so we create a new array.
            .reverse()
            .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        if (
            newAccessControlScheme
            && accessControlSchemesThatUseACIItems.has(newAccessControlScheme.toString())
        ) {
            const relevantACIItems = getACIItems(accessControlScheme, undefined, relevantSubentries);
            const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                state.chainingArguments.authenticationLevel ?? conn.authLevel,
                targetDN,
                isMemberOfGroup,
                NAMING_MATCHER,
            );
            const {
                authorized: authorizedToEntry,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    entry: objectClasses,
                    siblingsCount: await ctx.db.entry.count({
                        where: {
                            immediate_superior_id: target.immediateSuperior.dse.id,
                            deleteTimestamp: null,
                        },
                    }),
                },
                [
                    PERMISSION_CATEGORY_IMPORT,
                ],
                bacSettings,
                true,
            );
            if (!authorizedToEntry) {
                throw new errors.SecurityError(
                    ctx.i18n.t("err:not_authz_import"),
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
    }

    if (!withinThisDSA(superior)) { // `undefined` means we tried and failed.
        throw new errors.UpdateError(
            ctx.i18n.t("err:new_superior_not_within_this_dsa"),
            new UpdateErrorData(
                UpdateProblem_affectsMultipleDSAs,
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
    if (data.newSuperior) { // Step 3.
        if (!allSubordinatesWithinThisDSA(ctx, target)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:entry_has_external_subordinates"),
                new UpdateErrorData(
                    UpdateProblem_affectsMultipleDSAs,
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
    }

    // This is, at least implicitly, a part of steps 5, 6, and 7.
    const superiorDN = getDistinguishedName(superior);
    const permittedToFindResult = await permittedToFindDSE(
        ctx,
        [ ...superiorDN, newRDN ],
        user,
        state.chainingArguments.authenticationLevel ?? conn.authLevel,
    );
    if (permittedToFindResult.exists) {
        if (permittedToFindResult.discloseOnError) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:entry_already_exists"),
                new UpdateErrorData(
                    UpdateProblem_entryAlreadyExists,
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
        } else {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_import"),
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

    checkTimeLimit();
    const timeRemainingInMilliseconds = timeLimitEndTime
        ? differenceInMilliseconds(timeLimitEndTime, new Date())
        : undefined;
    if (target.dse.subentry) { // Continue at step 7.
        // DEVIATION: from the specification: we update the subordinates AFTER we update the DN locally.
        if (target.immediateSuperior?.dse.cp) {
            // DEVIATION:
            // The specification does NOT say that you have to update the
            // superior's subentries for the new CP. Meerkat DSA does this
            // anyway, just without awaiting.
            updateSuperiorDSA(
                ctx,
                targetDN.slice(0, -1),
                target.immediateSuperior!,
                state.chainingArguments.aliasDereferenced ?? false,
            ); // INTENTIONAL_NO_AWAIT
        }
    } else if (target.dse.cp) { // Continue at step 6.
        try {
            // The specification says that you must wait for this to succeed
            // before returning a response. So we await this, unlike the
            // subordinate updates.
            await updateSuperiorDSA(ctx, targetDN, target, state.chainingArguments.aliasDereferenced ?? false, {
                timeLimitInMilliseconds: timeRemainingInMilliseconds,
            });
        } catch (e) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:superior_dsa_would_not_rename", {
                    e: e?.message,
                }),
                new UpdateErrorData(
                    UpdateProblem_affectsMultipleDSAs,
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
    } else if (
        (target.dse.entry || target.dse.alias)
        && superior.dse.nssr
    ) { // Continue at step 5.
        // Follow instructions in 19.1.5. These are the only steps unique to this DSE type.
        await checkIfNameIsAlreadyTakenInNSSR(
            ctx,
            conn,
            state.invokeId,
            state.chainingArguments.aliasDereferenced ?? false,
            superior.dse.nssr.nonSpecificKnowledge ?? [],
            destinationDN,
            timeRemainingInMilliseconds,
        );
        /**
         * Note that this covers the case where the entry is of type admPoint,
         * because an admPoint must always be of type entry.
         */
        updateAffectedSubordinateDSAs(ctx, targetDN);
    }

    // For checking deleteOldRDN
    const attributeTypesRequired: Set<IndexableOID> = new Set([
        ...objectClasses
            .flatMap((oc) => {
                const spec = ctx.objectClasses.get(oc.toString());
                return Array.from(spec?.mandatoryAttributes.values() ?? []);
            }),
    ]);
    const attributeTypesForbidden: Set<IndexableOID> = new Set();

    // Subschema validation
    let newGoverningStructureRule: INTEGER | undefined;
    const schemaSubentry = target.dse.subentry // Schema rules only apply to entries.
        ? undefined
        : await getSubschemaSubentry(ctx, superior);
    if (!target.dse.subentry && schemaSubentry) { // Schema rules only apply to entries.
        const structuralRules = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
            .filter((rule) => !rule.obsolete)
            .filter((rule) => (rule.superiorStructureRules === superior.dse.governingStructureRule))
            .filter((rule) => {
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (
                    target.dse.structuralObjectClass // This should be known for all local DSEs.
                    && !nf.namedObjectClass.isEqualTo(target.dse.structuralObjectClass)
                ) {
                    return false;
                }
                return checkNameForm(newRDN, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (structuralRules.length === 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:no_dit_structural_rules"),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
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
        newGoverningStructureRule = structuralRules[0].ruleIdentifier;
        const contentRule = (schemaSubentry.dse.subentry?.ditContentRules ?? [])
            .filter((rule) => !rule.obsolete)
            // .find(), because there should only be one per SOC.
            .find((rule) => (
                target.dse.structuralObjectClass
                && rule.structuralObjectClass.isEqualTo(target.dse.structuralObjectClass)
            ));
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
                            soc: contentRule.structuralObjectClass.toString(),
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
            contentRule.precluded?.forEach((type_) => attributeTypesForbidden.add(type_.toString()));
            contentRule.mandatory?.forEach((type_) => attributeTypesRequired.add(type_.toString()));
        } else { // There is no content rule defined.
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
                        soc: target.dse.structuralObjectClass?.toString(),
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
        const contextUseRules = (schemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        const contextRulesIndex: Map<IndexableOID, DITContextUseDescription> = new Map(
            contextUseRules.map((rule) => [ rule.identifier.toString(), rule ]),
        );
        for (const atav of newRDN) {
            const TYPE_OID: string = atav.type_.toString();
            const applicableContextRule = contextRulesIndex.get(TYPE_OID);
            if (!applicableContextRule) {
                continue;
            }
            // It cannot be used in a name if it has mandatory contexts, because
            // the ATAVs innately have no contexts.
            if (applicableContextRule.information.mandatoryContexts?.length) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:rdn_attribute_type_requires_contexts", {
                        oid: atav.type_.toString(),
                        oids: applicableContextRule
                            .information
                            .mandatoryContexts
                            .map((oid) => oid.toString())
                            .join(", "),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_namingViolation,
                        [
                            {
                                attributeType: atav.type_,
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
    } // End of subschema validation

    const attributeTypesPermittedByObjectClasses: Set<IndexableOID> = new Set(
        objectClasses
            .flatMap((oc) => {
                const spec = ctx.objectClasses.get(oc.toString());
                return [
                    ...Array.from(spec?.mandatoryAttributes.values() ?? []),
                    ...Array.from(spec?.optionalAttributes.values() ?? []),
                ];
            }),
    );
    for (const atav of newRDN) {
        const TYPE_OID: string = atav.type_.toString();
        // NOTE: This will not respect the extensibleObject OC if it was added through the RDN.
        if (!attributeTypesPermittedByObjectClasses.has(TYPE_OID) && !isExtensible) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:attribute_type_not_permitted_by_oc", {
                    oids: atav.type_.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attributeType: atav.type_,
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
        if (attributeTypesForbidden.has(TYPE_OID)) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:attr_type_precluded", {
                    oid: atav.type_.toString(),
                    soc: target.dse.structuralObjectClass?.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attributeType: atav.type_,
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
        if (
            atav.type_.isEqualTo(hierarchyParent["&id"])
            && (
                target.dse.objectClass.has(id_oc_child.toString())
                || newRDN.find((atav1) => (
                    atav1.type_.isEqualTo(id_at_objectClass)
                    && atav1.value.objectIdentifier.isEqualTo(id_oc_child)
                ))
            )
        ) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:child_cannot_be_in_hierarchy"),
                new UpdateErrorData(
                    UpdateProblem_familyRuleViolation,
                    [
                        {
                            attribute: new Attribute(
                                atav.type_,
                                [ atav.value ],
                                undefined,
                            ),
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
        const spec = ctx.attributeTypes.get(TYPE_OID);
        if (!spec) {
            throw new errors.AttributeError(
                ctx.i18n.t("err:unrecognized_attribute_type", {
                    oids: TYPE_OID,
                }),
                new AttributeErrorData(
                    {
                        rdnSequence: targetDN,
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_undefinedAttributeType,
                            atav.type_,
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
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (spec.validator) {
            try {
                spec.validator(atav.value);
            } catch {
                throw new errors.NameError(
                    ctx.i18n.t("err:invalid_attribute_syntax", {
                        type: TYPE_OID,
                    }),
                    new NameErrorData(
                        NameProblem_invalidAttributeSyntax,
                        {
                            rdnSequence: targetDN,
                        },
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
        let hasValue: boolean = false;
        if (spec.driver?.hasValue) {
            hasValue = await spec.driver.hasValue(ctx, target, {
                type: atav.type_,
                value: atav.value,
            }, relevantSubentries);
        } else {
            hasValue = !!(await ctx.db.attributeValue.findFirst({
                where: {
                    entry_id: target.dse.id,
                    type: atav.type_.toString(),
                    ber: Buffer.from(atav.value.toBytes()),
                },
            }));
            if (!hasValue) {
                const matchingRule = spec.equalityMatchingRule
                    ? ctx.equalityMatchingRules.get(spec.equalityMatchingRule.toString())
                    : undefined;
                const matcher = matchingRule?.matcher;
                const {
                    userValues: userAttributes,
                    operationalValues: operationalAttributes,
                } = await readValues(ctx, target, {
                    selection: new EntryInformationSelection(
                        {
                            select: [ atav.type_ ],
                        },
                        undefined,
                        {
                            select: [ atav.type_ ],
                        },
                        undefined,
                        false,
                        undefined,
                    ),
                });
                const attributes = [
                    ...userAttributes,
                    ...operationalAttributes,
                ];
                if (attributes.some((attr) => matcher && matcher(attr.value, atav.value))) {
                    hasValue = true;
                }
            }
        }
        if (!hasValue) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_values_not_present_in_entry", {
                    oids: atav.type_.toString(),
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
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
    }

    const typesInNewRDN: Set<IndexableOID> = new Set(newRDN.map((atav) => atav.type_.toString()));
    if (data.deleteOldRDN) { // Make sure that mandatory attributes are not deleted.
        for (const atav of oldRDN) {
            const TYPE_OID: string = atav.type_.toString();
            if (
                !attributeTypesRequired.has(TYPE_OID)
                || typesInNewRDN.has(TYPE_OID)
            ) {
                continue;
            }
            const matcher = EQUALITY_MATCHER(atav.type_);
            const {
                userValues: userAttributes,
                operationalValues: operationalAttributes,
            } = await readValues(ctx, target, {
                selection: new EntryInformationSelection(
                    {
                        select: [ atav.type_ ],
                    },
                    undefined,
                    {
                        select: [ atav.type_ ],
                    },
                    undefined,
                    undefined,
                    undefined,
                ),
            });
            const values = [
                ...userAttributes,
                ...operationalAttributes,
            ];
            const allValuesDeleted: boolean = matcher
                ? values
                    .filter((value) => (!value.contexts || (value.contexts.length === 0)))
                    .every((value) => matcher(value.value, atav.value))
                : (values.length <= 1);
            if (allValuesDeleted) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:deleting_old_rdn_deletes_required_attribute"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: atav.type_,
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
    if (target.immediateSuperior?.subordinates?.length && (target.immediateSuperior !== superior)) {
        const entryIndex = target.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === target.dse.uuid));
        target.immediateSuperior.subordinates.splice(entryIndex, 1); // Remove from the current parent.
        superior?.subordinates?.push(target); // Move to the new parent.
    }
    const oldMaterializedPathPrefix: string = target.immediateSuperior.dse.root
        ? (target.dse.id.toString() + ".")
        : `${target.materializedPath}.${target.dse.id}.`;
    const newMaterializedPath: string = superior.dse.root
        ? ""
        : (superior.materializedPath.length
            ? `${superior.materializedPath}${superior.dse.id.toString() + "."}`
            : superior.dse.id.toString() + ".");
    const materializedPathsToUpdate = await ctx.db.entry.findMany({
        where: {
            materialized_path: {
                startsWith: oldMaterializedPathPrefix,
            },
        },
        select: {
            id: true,
            materialized_path: true,
        },
    });
    await ctx.db.$transaction([
        ctx.db.entry.update({
            where: {
                id: target.dse.id,
            },
            data: {
                immediate_superior_id: superior.dse.id,
                governingStructureRule: Number.isSafeInteger(Number(newGoverningStructureRule))
                    ? Number(newGoverningStructureRule)
                    : undefined,
                materialized_path: newMaterializedPath,
            },
        }),
        ctx.db.distinguishedValue.deleteMany({
            where: {
                entry_id: target.dse.id,
            },
        }),
        ctx.db.distinguishedValue.createMany({
            data: newRDN.map((atav, i) => ({
                entry_id: target.dse.id,
                type: atav.type_.toString(),
                value: Buffer.from(atav.value.toBytes()),
                order_index: i,
            })),
        }),
        ...materializedPathsToUpdate.map((mp) => ctx.db.entry.update({
            where: {
                id: mp.id,
            },
            data: {
                materialized_path: mp.materialized_path.replace(
                    oldMaterializedPathPrefix,
                    newMaterializedPath.length
                        ? `${newMaterializedPath}.${target.dse.id}.`
                        : target.dse.id.toString() + ".",
                ),
            },
        })),
    ]);
    target.dse.rdn = data.newRDN; // Update the RDN.
    if (data.deleteOldRDN) {
        for (const oldATAV of oldRDN) {
            const valueInNewRDN = newRDN
                .find((newATAV) => newATAV.type_.isEqualTo(oldATAV.type_));
            if (valueInNewRDN) {
                const namingMatcher = NAMING_MATCHER(oldATAV.type_);
                if (namingMatcher?.(oldATAV.value, valueInNewRDN.value)) {
                    continue;
                }
            }
            const valueToDelete: Value = {
                type: oldATAV.type_,
                value: oldATAV.value,
            };
            try {
                await removeValues(ctx, target, [valueToDelete], conn.boundNameAndUID?.dn ?? []);
            } catch (e) {
                ctx.log.warn(ctx.i18n.t("log:failed_to_delete_old_rdn", {
                    oid: oldATAV.type_.toString(),
                    uuid: target.dse.uuid,
                }));
            }
        }
    }

    // FIXME: This looks like it's unfinished.
    // for (const mp of materializedPathsToUpdate) {
    //     await ctx.db
    // }

    if (target.dse.entry || target.dse.alias || target.dse.subentry) {
        const affectedPrefix = target.dse.subentry
            ? targetDN.slice(0, -1)
            : targetDN;
        updateAffectedSubordinateDSAs(ctx, affectedPrefix); // INTENTIONAL_NO_AWAIT
    }

    // TODO: Update shadows
    const result: ModifyDNResult = {
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
                        id_opcode_modifyDN,
                    ),
                    undefined,
                ),
                _encode_ModifyDNResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_modifyDN),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                newRDNLength: data.newRDN.length,
                newSuperiorNameLength: data.newSuperior?.length,
                deleteOldRDN: data.deleteOldRDN,
            }), undefined),
        },
    };
}

export default modifyDN;

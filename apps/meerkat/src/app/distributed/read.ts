import { Context, Vertex, ClientConnection, OperationReturn, IndexableOID } from "@wildboar/meerkat-types";
import { ObjectIdentifier, TRUE_BIT, FALSE_BIT } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadResult,
    _encode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    ReadResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResultData.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import type { ModifyRights } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights.ta";
import { ModifyRights_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights-Item.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_read,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER } from "asn1-ts/dist/node/functional";
import readPermittedEntryInformation from "../database/entry/readPermittedEntryInformation";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    FamilyReturn_memberSelect_contributingEntriesOnly,
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
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    family_information,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/family-information.oa";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    AttributeProblem_noSuchAttributeOrValue,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";

export
async function read (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_ReadArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const isSubentry: boolean = target.dse.objectClass.has(id_sc_subentry.toString());
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = isSubentry
        ? []
        : (await Promise.all(
            state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
        )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = getACIItems(accessControlScheme, target, relevantSubentries);
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
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const {
            authorized,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
        );
        if (!authorized) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_read"),
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

    if (
        data.selection?.familyReturn
        && (data.selection.familyReturn.memberSelect !== FamilyReturn_memberSelect_contributingEntriesOnly)
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
                    conn.authLevel,
                    relevantTuples,
                    accessControlScheme,
                    data.selection,
                    relevantSubentries,
                    data.operationContexts,
                )),
        );
        const permittedEinfoIndex: Map<number, EntryInformation_information_Item[]> = new Map(
            permittedEinfos.map((einfo, i) => [ familyMembers[i].dse.id, einfo.information ]),
        );
        const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
            family,
            (vertex: Vertex) => permittedEinfoIndex.get(vertex.dse.id) ?? [],
        )
            .filter((fe) => (!familySelect || familySelect.has(fe.toString())));
        const familyInfoAttr: Attribute = new Attribute(
            family_information["&id"],
            familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
            undefined,
        );
        permittedEntryInfo.information.push({
            attribute: familyInfoAttr,
        });
    }

    if (permittedEntryInfo.information.length === 0) {
        throw new errors.AttributeError(
            ctx.i18n.t("err:no_such_attribute_or_value"),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    ...(data.selection?.attributes && ("select" in data.selection.attributes))
                        ? data.selection.attributes.select
                        : [],
                    ...(data.selection?.extraAttributes && ("select" in data.selection.extraAttributes))
                        ? data.selection.extraAttributes.select
                        : [],
                ]
                    .map((oid) => new AttributeErrorData_problems_Item(
                        AttributeProblem_noSuchAttributeOrValue,
                        oid,
                        undefined,
                    )),
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

    const modifyRights: ModifyRights = [];
    if (
        data.modifyRightsRequest
        && accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const {
            authorized: authorizedToAddEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_ADD,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToRemoveEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_REMOVE,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToRenameEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_RENAME,
            ],
            EQUALITY_MATCHER,
        );
        const {
            authorized: authorizedToMoveEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_EXPORT,
            ],
            EQUALITY_MATCHER,
        );
        modifyRights.push(new ModifyRights_Item(
            {
                entry: null,
            },
            new Uint8ClampedArray([
                authorizedToAddEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToRemoveEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToRenameEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToMoveEntry ? TRUE_BIT : FALSE_BIT,
            ]),
        ));
    }

    const result: ReadResult = {
        unsigned: new ReadResultData(
            new EntryInformation(
                {
                    rdnSequence: targetDN,
                },
                !target.dse.shadow,
                permittedEntryInfo.information,
                permittedEntryInfo.incompleteEntry,
                state.partialName,
                false,
            ),
            (
                data.modifyRightsRequest
                && accessControlScheme
                && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
            )
                ? modifyRights
                : undefined,
            [],
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_read,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            state.chainingArguments.aliasDereferenced,
            undefined,
        ),
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
                        id_opcode_read,
                    ),
                    undefined,
                ),
                _encode_ReadResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_read),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                eis: data.selection
                    ? getEntryInformationSelectionStatistics(data.selection)
                    : undefined,
                modifyRightsRequest: data.modifyRightsRequest,
            }), undefined),
        },
    };
}

export default read;

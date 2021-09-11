import { Context, Vertex, ClientConnection } from "../types";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { OBJECT_IDENTIFIER, ObjectIdentifier, TRUE_BIT, FALSE_BIT } from "asn1-ts";
import * as errors from "../errors";
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
import { DERElement } from "asn1-ts";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    readEntryInformation,
} from "../database/entry/readEntryInformation";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
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
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
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
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import attributeToStoredValues from "../x500/attributeToStoredValues";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import attributesFromValues from "../x500/attributesFromValues";
import type { ModifyRights } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights.ta";
import { ModifyRights_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyRights-Item.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_read,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";

export
async function read (
    ctx: Context,
    conn: ClientConnection,
    invokeId: InvokeId,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_ReadArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const NAMING_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ) => ctx.attributes.get(attributeType.toString())?.namingMatcher;
    const isSubentry: boolean = target.dse.objectClass.has(id_sc_subentry.toString());
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = isSubentry
        ? []
        : (await Promise.all(
            admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
        )).flat();
    const accessControlScheme = admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const relevantACIItems = isSubentry
        ? [
            ...(accessControlSchemesThatUseSubentryACI.has(AC_SCHEME)
                ? (target.immediateSuperior?.dse.admPoint?.subentryACI ?? [])
                : []),
        ]
        : [
            ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
                ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
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
                conn.boundNameAndUID!, // FIXME:
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    if (accessControlScheme) {
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
                "Not permitted to create this entry.",
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
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    const einfo: EntryInformation_information_Item[] = await readEntryInformation(ctx, target, data.selection);
    const permittedEinfo: EntryInformation_information_Item[] = accessControlScheme
        ? []
        : einfo;
    let incompleteEntry: boolean = true;
    if (accessControlScheme) {
        for (const info of einfo) {
            if ("attribute" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attribute.type_,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (!authorizedToAddAttributeType) {
                    incompleteEntry = true;
                    continue;
                }
                const permittedValues = attributeToStoredValues(info.attribute)
                    .filter((value) => {
                        const {
                            authorized: authorizedToAddAttributeValue,
                        } = bacACDF(
                            relevantTuples,
                            conn.authLevel,
                            {
                                value: new AttributeTypeAndValue(
                                    value.id,
                                    value.value,
                                ),
                            },
                            [
                                PERMISSION_CATEGORY_READ,
                            ],
                            EQUALITY_MATCHER,
                        );
                        if (!authorizedToAddAttributeValue) {
                            incompleteEntry = true;
                        }
                        return authorizedToAddAttributeValue;
                    });
                const attribute = attributesFromValues(permittedValues)[0];
                if (attribute) {
                    permittedEinfo.push({ attribute });
                } else {
                    permittedEinfo.push({
                        attributeType: info.attribute.type_,
                    });
                }
            } else if ("attributeType" in info) {
                const {
                    authorized: authorizedToAddAttributeType,
                } = bacACDF(
                    relevantTuples,
                    conn.authLevel,
                    {
                        attributeType: info.attributeType,
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    EQUALITY_MATCHER,
                );
                if (authorizedToAddAttributeType) {
                    permittedEinfo.push(info);
                }
            } else {
                continue;
            }
        }
    }

    const modifyRights: ModifyRights = [];
    if (data.modifyRightsRequest && accessControlScheme) {
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
                permittedEinfo,
                incompleteEntry,
                false, // FIXME:
                false, // FIXME,
            ),
            (data.modifyRightsRequest && accessControlScheme)
                ? modifyRights
                : undefined,
            [],
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_read,
            ),
            undefined,
            undefined,
            undefined,
        ),
    };
    return new ChainedResult(
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
        _encode_ReadResult(result, () => new DERElement()),
    );
}

export default read;

import process from "node:process";
import type { Connection, Context } from "../../../../types.js";
import { DER } from "@wildboar/asn1/functional";
import {
    modifyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryModification,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import printCode from "../../../../printers/Code.js";
import destringifyDN from "../../../../utils/destringifyDN.js";
import { FALSE_BIT, ObjectIdentifier, TRUE_BIT, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type {
    ModAddACIItemArgs,
} from "../../../../yargs/dap_mod_add_aci.js";
import {
    ACIItem,
} from "@wildboar/x500/BasicAccessControl";
import {
    ACIItem_itemOrUserFirst_userFirst,
} from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels_level,
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/BasicAccessControl";
import {
    UserClasses,
} from "@wildboar/x500/BasicAccessControl";
import {
    UserPermission,
} from "@wildboar/x500/BasicAccessControl";
import {
    ProtectedItems,
} from "@wildboar/x500/BasicAccessControl";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import { lexSubtreeSpec } from "../../../../parsers/lexSubtreeSpec.js";
import {
    MaxValueCount,
} from "@wildboar/x500/BasicAccessControl";
import {
    RestrictedValue,
} from "@wildboar/x500/BasicAccessControl";
import { lexRefinement } from "../../../../parsers/parseRefinement.js";
import {
    GrantsAndDenials,
    GrantsAndDenials_denyAdd,
    GrantsAndDenials_denyDiscloseOnError,
    GrantsAndDenials_denyCompare,
    GrantsAndDenials_denyBrowse,
    GrantsAndDenials_denyExport,
    GrantsAndDenials_denyFilterMatch,
    GrantsAndDenials_denyImport,
    GrantsAndDenials_denyInvoke,
    GrantsAndDenials_denyModify,
    GrantsAndDenials_denyRead,
    GrantsAndDenials_denyRemove,
    GrantsAndDenials_denyRename,
    GrantsAndDenials_denyReturnDN,
    GrantsAndDenials_grantBrowse,
    GrantsAndDenials_grantReturnDN,
    GrantsAndDenials_grantRead,
    GrantsAndDenials_grantModify,
    GrantsAndDenials_grantCompare,
    GrantsAndDenials_grantFilterMatch,
    GrantsAndDenials_grantDiscloseOnError,
    GrantsAndDenials_grantAdd,
    GrantsAndDenials_grantExport,
    GrantsAndDenials_grantImport,
    GrantsAndDenials_grantInvoke,
    GrantsAndDenials_grantRemove,
    GrantsAndDenials_grantRename,
} from "@wildboar/x500/BasicAccessControl";
import {
    entryACI,
} from "@wildboar/x500/BasicAccessControl";
import {
    subentryACI,
} from "@wildboar/x500/BasicAccessControl";
import {
    prescriptiveACI,
} from "@wildboar/x500/BasicAccessControl";
import type {
    ATTRIBUTE,
} from "@wildboar/x500/InformationFramework";
import { attributes as x500at } from "@wildboar/x500";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa.js";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa.js";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa.js";
import {
    dynamicSubtrees,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicSubtrees.oa.js";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import {
    vendorName,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorName.oa.js";
import {
    vendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorVersion.oa.js";
import {
    syncTimestamp,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncTimestamp.oa.js";
import {
    fullVendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/fullVendorVersion.oa.js";
import {
    administratorsAddress,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/administratorsAddress.oa.js";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa.js";
import {
    numSubordinates,
} from "@wildboar/parity-schema/src/lib/modules/DS389CoreSchema/numSubordinates.oa.js";

const ALL_OPERATIONAL_ATTRIBUTE_TYPES: OBJECT_IDENTIFIER[] = [
    x500at.accessControlScheme["&id"],
    x500at.accessControlSubentryList["&id"],
    x500at.administrativeRole["&id"],
    x500at.altServer["&id"],
    x500at.attributeTypes["&id"],
    x500at.consumerKnowledge["&id"],
    x500at.contextAssertionDefaults["&id"],
    x500at.contextDefaultSubentryList["&id"],
    x500at.contextTypes["&id"],
    x500at.createTimestamp["&id"],
    x500at.creatorsName["&id"],
    x500at.ditBridgeKnowledge["&id"],
    x500at.dITContentRules["&id"],
    x500at.dITContextUse["&id"],
    x500at.dITStructureRules["&id"],
    x500at.dseType["&id"],
    x500at.entryACI["&id"],
    x500at.family_information["&id"],
    x500at.friends["&id"],
    x500at.governingStructureRule["&id"],
    x500at.hasSubordinates["&id"],
    x500at.hierarchyBelow["&id"],
    x500at.hierarchyLevel["&id"],
    x500at.hierarchyParent["&id"],
    x500at.hierarchyTop["&id"],
    x500at.ldapSyntaxes["&id"],
    x500at.matchingRules["&id"],
    x500at.matchingRuleUse["&id"],
    x500at.modifiersName["&id"],
    x500at.modifyTimestamp["&id"],
    x500at.myAccessPoint["&id"],
    x500at.nameForms["&id"],
    x500at.namingContexts["&id"],
    x500at.nonSpecificKnowledge["&id"],
    x500at.objectClasses["&id"],
    x500at.prescriptiveACI["&id"],
    x500at.pwdAdminSubentryList["&id"],
    x500at.pwdAlphabet["&id"],
    x500at.pwdAttribute["&id"],
    x500at.pwdChangeAllowed["&id"],
    x500at.pwdDictionaries["&id"],
    x500at.pwdEncAlg["&id"],
    x500at.pwdEndTime["&id"],
    x500at.pwdExpiryAge["&id"],
    x500at.pwdExpiryTime["&id"],
    x500at.pwdExpiryWarning["&id"],
    x500at.pwdFails["&id"],
    x500at.pwdFailureDuration["&id"],
    x500at.pwdFailureTime["&id"],
    x500at.pwdGraces["&id"],
    x500at.pwdGracesUsed["&id"],
    x500at.pwdHistorySlots["&id"],
    x500at.pwdLockoutDuration["&id"],
    x500at.pwdMaxAge["&id"],
    x500at.pwdMaxFailures["&id"],
    x500at.pwdMaxTimeInHistory["&id"],
    x500at.pwdMinLength["&id"],
    x500at.pwdMinTimeInHistory["&id"],
    x500at.pwdModifyEntryAllowed["&id"],
    x500at.pwdRecentlyExpiredDuration["&id"],
    x500at.pwdStartTime["&id"],
    x500at.pwdVocabulary["&id"],
    x500at.searchRules["&id"],
    x500at.secondaryShadows["&id"],
    x500at.serviceAdminSubentryList["&id"],
    x500at.specificKnowledge["&id"],
    x500at.structuralObjectClass["&id"],
    x500at.subentryACI["&id"],
    x500at.subschemaSubentryList["&id"],
    x500at.subschemaTimestamp["&id"],
    x500at.subtreeSpecification["&id"],
    x500at.superiorKnowledge["&id"],
    x500at.supplierKnowledge["&id"],
    x500at.supportedControl["&id"],
    x500at.supportedExtension["&id"],
    x500at.supportedFeatures["&id"],
    x500at.supportedLDAPVersion["&id"],
    x500at.supportedSASLMechanisms["&id"],
    entryUUID["&id"],
    entryDN["&id"],
    superiorUUID["&id"],
    dynamicSubtrees["&id"],
    entryTtl["&id"],
    fullVendorVersion["&id"],
    syncTimestamp["&id"],
    vendorName["&id"],
    vendorVersion["&id"],
    administratorsAddress["&id"],
    isMemberOf["&id"],
    numSubordinates["&id"],
];

function levelFromString (str: string): AuthenticationLevel_basicLevels_level {
    switch (str.trim().toLowerCase()) {
        case ("none"): return AuthenticationLevel_basicLevels_level_none;
        case ("simple"): return AuthenticationLevel_basicLevels_level_simple;
        case ("strong"): return AuthenticationLevel_basicLevels_level_strong;
        default: {
            console.log(`Invalid authentication level '${str}'. Valid values are 'none', 'simple', and 'strong'.`);
            process.exit(1);
        }
    }
}

function nameAndUidFromStringGetter (ctx: Context) {
    return function nameAndUidFromString (str: string): NameAndOptionalUID {
        const lastOctothorpeIndex: number = str.lastIndexOf("#");
        const name: string = (lastOctothorpeIndex > -1)
            ? str.slice(0, lastOctothorpeIndex)
            : str;
        const uidStr: string | undefined = (lastOctothorpeIndex > -1)
            ? str.slice(lastOctothorpeIndex + 1).replace(/'/g, "").replace(/B/g, "")
            : undefined;
        return new NameAndOptionalUID(
            destringifyDN(ctx, name),
            uidStr
                ? new Uint8ClampedArray(
                    Array
                        .from(uidStr)
                        .map((char) => (char === "1") ? TRUE_BIT : FALSE_BIT)
                )
                : undefined,
        );
    };
}

function parseMaxValue (str: string): MaxValueCount {
    const [ typeStr, countStr ] = str.split(":");
    const count: number = Number.parseInt(countStr, 10);
    if (!Number.isSafeInteger(count)) {
        throw new Error(`Unusable maxValueCount count '${countStr}'. The proper syntax for a maxValueCount is <type>:<count> (e.g. '2.5.4.3:10').`);
    }
    if (count < 0) {
        throw new Error(`Cannot use a negative maxValueCount for type '${typeStr}'.`);
    }
    return new MaxValueCount(
        ObjectIdentifier.fromString(typeStr),
        count,
    );
}

function parseRestrictedValue (str: string): RestrictedValue {
    const [ oid1, oid2 ] = str.split(":");
    return new RestrictedValue(
        ObjectIdentifier.fromString(oid1),
        ObjectIdentifier.fromString(oid2),
    );
}

export
async function do_modify_add_aci (
    ctx: Context,
    conn: Connection,
    argv: ModAddACIItemArgs & Record<string, any>,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);

    const gad: GrantsAndDenials = new Uint8ClampedArray(26);
    if (argv.grantAdd) {
        gad[GrantsAndDenials_grantAdd] = TRUE_BIT;
    }
    if (argv.denyAdd) {
        gad[GrantsAndDenials_denyAdd] = TRUE_BIT;
    }
    if (argv.grantDiscloseOnError) {
        gad[GrantsAndDenials_grantDiscloseOnError] = TRUE_BIT;
    }
    if (argv.denyDiscloseOnError) {
        gad[GrantsAndDenials_denyDiscloseOnError] = TRUE_BIT;
    }
    if (argv.grantRead) {
        gad[GrantsAndDenials_grantRead] = TRUE_BIT;
    }
    if (argv.denyRead) {
        gad[GrantsAndDenials_denyRead] = TRUE_BIT;
    }
    if (argv.grantRemove) {
        gad[GrantsAndDenials_grantRemove] = TRUE_BIT;
    }
    if (argv.denyRemove) {
        gad[GrantsAndDenials_denyRemove] = TRUE_BIT;
    }
    if (argv.grantBrowse) {
        gad[GrantsAndDenials_grantBrowse] = TRUE_BIT;
    }
    if (argv.denyBrowse) {
        gad[GrantsAndDenials_denyBrowse] = TRUE_BIT;
    }
    if (argv.grantExport) {
        gad[GrantsAndDenials_grantExport] = TRUE_BIT;
    }
    if (argv.denyExport) {
        gad[GrantsAndDenials_denyExport] = TRUE_BIT;
    }
    if (argv.grantImport) {
        gad[GrantsAndDenials_grantImport] = TRUE_BIT;
    }
    if (argv.denyImport) {
        gad[GrantsAndDenials_denyImport] = TRUE_BIT;
    }
    if (argv.grantModify) {
        gad[GrantsAndDenials_grantModify] = TRUE_BIT;
    }
    if (argv.denyModify) {
        gad[GrantsAndDenials_denyModify] = TRUE_BIT;
    }
    if (argv.grantRename) {
        gad[GrantsAndDenials_grantRename] = TRUE_BIT;
    }
    if (argv.denyRename) {
        gad[GrantsAndDenials_denyRename] = TRUE_BIT;
    }
    if (argv.grantReturnDN) {
        gad[GrantsAndDenials_grantReturnDN] = TRUE_BIT;
    }
    if (argv.denyReturnDN) {
        gad[GrantsAndDenials_denyReturnDN] = TRUE_BIT;
    }
    if (argv.grantCompare) {
        gad[GrantsAndDenials_grantCompare] = TRUE_BIT;
    }
    if (argv.denyCompare) {
        gad[GrantsAndDenials_denyCompare] = TRUE_BIT;
    }
    if (argv.grantFilterMatch) {
        gad[GrantsAndDenials_grantFilterMatch] = TRUE_BIT;
    }
    if (argv.denyFilterMatch) {
        gad[GrantsAndDenials_denyFilterMatch] = TRUE_BIT;
    }
    if (argv.grantInvoke) {
        gad[GrantsAndDenials_grantInvoke] = TRUE_BIT;
    }
    if (argv.denyInvoke) {
        gad[GrantsAndDenials_denyInvoke] = TRUE_BIT;
    }

    const aci = new ACIItem(
        {
            uTF8String: argv.idtag!,
        },
        argv.precedence!,
        {
            basicLevels: new AuthenticationLevel_basicLevels(
                levelFromString(argv.authLevel!),
                argv.authLevelLocalQualifier,
                argv.authLevelSigned,
            ),
        },
        {
            userFirst: new ACIItem_itemOrUserFirst_userFirst(
                new UserClasses(
                    argv.allUsers ? null : undefined,
                    argv.thisEntry ? null : undefined,
                    argv.userName?.map(nameAndUidFromStringGetter(ctx)),
                    argv.userGroup?.map(nameAndUidFromStringGetter(ctx)),
                    argv.subtree?.map(lexSubtreeSpec),
                ),
                [
                    new UserPermission(
                        undefined,
                        new ProtectedItems(
                            argv.entry ? null : undefined,
                            argv.allUserAttributeTypes ? null : undefined,
                            argv.allOperationalAttributeTypesAndValues
                                ? [
                                    ...argv.attributeType?.map(ObjectIdentifier.fromString) ?? [],
                                    ...ALL_OPERATIONAL_ATTRIBUTE_TYPES,
                                ]
                                : argv.attributeType?.map(ObjectIdentifier.fromString),
                            argv.allOperationalAttributeTypesAndValues
                                ? [
                                    ...argv.allAttributeValues?.map(ObjectIdentifier.fromString) ?? [],
                                    ...ALL_OPERATIONAL_ATTRIBUTE_TYPES,
                                ]
                                : argv.allAttributeValues?.map(ObjectIdentifier.fromString),
                            argv.allUserAttributeTypesAndValues ? null : undefined,
                            argv.attributeValue?.flatMap((str) => destringifyDN(ctx, str).flat()),
                            argv.selfValue?.map(ObjectIdentifier.fromString),
                            undefined, // rangeOfValues not supported.
                            argv.maxValueCount?.map(parseMaxValue),
                            argv.maxImmSub,
                            argv.restrictedBy?.map(parseRestrictedValue),
                            undefined, // contexts not supported.
                            argv.classes
                                ? lexRefinement(argv.classes).refinement
                                : undefined,
                        ),
                        gad,
                    ),
                ],
            ),
        },
    );

    const type: ATTRIBUTE<ACIItem> | undefined = {
        entry: entryACI,
        subentry: subentryACI,
        prescriptive: prescriptiveACI,
    }[argv.type!];
    if (!type) {
        throw new Error(`Unrecognized ACI attribute type '${argv.type!}'`);
    }

    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                type["&id"],
                [
                    type.encoderFor["&Type"]!(aci, DER),
                ],
                undefined,
            ),
        },
    ];
    const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        modifications,
        undefined,
        [],
    );
    const arg: ModifyEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: modifyEntry["&operationCode"]!,
        argument: _encode_ModifyEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            ctx.log.error(printCode(outcome.errcode));
        } else {
            ctx.log.error("Uncoded error.");
        }
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
}

export default do_modify_add_aci;

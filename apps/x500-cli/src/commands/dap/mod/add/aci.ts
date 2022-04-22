import type { Connection, Context } from "../../../../types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import { FALSE_BIT, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import type {
    ModAddACIItemArgs,
} from "../../../../yargs/dap_mod_add_aci";
import {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    ACIItem_itemOrUserFirst_userFirst,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem-itemOrUserFirst-userFirst.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level,
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import {
    UserClasses,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/UserClasses.ta";
import {
    UserPermission,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/UserPermission.ta";
import {
    ProtectedItems,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ProtectedItems.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import { lexSubtreeSpec } from "../../../../parsers/lexSubtreeSpec";
import {
    MaxValueCount,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/MaxValueCount.ta";
import {
    RestrictedValue,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/RestrictedValue.ta";
import { lexRefinement } from "../../../../parsers/parseRefinement";
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
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/GrantsAndDenials.ta";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import type {
    ATTRIBUTE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ATTRIBUTE.oca";

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
                            argv.attributeType?.map(ObjectIdentifier.fromString),
                            argv.allAttributeValues?.map(ObjectIdentifier.fromString),
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

    const type: ATTRIBUTE<ACIItem> | undefined = [
        entryACI,
        subentryACI,
        prescriptiveACI,
    ]
        .find((attr) => attr["&id"]!.isEqualTo(ObjectIdentifier.fromString(argv.type!)));
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

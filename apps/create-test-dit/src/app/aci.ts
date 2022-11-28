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
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
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
import { OBJECT_IDENTIFIER, TRUE_BIT, ObjectIdentifier } from "asn1-ts";
import { _encodeUTF8String, DER } from "asn1-ts/dist/node/functional";
import * as oc from "@wildboar/x500/src/lib/collections/objectClasses";
import * as at from "@wildboar/x500/src/lib/collections/attributes";
import { // FIXME: This is not in oc!!!
    subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa";
import {
    dynamicSubtrees,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicSubtrees.oa";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa";
import {
    vendorName,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorName.oa";
import {
    vendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorVersion.oa";
import {
    syncTimestamp,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncTimestamp.oa";
import {
    fullVendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/fullVendorVersion.oa";
import {
    administratorsAddress,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/administratorsAddress.oa";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa";
import {
    numSubordinates,
} from "@wildboar/parity-schema/src/lib/modules/DS389CoreSchema/numSubordinates.oa";

const DENY_ALL_BITS: number[] = [
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
];

const GRANT_ALL_BITS: number[] = [
    GrantsAndDenials_grantAdd,
    GrantsAndDenials_grantDiscloseOnError,
    GrantsAndDenials_grantCompare,
    GrantsAndDenials_grantBrowse,
    GrantsAndDenials_grantExport,
    GrantsAndDenials_grantFilterMatch,
    GrantsAndDenials_grantImport,
    GrantsAndDenials_grantInvoke,
    GrantsAndDenials_grantModify,
    GrantsAndDenials_grantRead,
    GrantsAndDenials_grantRemove,
    GrantsAndDenials_grantRename,
    GrantsAndDenials_grantReturnDN,
];

function createGrantsAndDenials (bitsToSet: number[]): GrantsAndDenials {
    const gad = new Uint8ClampedArray(26);
    for (const bit of bitsToSet) {
        gad[bit] = TRUE_BIT;
    }
    return gad;
}

const ADMIN_DN: DistinguishedName = [
    [
        new AttributeTypeAndValue(
            at.commonName["&id"],
            _encodeUTF8String("admin", DER),
        ),
    ],
];

export
const ANONYMOUS_BASELINE: ACIItem = new ACIItem(
    {
        uTF8String: "Anonymous Baseline",
    },
    4,
    {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_none,
            undefined,
            undefined,
        ),
    },
    {
        userFirst: new ACIItem_itemOrUserFirst_userFirst(
            new UserClasses(
                null,
            ),
            [
                /** Deny everything */
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        null,
                        null,
                        undefined,
                        undefined,
                        null,
                    ),
                    createGrantsAndDenials(DENY_ALL_BITS),
                ),
                /**
                 * Allow discovery of entries whose existence is probably
                 * obvious.
                 */
                new UserPermission(
                    8,
                    new ProtectedItems(
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            or: [
                                oc.country["&id"],
                                oc.locality["&id"],
                                oc.oidC1obj["&id"],
                                oc.oidC2obj["&id"],
                                oc.oidCobj["&id"],
                                oc.urnCobj["&id"],
                            ].map((item) => ({ item })),
                        },
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_grantBrowse,
                        GrantsAndDenials_grantReturnDN,
                    ]),
                ),
            ],
        ),
    },
);

export
const AUTHENTICATED_USER_BASELINE: ACIItem = new ACIItem(
    {
        uTF8String: "Authenticated User Baseline",
    },
    12,
    {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_simple,
            undefined,
            undefined,
        ),
    },
    {
        userFirst: new ACIItem_itemOrUserFirst_userFirst(
            new UserClasses(
                null,
            ),
            [
                // Allow discovery of every entry
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        null,
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_grantBrowse,
                        GrantsAndDenials_grantReturnDN,
                    ]),
                ),
                // Allow reading user attributes and values
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        undefined,
                        null,
                        undefined,
                        undefined,
                        null,
                    ),
                    createGrantsAndDenials([GrantsAndDenials_grantRead]),
                ),
                // Prohibit discovery of subentries
                new UserPermission(
                    16,
                    new ProtectedItems(
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            or: [
                                {
                                    item: subentry["&id"],
                                },
                            ],
                        },
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_denyBrowse,
                        GrantsAndDenials_denyReturnDN,
                        GrantsAndDenials_denyRead,
                    ]),
                ),
                // Prohibit reading or writing uniqueIdentifier
                // Prohibit reading or writing clearance
                new UserPermission(
                    16,
                    new ProtectedItems(
                        undefined,
                        undefined,
                        [
                            at.uniqueIdentifier["&id"],
                            at.clearance["&id"],
                        ],
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_denyRead,
                        GrantsAndDenials_denyModify,
                        GrantsAndDenials_denyRemove,
                        GrantsAndDenials_denyCompare,
                        GrantsAndDenials_denyFilterMatch,
                    ]),
                ),
            ],
        ),
    },
);

// TODO: Add new op attrs
const operationalAttributesUserCanReadOnSelf: OBJECT_IDENTIFIER[] = [
    at.entryACI["&id"],
    at.administrativeRole["&id"],
    at.accessControlScheme["&id"],
    at.createTimestamp["&id"],
    at.modifyTimestamp["&id"],
    at.dseType["&id"],
    at.hierarchyBelow["&id"],
    at.hierarchyLevel["&id"],
    at.hierarchyParent["&id"],
    at.hierarchyTop["&id"],
    at.pwdEndTime["&id"],
    at.pwdExpiryTime["&id"],
    at.pwdFails["&id"],
    at.pwdFailureTime["&id"],
    at.pwdGracesUsed["&id"],
    at.pwdStartTime["&id"],
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

export
const AUTHENTICATED_USER_SELF_BASELINE: ACIItem = new ACIItem(
    {
        uTF8String: "Authenticated User Self Baseline",
    },
    24,
    {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_simple,
            undefined,
            undefined,
        ),
    },
    {
        userFirst: new ACIItem_itemOrUserFirst_userFirst(
            new UserClasses(
                undefined,
                null,
            ),
            [
                // Allow discovering, reading, and modifying self
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        null,
                        null,
                        undefined,
                        undefined,
                        null,
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_grantBrowse,
                        GrantsAndDenials_grantReturnDN,
                        GrantsAndDenials_grantRead,
                        GrantsAndDenials_grantModify,
                    ]),
                ),
                // Prohibit writing uniqueIdentifier
                // Prohibit writing clearance
                new UserPermission(
                    28,
                    new ProtectedItems(
                        undefined,
                        undefined,
                        [
                            at.uniqueIdentifier["&id"],
                            at.clearance["&id"],
                        ],
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_denyModify,
                        GrantsAndDenials_denyRemove,
                    ]),
                ),
                // Permit viewing some operational attributes
                new UserPermission(
                    28,
                    new ProtectedItems(
                        undefined,
                        undefined,
                        operationalAttributesUserCanReadOnSelf,
                        operationalAttributesUserCanReadOnSelf,
                    ),
                    createGrantsAndDenials([
                        GrantsAndDenials_grantRead,
                        GrantsAndDenials_grantCompare,
                        GrantsAndDenials_grantFilterMatch,
                        GrantsAndDenials_grantDiscloseOnError,
                    ]),
                ),
            ],
        ),
    },
);

// Global Directory Administrator

export
const GLOBAL_DIRECTORY_ADMIN_BASELINE: ACIItem = new ACIItem(
    {
        uTF8String: "Global Directory Administrator Baseline",
    },
    64,
    {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_simple,
            undefined,
            undefined,
        ),
    },
    {
        userFirst: new ACIItem_itemOrUserFirst_userFirst(
            new UserClasses(
                undefined,
                undefined,
                [
                    new NameAndOptionalUID(
                        ADMIN_DN,
                        undefined,
                    ),
                ],
            ),
            [
                // Allow all permissions on everything
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        null,
                        null,
                        [
                            ...Object.values(at).map((t) => t["&id"]),
                            new ObjectIdentifier([ 1, 3, 6, 1, 1, 16, 4 ])
                        ],
                        [
                            ...Object.values(at).map((t) => t["&id"]),
                            new ObjectIdentifier([ 1, 3, 6, 1, 1, 16, 4 ])
                        ],
                        null,
                    ),
                    createGrantsAndDenials(GRANT_ALL_BITS),
                ),
            ],
        ),
    },
);

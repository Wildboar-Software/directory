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
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
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
import { OBJECT_IDENTIFIER, TRUE_BIT, ObjectIdentifier } from "@wildboar/asn1";
import { _encodeUTF8String, DER } from "@wildboar/asn1/functional";
import { attributes as at } from "@wildboar/x500";
import { objectClasses as oc } from "@wildboar/x500";
import { // FIXME: This is not in oc!!!
    subentry,
} from "@wildboar/x500/InformationFramework";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
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
import { countryName, localityName, stateOrProvinceName } from "@wildboar/x500/SelectedAttributeTypes";
import { organization, person, residentialPerson } from "@wildboar/x500/SelectedObjectClasses";
import { searchRules, SubtreeSpecification } from "@wildboar/x500/InformationFramework";

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

const READ_ONLY_BITS: number[] = [
    GrantsAndDenials_grantCompare,
    GrantsAndDenials_grantBrowse,
    GrantsAndDenials_grantFilterMatch,
    GrantsAndDenials_grantInvoke,
    GrantsAndDenials_grantRead,
    GrantsAndDenials_grantReturnDN,
];

const READ_AND_INVOKE_BITS: number[] = [
    GrantsAndDenials_grantInvoke,
    GrantsAndDenials_grantRead,
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
                            ObjectIdentifier.fromParts([ 1, 3, 6, 1, 1, 16, 4 ])
                        ],
                        [
                            ...Object.values(at).map((t) => t["&id"]),
                            ObjectIdentifier.fromParts([ 1, 3, 6, 1, 1, 16, 4 ])
                        ],
                        null,
                    ),
                    createGrantsAndDenials(GRANT_ALL_BITS),
                ),
            ],
        ),
    },
);

const ocala_dn: DistinguishedName = [
    [
        new AttributeTypeAndValue(
            countryName["&id"],
            countryName.encoderFor["&Type"]!("US", DER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            stateOrProvinceName["&id"],
            stateOrProvinceName.encoderFor["&Type"]!({ uTF8String: "FL" }, DER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            localityName["&id"],
            localityName.encoderFor["&Type"]!({ uTF8String: "MAR" }, DER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            localityName["&id"],
            localityName.encoderFor["&Type"]!({ uTF8String: "Ocala" }, DER),
        ),
    ],
];

export
const OCALA_USERS: ACIItem = new ACIItem(
    {
        uTF8String: "Ocala Users",
    },
    50,
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
                undefined,
                undefined,
                [ // Everybody one level beneath C=US,ST=FL,L=MAR,L=Ocala
                    new SubtreeSpecification(
                        ocala_dn,
                        undefined,
                        undefined,
                        1,
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
                        undefined,
                        undefined,
                        null,
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
                                    item: organization["&id"],
                                },
                                {
                                    item: residentialPerson["&id"],
                                },
                                {
                                    item: person["&id"],
                                },
                            ],
                        }
                    ),
                    createGrantsAndDenials(READ_ONLY_BITS),
                ),
            ],
        ),
    },
);

// NOTE: This needs to go in subentryACI.
export
const OCALA_USERS_SERVICES: ACIItem = new ACIItem(
    {
        uTF8String: "Ocala Users Services",
    },
    49,
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
                undefined,
                undefined,
                [ // Everybody one level beneath C=US,ST=FL,L=MAR,L=Ocala
                    new SubtreeSpecification(
                        ocala_dn,
                        undefined,
                        undefined,
                        1,
                    ),
                ],
            ),
            [
                // Allow all permissions on everything
                new UserPermission(
                    undefined,
                    new ProtectedItems(
                        null,
                        undefined,
                        [
                            searchRules["&id"],
                        ],
                        [
                            searchRules["&id"],
                        ],
                    ),
                    createGrantsAndDenials(READ_AND_INVOKE_BITS),
                ),
            ],
        ),
    },
);

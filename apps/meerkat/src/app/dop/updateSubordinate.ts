import type { Context, Vertex } from "../types";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import connect from "../net/connect";
import {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    modifyOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/modifyOperationalBinding.oa";
import {
    ModifyOperationalBindingArgument,
    _encode_ModifyOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
import {
    ModifyOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    SuperiorToSubordinate as SuperiorToSubordinateModification,
    _encode_SuperiorToSubordinate as _encode_SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    MasterAndShadowAccessPoints,
    Vertex as X500Vertex,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubentryInfo.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import readChildren from "../dit/readChildren";
import { DERElement } from "asn1-ts";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import readAttributes from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";

import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import { entryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import { subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import { contextAssertionDefaults } from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import { searchRules } from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import { pwdAttribute } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAttribute.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import { aliasedEntryName } from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
// createTimestamp?
// modifyTimestamp?

// dSAOperationalBindingManagementBind OPERATION ::= dSABind

// dSABind OPERATION ::= {
//     ARGUMENT     DSABindArgument
//     RESULT       DSABindResult
//     ERRORS       { directoryBindError } }

//   DSABindArgument  ::=  SET  {
//     credentials  [0]  DSACredentials OPTIONAL,
//     versions     [1]  Versions DEFAULT {v1},
//     ... }

//   DSACredentials  ::=  CHOICE  {
//     simple             [0]  SimpleCredentials,
//     strong             [1]  StrongCredentials,
//     externalProcedure  [2]  EXTERNAL,
//     spkm               [3]  SpkmCredentials,
//     ... }

//   DSABindResult  ::=  DSABindArgument

// modifyOperationalBinding OPERATION ::= {
//     ARGUMENT  ModifyOperationalBindingArgument
//     RESULT    ModifyOperationalBindingResult
//     ERRORS    {operationalBindingError | securityError}
//     CODE      id-op-modifyOperationalBinding }

//   ModifyOperationalBindingArgument ::=
//     OPTIONALLY-PROTECTED-SEQ { ModifyOperationalBindingArgumentData }

//   ModifyOperationalBindingArgumentData ::= SEQUENCE {
//     bindingType       [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//     bindingID         [1]  OperationalBindingID,
//     accessPoint       [2]  AccessPoint OPTIONAL,
//     -- symmetric, Role A initiates, or Role B initiates
//     initiator              CHOICE {
//       symmetric         [3]  OPERATIONAL-BINDING.&both.&ModifyParam
//                             ({OpBindingSet}{@bindingType}),
//       roleA-initiates   [4]  OPERATIONAL-BINDING.&roleA.&ModifyParam
//                             ({OpBindingSet}{@bindingType}),
//       roleB-initiates   [5]  OPERATIONAL-BINDING.&roleB.&ModifyParam
//                             ({OpBindingSet}{@bindingType})} OPTIONAL,
//     newBindingID      [6]  OperationalBindingID,
//     newAgreement      [7]  OPERATIONAL-BINDING.&Agreement
//                          ({OpBindingSet}{@bindingType}) OPTIONAL,
//     valid               [8]  ModifiedValidity OPTIONAL,
//     securityParameters  [9]  SecurityParameters OPTIONAL,
//     ...}

//   ModifiedValidity ::= SEQUENCE {
//     validFrom            [0]  CHOICE {
//       now                  [0]  NULL,
//       time                 [1]  Time,
//       ...} DEFAULT now:NULL,
//     validUntil           [1]  CHOICE {
//       explicitTermination  [0]  NULL,
//       time                 [1]  Time,
//       unchanged            [2]  NULL,
//       ... } DEFAULT unchanged:NULL,
//     ... }

//   ModifyOperationalBindingResult ::= CHOICE {
//     null            NULL,
//     protected  [1]  OPTIONALLY-PROTECTED-SEQ{ ModifyOperationalBindingResultData },
//     ... }

//   ModifyOperationalBindingResultData ::= SEQUENCE {
//       newBindingID    OperationalBindingID,
//       bindingType     OPERATIONAL-BINDING.&id({OpBindingSet}),
//       newAgreement    OPERATIONAL-BINDING.&Agreement ({OpBindingSet}{@.bindingType}),
//       valid           Validity OPTIONAL,
//       ...,
//       ...,
//       COMPONENTS OF   CommonResultsSeq
//       }


//   OpBindingSet OPERATIONAL-BINDING ::= {
//     shadowOperationalBinding |
//     hierarchicalOperationalBinding |
//     nonSpecificHierarchicalOperationalBinding }

// hierarchicalOperationalBinding OPERATIONAL-BINDING ::= {
//     AGREEMENT             HierarchicalAgreement
//     APPLICATION CONTEXTS  {{directorySystemAC}}
//     ASYMMETRIC
//       ROLE-A { -- superior DSA
//         ESTABLISHMENT-INITIATOR  TRUE
//         ESTABLISHMENT-PARAMETER  SuperiorToSubordinate
//         MODIFICATION-INITIATOR   TRUE
//         MODIFICATION-PARAMETER   SuperiorToSubordinateModification
//         TERMINATION-INITIATOR    TRUE }
//       ROLE-B { -- subordinate DSA
//         ESTABLISHMENT-INITIATOR  TRUE
//         ESTABLISHMENT-PARAMETER  SubordinateToSuperior
//         MODIFICATION-INITIATOR   TRUE
//         MODIFICATION-PARAMETER   SubordinateToSuperior
//         TERMINATION-INITIATOR    TRUE }
//     ID                    id-op-binding-hierarchical }

// HierarchicalAgreement ::= SEQUENCE {
//     rdn                [0]  RelativeDistinguishedName,
//     immediateSuperior  [1]  DistinguishedName,
//     ... }

//   SuperiorToSubordinate ::= SEQUENCE {
//     contextPrefixInfo     [0]  DITcontext,
//     entryInfo             [1]  SET SIZE (1..MAX) OF
//                                  Attribute{{SupportedAttributes}} OPTIONAL,
//     immediateSuperiorInfo [2]  SET SIZE (1..MAX) OF
//                                  Attribute{{SupportedAttributes}} OPTIONAL,
//     ... }

// SuperiorToSubordinateModification ::= SuperiorToSubordinate (
//     WITH COMPONENTS {..., entryInfo  ABSENT } )

// DITcontext ::= SEQUENCE OF Vertex

// Vertex ::= SEQUENCE {
//     rdn [0] RelativeDistinguishedName,
//     admPointInfo [1] SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}} OPTIONAL,
//     subentries [2] SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
//     accessPoints [3] MasterAndShadowAccessPoints OPTIONAL,
//     ... }

// SubentryInfo ::= SEQUENCE {
//     rdn [0] RelativeDistinguishedName,
//     info [1] SET OF Attribute{{SupportedAttributes}},
//     ... }

const admPointEIS = new EntryInformationSelection(
    {
        select: [
            aliasedEntryName["&id"],
        ],
    },
    undefined,
    {
        select: [
            administrativeRole["&id"],
            accessControlScheme["&id"],
            subentryACI["&id"],
            entryACI["&id"],
        ],
    },
    undefined,
    undefined,
    undefined,
);

const subentryEIS = new EntryInformationSelection(
    {
        select: [
            commonName["&id"],
            aliasedEntryName["&id"],
        ],
    },
    undefined,
    {
        select: [
            entryACI["&id"],
            prescriptiveACI["&id"],
            subtreeSpecification["&id"],
            contextAssertionDefaults["&id"],
            searchRules["&id"],
            pwdAttribute["&id"],
            pwdModifyEntryAllowed["&id"],
            pwdChangeAllowed["&id"],
            pwdMaxAge["&id"],
            pwdExpiryAge["&id"],
            pwdMinLength["&id"],
            pwdVocabulary["&id"],
            pwdAlphabet["&id"],
            pwdDictionaries["&id"],
            pwdExpiryWarning["&id"],
            pwdGraces["&id"],
            pwdFailureDuration["&id"],
            pwdLockoutDuration["&id"],
            pwdMaxFailures["&id"],
            pwdMaxTimeInHistory["&id"],
            pwdMinTimeInHistory["&id"],
            pwdHistorySlots["&id"],
            pwdRecentlyExpiredDuration["&id"],
            pwdEncAlg["&id"],
        ],
    },
    undefined,
    undefined,
    undefined,
);

export
async function updateSubordinate (
    ctx: Context,
    currentBindingID: OperationalBindingID,
    immediateSuperior: Vertex,
    immediateSuperiorInfo: Attribute[] | undefined,
    subordinateRDN: RDN,
    targetSystem: AccessPoint,
): Promise<ResultOrError> {
    const conn = await connect(ctx, targetSystem, dop_ip["&id"]!);
    if (!conn) {
        throw new Error();
    }
    const ditContext: X500Vertex[] = []; // To be reversed.
    let cpEncountered: boolean = false;
    let current: Vertex | undefined = immediateSuperior;
    while (current) {
        const admPointAttributes: Attribute[] = [];
        const subentryInfos: SubentryInfo[] = [];
        const accessPoints: MasterAndShadowAccessPoints = [];
        if (!cpEncountered && current.dse.cp) {
            cpEncountered = true;
        }

        if (current.dse.admPoint) {
            const {
                userAttributes,
                operationalAttributes,
            } = await readAttributes(ctx, current, admPointEIS);
            admPointAttributes.push(
                ...userAttributes,
                ...operationalAttributes,
            );

            const subordinates = await readChildren(ctx, current);
            subentryInfos.push(
                ...await Promise.all(
                    subordinates
                        .filter((sub) => sub.dse.subentry)
                        .map(async (sub): Promise<SubentryInfo> => {
                            const {
                                userAttributes,
                                operationalAttributes,
                            } = await readAttributes(ctx, sub, subentryEIS);
                            return new SubentryInfo(
                                sub.dse.rdn,
                                [
                                    ...userAttributes,
                                    ...operationalAttributes,
                                ],
                            );
                        }),
                ),
            );
        }

        ditContext.push(new X500Vertex(
            current.dse.rdn,
            (admPointAttributes.length > 0)
                ? admPointAttributes
                : undefined,
            (subentryInfos.length > 0)
                ? subentryInfos
                : undefined,
            (accessPoints.length > 0)
                ? accessPoints
                : undefined,
        ));
        current = current.immediateSuperior;
    }
    const sup2sub = new SuperiorToSubordinateModification(
        ditContext.reverse(),
        undefined, // entryInfo is ABSENT in SuperiorToSubordinateModification
        immediateSuperiorInfo,
    );
    const agreement = new HierarchicalAgreement(
        subordinateRDN,
        getDistinguishedName(immediateSuperior),
    );

    const newBindingID = new OperationalBindingID(
        currentBindingID.identifier,
        currentBindingID.identifier + 1,
    );

    const arg: ModifyOperationalBindingArgument = {
        unsigned: new ModifyOperationalBindingArgumentData(
            id_op_binding_hierarchical,
            currentBindingID,
            ctx.dsa.accessPoint,
            {
                roleA_initiates: _encode_SuperiorToSubordinateModification(sup2sub, () => new DERElement()),
            },
            newBindingID,
            _encode_HierarchicalAgreement(agreement, () => new DERElement()),
            undefined, // Validity remains the same.
            undefined, // TODO: Security parameters
        ),
    };
    return conn.writeOperation({
        opCode: modifyOperationalBinding["&operationCode"]!,
        argument: _encode_ModifyOperationalBindingArgument(arg, () => new DERElement()),
    });
}

export default updateSubordinate;

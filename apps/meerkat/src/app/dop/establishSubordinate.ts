import type { Context, Vertex } from "../types";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import connect from "../net/connect";
import {
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    EstablishOperationalBindingArgument,
    _encode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    Validity,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Validity.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    MasterAndShadowAccessPoints,
    Vertex as X500Vertex,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubentryInfo.ta";
import getDistinguishedName from "../x500/getDistinguishedName";
import readChildren from "../dit/readChildren";
import * as crypto from "crypto";
import { ASN1Element, DERElement, ObjectIdentifier } from "asn1-ts";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry";

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

// establishOperationalBinding OPERATION ::= {
//     ARGUMENT   EstablishOperationalBindingArgument
//     RESULT     EstablishOperationalBindingResult
//     ERRORS     {operationalBindingError | securityError}
//     CODE       id-op-establishOperationalBinding }

//   EstablishOperationalBindingArgument ::=
//     OPTIONALLY-PROTECTED-SEQ { EstablishOperationalBindingArgumentData }

//   EstablishOperationalBindingArgumentData ::= SEQUENCE {
//     bindingType        [0]  OPERATIONAL-BINDING.&id({OpBindingSet}),
//     bindingID          [1]  OperationalBindingID OPTIONAL,
//     accessPoint        [2]  AccessPoint,
//                  -- symmetric, Role A initiates, or Role B initiates
//     initiator               CHOICE {
//       symmetric          [3]  OPERATIONAL-BINDING.&both.&EstablishParam
//                               ({OpBindingSet}{@bindingType}),
//       roleA-initiates    [4]  OPERATIONAL-BINDING.&roleA.&EstablishParam
//                               ({OpBindingSet}{@bindingType}),
//       roleB-initiates    [5]  OPERATIONAL-BINDING.&roleB.&EstablishParam
//                                 ({OpBindingSet}{@bindingType})},
//     agreement          [6]  OPERATIONAL-BINDING.&Agreement
//                               ({OpBindingSet}{@bindingType}),
//     valid              [7]  Validity DEFAULT {},
//     securityParameters [8]  SecurityParameters OPTIONAL,
//     ... }

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

const DER = () => new DERElement();

export
async function establishSubordinate (
    ctx: Context,
    immediateSuperior: Vertex,
    immediateSuperiorInfo: Attribute[] | undefined,
    newEntry: Vertex,
    newEntryInfo: Attribute[] | undefined,
    targetSystem: AccessPoint,
    endTime?: Date,
): Promise<ASN1Element> {
    const conn = await connect(ctx, targetSystem);
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
            admPointAttributes.push(new Attribute(
                administrativeRole["&id"],
                Array.from(current.dse.admPoint.administrativeRole)
                    .map((ar) => ObjectIdentifier.fromString(ar))
                    .map((ar) => administrativeRole.encoderFor["&Type"]!(ar, DER)),
                undefined,
            ));
            if (current.dse.admPoint.accessControlScheme) {
                admPointAttributes.push(new Attribute(
                    accessControlScheme["&id"],
                    [
                        accessControlScheme.encoderFor["&Type"]!(current.dse.admPoint.accessControlScheme, DER),
                    ],
                    undefined,
                ));
            }
            if (current.dse.admPoint.subentryACI) {
                admPointAttributes.push(new Attribute(
                    subentryACI["&id"],
                    current.dse.admPoint.subentryACI
                        .map((aci) => subentryACI.encoderFor["&Type"]!(aci, DER)),
                    undefined,
                ));
            }
            if (current.dse.entryACI) {
                admPointAttributes.push(new Attribute(
                    entryACI["&id"],
                    current.dse.entryACI
                        .map((aci) => entryACI.encoderFor["&Type"]!(aci, DER)),
                    undefined,
                ));
            }

            const subordinates = await readChildren(ctx, current);
            subentryInfos.push(...subordinates
                .filter((sub) => sub.dse.subentry)
                .map((sub) => new SubentryInfo(
                    sub.dse.rdn,
                    getAttributesFromSubentry(sub),
                )));
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
    const bindingIdentifier: number = crypto.randomInt(4294967296);
    const sup2sub = new SuperiorToSubordinate(
        ditContext.reverse(),
        newEntryInfo,
        immediateSuperiorInfo,
    );
    const agreement = new HierarchicalAgreement(
        newEntry.dse.rdn,
        getDistinguishedName(immediateSuperior),
    );

    const arg: EstablishOperationalBindingArgument = {
        unsigned: new EstablishOperationalBindingArgumentData(
            id_op_binding_hierarchical,
            new OperationalBindingID(
                bindingIdentifier,
                0,
            ),
            ctx.dsa.accessPoint,
            {
                roleA_initiates: _encode_SuperiorToSubordinate(sup2sub, () => new DERElement()),
            },
            _encode_HierarchicalAgreement(agreement, () => new DERElement()),
            endTime
                ? new Validity(
                    {
                        now: null,
                    },
                    {
                        time: {
                            generalizedTime: endTime,
                        },
                    },
                )
                : undefined,
            undefined,
        ),
    };
    return conn.writeOperation(
        establishOperationalBinding["&operationCode"]!,
        _encode_EstablishOperationalBindingArgument(arg, () => new DERElement()),
    );
}

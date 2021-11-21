import type { Context, Vertex } from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { connect, ConnectOptions } from "../net/connect";
import type {
    Connection,
    WriteOperationOptions,
} from "../net/Connection";
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
import type {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
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
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import admPointEIS from "./admPointEIS";
import subentryEIS from "./subentryEIS";
import readAttributes from "../database/entry/readAttributes";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import createSecurityParameters from "../x500/createSecurityParameters";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";

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

// FIXME: Allow creation of alias+cp

export
interface EstablishSubordinateOptions extends ConnectOptions, WriteOperationOptions {
    endTime?: Date;
}

export
async function establishSubordinate (
    ctx: Context,
    immediateSuperior: Vertex,
    immediateSuperiorInfo: Attribute[] | undefined,
    newEntryRDN: RelativeDistinguishedName,
    newEntryInfo: Attribute[] | undefined,
    targetSystem: AccessPoint,
    options?: EstablishSubordinateOptions,
): Promise<ResultOrError> {
    const connectionTimeout: number | undefined = options?.timeLimitInMilliseconds;
    const startTime = new Date();
    const timeoutTime: Date | undefined = connectionTimeout
        ? addMilliseconds(startTime, connectionTimeout)
        : undefined;
    const conn: Connection | null = await connect(ctx, targetSystem, dop_ip["&id"]!, {
        timeLimitInMilliseconds: options?.timeLimitInMilliseconds,
    });
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

            const subordinates = await readChildren(ctx, current, undefined, undefined, undefined, {
                subentry: true,
            });
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
    const bindingIdentifier: number = generateUnusedInvokeID(ctx);
    const sup2sub = new SuperiorToSubordinate(
        ditContext.reverse(),
        newEntryInfo,
        immediateSuperiorInfo,
    );
    const agreement = new HierarchicalAgreement(
        newEntryRDN,
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
                roleA_initiates: _encode_SuperiorToSubordinate(sup2sub, DER),
            },
            _encode_HierarchicalAgreement(agreement, DER),
            options?.endTime
                ? new Validity(
                    {
                        now: null,
                    },
                    {
                        time: {
                            generalizedTime: options.endTime,
                        },
                    },
                )
                : undefined,
            createSecurityParameters(
                ctx,
                targetSystem.ae_title.rdnSequence,
                establishOperationalBinding["&operationCode"],
            ),
        ),
    };
    const timeRemainingForOperation: number | undefined = timeoutTime
        ? differenceInMilliseconds(timeoutTime, new Date())
        : undefined;
    return conn.writeOperation({
        opCode: establishOperationalBinding["&operationCode"]!,
        argument: _encode_EstablishOperationalBindingArgument(arg, DER),
    }, {
        timeLimitInMilliseconds: timeRemainingForOperation,
    });
}

export default establishSubordinate;

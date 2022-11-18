import { Vertex, ServiceError } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { ConnectOptions } from "../net/connect";
import { bindForOBM } from "../net/bindToOtherDSA";
import type {
    WriteOperationOptions,
} from "../net/Connection";
import {
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    HierarchicalAgreement,
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
import readSubordinates from "../dit/readSubordinates";
import admPointEIS from "./admPointEIS";
import subentryEIS from "./subentryEIS";
import readAttributes from "../database/entry/readAttributes";
import { addMilliseconds } from "date-fns";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { verifySIGNED } from "../pki/verifySIGNED";
import {
    _encode_EstablishOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResultData.ta";
import {
    EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import { OperationOutcome } from "@wildboar/rose-transport";
import { CommonEstablishOptions } from "@wildboar/x500-client-ts";

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

export
interface EstablishSubordinateOptions extends ConnectOptions, WriteOperationOptions {
    endTime?: Date;
}

export
interface EstablishSubordinateReturn {
    arg: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate>;
    response: OperationOutcome<EstablishOperationalBindingResult>;
}

/**
 * @summary Make an outbound DOP request to establish another DSA as a subordinate DSA in a HOB.
 * @description
 *
 * This function produces an outbound Directory Operational Binding Management
 * Protocol (DOP) request to another DSA that may then agree, and thereby become
 * a subordinate DSA in a hierarchical operational binding.
 *
 * @param ctx The context object
 * @param immediateSuperior The immediate superior vertex
 * @param immediateSuperiorInfo Attributes of the immediate superior to disclose to the subordinate DSA
 * @param newEntryRDN The newly created context prefix's relative distinguished name (RDN)
 * @param newEntryInfo The attributes of the newly created context prefix
 * @param targetSystem The access point of the potential subordinate DSA
 * @param signErrors Whether to cryptographically sign errors
 * @param aliasDereferenced Whether an alias was dereferenced in the operation leading up to this
 * @param options Options
 * @returns A result or an error
 *
 * @function
 * @async
 */
export
async function establishSubordinate (
    ctx: MeerkatContext,
    immediateSuperior: Vertex,
    immediateSuperiorInfo: Attribute[] | undefined,
    newEntryRDN: RelativeDistinguishedName,
    newEntryInfo: Attribute[] | undefined,
    targetSystem: AccessPoint,
    signErrors: boolean,
    aliasDereferenced?: boolean,
    options?: EstablishSubordinateOptions,
): Promise<EstablishSubordinateReturn> {
    const connectionTimeout: number | undefined = options?.timeLimitInMilliseconds;
    const startTime = new Date();
    const timeoutTime: Date | undefined = connectionTimeout
        ? addMilliseconds(startTime, connectionTimeout)
        : undefined;
    ctx.log.info(ctx.i18n.t("log:establishing_hob_via_add_entry", {
        uuid: immediateSuperior.dse.uuid,
    }));
    const assn = await bindForOBM(ctx, undefined, undefined, targetSystem, aliasDereferenced, signErrors);
    // const assn: Connection | null = await connect(ctx, targetSystem, dop_ip["&id"]!, {
    //     timeLimitInMilliseconds: options?.timeLimitInMilliseconds,
    //     tlsOptional: ctx.config.chaining.tlsOptional,
    //     signErrors,
    // });
    if (!assn) {
        throw new ServiceError(
            ctx.i18n.t("err:could_not_connect"),
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    serviceError["&errorCode"]
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
            ),
            signErrors,
        );
    }
    const ditContext: X500Vertex[] = []; // To be reversed.
    let cpEncountered: boolean = false;
    let current: Vertex | undefined = immediateSuperior;
    while (current && current.immediateSuperior) {
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
            } = await readAttributes(ctx, current, {
                selection: admPointEIS,
            });
            admPointAttributes.push(
                ...userAttributes,
                ...operationalAttributes,
            );

            const subordinates = await readSubordinates(ctx, current, undefined, undefined, undefined, {
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
                            } = await readAttributes(ctx, sub, {
                                selection: subentryEIS,
                            });
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
    const sup2sub = new SuperiorToSubordinate(
        ditContext.reverse(),
        newEntryInfo,
        immediateSuperiorInfo,
    );
    const agreement = new HierarchicalAgreement(
        newEntryRDN,
        getDistinguishedName(immediateSuperior),
    );

    // const timeRemainingForOperation: number | undefined = timeoutTime
    //     ? differenceInMilliseconds(timeoutTime, new Date())
    //     : undefined;

    try {
        const opts: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate> = {
            accessPoint: ctx.dsa.accessPoint,
            initiator: sup2sub,
            agreement,
            valid: options?.endTime
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
            securityParameters: createSecurityParameters(
                ctx,
                true,
                targetSystem.ae_title.rdnSequence,
                establishOperationalBinding["&operationCode"],
            ),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
        };
        const response = await assn.establishHOBWithSubordinate(opts);
        assn.unbind().then().catch(); // INTENTIONAL_NO_AWAIT
        if ("result" in response && response.result) {
            const result = response.result.parameter;
            if ("signed" in result) {
                const resultData = getOptionallyProtectedValue(result);
                const certPath = resultData.securityParameters?.certification_path;
                await verifySIGNED(
                    ctx,
                    undefined,
                    certPath,
                    response.result.invoke_id,
                    aliasDereferenced,
                    result.signed,
                    _encode_EstablishOperationalBindingResultData,
                    signErrors,
                    "result",
                );
            }
        }
        return {
            arg: opts,
            response,
        };
    } catch (e) {
        throw new ServiceError(
            ctx.i18n.t("err:failed_to_establish_hob", {
                etype: e?.name,
                e,
            }),
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    serviceError["&errorCode"]
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
            ),
            signErrors,
        );
    }
}

export default establishSubordinate;

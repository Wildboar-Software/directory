import { Vertex, ServiceError } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import type {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import { bindForOBM } from "../net/bindToOtherDSA.js";
import {
    establishOperationalBinding,
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    SuperiorToSubordinate,
    HierarchicalAgreement,
    Vertex as X500Vertex,
    SubentryInfo,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    Validity,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    RelativeDistinguishedName,
    Attribute,
} from "@wildboar/pki-stub";
import {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/DistributedOperations";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import readSubordinates from "../dit/readSubordinates.js";
import admPointEIS from "./admPointEIS.js";
import subentryEIS from "./subentryEIS.js";
import readAttributes from "../database/entry/readAttributes.js";
import { addMilliseconds } from "date-fns";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import { checkNameForm, getOptionallyProtectedValue } from "@wildboar/x500";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import {
    _encode_EstablishOperationalBindingResultData,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    EstablishOperationalBindingResult,
} from "@wildboar/x500/OperationalBindingManagement";
import { OperationOutcome } from "@wildboar/rose-transport";
import { CommonEstablishOptions } from "@wildboar/x500-client-ts";
import { dSAProblem } from "@wildboar/x500/SelectedAttributeTypes";
import {
    id_pr_targetDsaUnavailable,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER, _decodeObjectIdentifier, _encodeInteger } from "@wildboar/asn1/functional";
import { objectClass } from "@wildboar/x500/InformationFramework";
import { governingStructureRule } from "@wildboar/x500/SchemaAdministration";
import getSubschemaSubentry from "../dit/getSubschemaSubentry.js";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import getStructuralObjectClass from "../x500/getStructuralObjectClass.js";
import { getEntryAttributesToShareInOpBinding } from "../dit/getEntryAttributesToShareInOpBinding.js";
import stringifyDN from "../x500/stringifyDN.js";
import util from "node:util";
import getUniqueOpBindingId from "../utils/getUniqueOpBindingId.js";

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
interface EstablishSubordinateOptions {
    timeLimitInMilliseconds?: number;
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
    // TODO: Why is this unused?
    const timeoutTime: Date | undefined = connectionTimeout
        ? addMilliseconds(startTime, connectionTimeout)
        : undefined;
    const logInfo = {
        immediateSuperior: stringifyDN(ctx, getDistinguishedName(immediateSuperior)),
        newEntryRDN: stringifyDN(ctx, [ newEntryRDN ]),
        targetSystem: stringifyDN(ctx, targetSystem.ae_title.rdnSequence),
        signErrors,
        aliasDereferenced,
        deadline: options?.endTime ?? timeoutTime,
    };
    ctx.log.info(ctx.i18n.t("log:establishing_hob_via_add_entry", {
        uuid: immediateSuperior.dse.uuid,
    }), logInfo);
    const assn = await bindForOBM(ctx, undefined, undefined, targetSystem, aliasDereferenced, signErrors);
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
                [
                    new Attribute(
                        dSAProblem["&id"],
                        [dSAProblem.encoderFor["&Type"]!(id_pr_targetDsaUnavailable, DER)],
                    ),
                ],
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

    /**
     * If there is no governingStructureRule among the new entry attributes, add
     * one. Note that this code was copied from validateNewEntry().
     */
    if (
        newEntryInfo
        && !newEntryInfo.some((info) => info.type_.isEqualTo(governingStructureRule["&id"]))
    ) {
        const schemaSubentry = await getSubschemaSubentry(ctx, immediateSuperior, new Map());
        if (schemaSubentry && (typeof immediateSuperior.dse.governingStructureRule === "number")) {
            if (!schemaSubentry?.dse.subentry) {
                throw new Error("e41612c3-6239-451f-a971-a9d59bfb5183");
            }
            const objectClasses: OBJECT_IDENTIFIER[] = newEntryInfo
                .filter((attr) => attr.type_.isEqualTo(objectClass["&id"]))
                .flatMap((attr) => attr.values)
                .map(_decodeObjectIdentifier);
            const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);
            const structuralRule = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
                .find((rule) => {
                    if (rule.obsolete) {
                        return false;
                    }
                    if (!rule.superiorStructureRules?.includes(immediateSuperior.dse.governingStructureRule!)) {
                        return false;
                    }
                    const nf = ctx.nameForms.get(rule.nameForm.toString());
                    if (!nf) {
                        return false;
                    }
                    if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                        return false;
                    }
                    if (nf.obsolete) {
                        return false;
                    }
                    return checkNameForm(newEntryRDN, nf.mandatoryAttributes, nf.optionalAttributes);
                });
            if (structuralRule) {
                newEntryInfo.push(new Attribute(
                    governingStructureRule["&id"],
                    [_encodeInteger(structuralRule.ruleIdentifier, DER)],
                ));
            }
        }
    }

    /**
     * Immediate superior info is necessary for correct operation of the
     * directory across HOB boundaries. For one, the governing structure rule of
     * the immediate superior entry must be replicated so that the governing
     * structure rule of the subordinate can be determined by the subordinate
     * DSA. There are probably other reasons I have yet to think of.
     *
     * If the caller of this function supplies immediate superior info, we just
     * use that. If not, we need to obtain it within this function to replicate
     * it. If the immediate superior is an administrative point, we have
     * already included all of the necessary information in the administrative
     * point information in the context prefix information of the HOB initiation
     * parameters, and therefore, we do not need to fill in the
     * `immediateSuperiorInfo` field; if the immediate superior is NOT an
     * administrative point, we DO need to fill this field in.
     */
    const superiorInfo = immediateSuperiorInfo
        ?? (immediateSuperior.dse.admPoint
            ? undefined
            : await getEntryAttributesToShareInOpBinding(ctx, immediateSuperior));
    const sup2sub = new SuperiorToSubordinate(
        ditContext.reverse(),
        newEntryInfo,
        superiorInfo,
    );
    const agreement = new HierarchicalAgreement(
        newEntryRDN,
        getDistinguishedName(immediateSuperior),
    );

    try {
        const opts: CommonEstablishOptions<HierarchicalAgreement, SuperiorToSubordinate> = {
            accessPoint: ctx.dsa.accessPoint,
            initiator: sup2sub,
            agreement,
            valid: (options?.endTime ?? timeoutTime)
                ? new Validity(
                    {
                        now: null,
                    },
                    {
                        time: {
                            // I don't get why I have to use the non-null assertion here.
                            // Why doesn't the condition above know that this is truthy?
                            generalizedTime: (options?.endTime ?? timeoutTime)!,
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
            bindingID: new OperationalBindingID(
                getUniqueOpBindingId(),
                0,
            ),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
        };
        const response = await assn.establishHOBWithSubordinate(opts);
        assn.unbind({ disconnectSocket: true }) // INTENTIONAL_NO_AWAIT
            .then()
            .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_unbind", { e }), {
                ...logInfo,
                ...((typeof e === "object" && e) ? e : {}),
            }));
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
        if (process.env.MEERKAT_LOG_JSON !== "1") {
            ctx.log.error(util.inspect(e));
        }
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

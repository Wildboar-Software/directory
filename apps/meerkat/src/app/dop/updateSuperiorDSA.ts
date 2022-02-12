import {
    Context,
    Vertex,
    ServiceError,
    UpdateError,
} from "@wildboar/meerkat-types";
import { ASN1Construction, ASN1TagClass, ASN1UniversalType, DERElement, BERElement, ObjectIdentifier } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { connect, ConnectOptions } from "../net/connect";
import type {
    Connection,
    WriteOperationOptions,
} from "../net/Connection";
import dnToVertex from "../dit/dnToVertex";
import getRelevantOperationalBindings from "./getRelevantOperationalBindings";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { strict as assert } from "assert";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
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
    SubordinateToSuperior,
    _encode_SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    SubentryInfo,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
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
    _encode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import readSubordinates from "../dit/readSubordinates";
import getAttributesFromSubentry from "../dit/getAttributesFromSubentry";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_affectsMultipleDSAs,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";

export
interface UpdateSuperiorOptions extends ConnectOptions, WriteOperationOptions {
    endTime?: Date;
}

export
async function updateSuperiorDSA (
    ctx: Context,
    affectedDN: DistinguishedName,
    newCP: Vertex,
    aliasDereferenced: boolean,
    options?: UpdateSuperiorOptions,
): Promise<ResultOrError> {
    const connectionTimeout: number | undefined = options?.timeLimitInMilliseconds;
    const startTime = new Date();
    const timeoutTime: Date | undefined = connectionTimeout
        ? addMilliseconds(startTime, connectionTimeout)
        : undefined;
    const activeHOBs = await getRelevantOperationalBindings(ctx, false);
    for (const hob of activeHOBs) {
        if (!hob.access_point) {
            continue;
        }
        const argreementElement = new BERElement();
        argreementElement.fromBytes(hob.agreement_ber);
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
        const agreementDN: DistinguishedName = [
            ...agreement.immediateSuperior,
            agreement.rdn,
        ];
        if (!compareDistinguishedName(agreementDN, affectedDN, getNamingMatcherGetter(ctx))) {
            continue;
        }
        const bindingID = new OperationalBindingID(
            hob.binding_identifier,
            hob.binding_version,
        );
        const accessPointElement = new BERElement();
        accessPointElement.fromBytes(hob.access_point.ber);
        const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
        try {
            const subr = await dnToVertex(ctx, ctx.dit.root, agreementDN);
            if (!subr) {
                ctx.log.warn(ctx.i18n.t("log:subr_for_hob_not_found", {
                    obid: bindingID.identifier.toString(),
                    version: bindingID.version.toString(),
                }));
                continue;
            }
            assert(subr.immediateSuperior);
            const assn: Connection | null = await connect(ctx, accessPoint, dop_ip["&id"]!, {
                timeLimitInMilliseconds: options?.timeLimitInMilliseconds,
            });
            if (!assn) {
                throw new ServiceError(
                    ctx.i18n.t("err:could_not_connect"),
                    new ServiceErrorData(
                        ServiceProblem_unavailable,
                        [],
                        createSecurityParameters(
                            ctx,
                            undefined,
                            undefined,
                            serviceError["&errorCode"]
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                    ),
                );
            }
            const timeRemainingForOperation: number | undefined = timeoutTime
                ? differenceInMilliseconds(timeoutTime, new Date())
                : undefined;
            const cpInfo: Attribute[] = [];
            const subentryInfos: SubentryInfo[] = [];
            if (newCP.dse.admPoint?.accessControlScheme) {
                cpInfo.push(new Attribute(
                    accessControlScheme["&id"],
                    [
                        new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.objectIdentifier,
                            newCP.dse.admPoint.accessControlScheme,
                        ),
                    ],
                    undefined,
                ));
            }
            if (newCP.dse.admPoint?.administrativeRole) {
                cpInfo.push(new Attribute(
                    administrativeRole["&id"],
                    Array.from(newCP.dse.admPoint.administrativeRole)
                        .map((oidStr) => ObjectIdentifier.fromString(oidStr))
                        .map((oid) => new DERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.objectIdentifier,
                            oid,
                        )),
                    undefined,
                ));
            }
            if (newCP.dse.admPoint?.subentryACI) {
                cpInfo.push(new Attribute(
                    subentryACI["&id"],
                    newCP.dse.admPoint.subentryACI
                        .map((aci) => _encode_ACIItem(aci, DER)),
                    undefined,
                ));
            }
            if (newCP.dse.entryACI) {
                cpInfo.push(new Attribute(
                    entryACI["&id"],
                    newCP.dse.entryACI
                        .map((aci) => _encode_ACIItem(aci, DER)),
                    undefined,
                ));
            }
            (await readSubordinates(ctx, newCP, undefined, undefined, undefined, {
                subentry: true,
            }))
                .filter((sub) => sub.dse.subentry)
                .forEach((sub): void => {
                    subentryInfos.push(new SubentryInfo(
                        sub.dse.rdn,
                        getAttributesFromSubentry(sub),
                    ));
                });
            const myAccessPoint = ctx.dsa.accessPoint;
            const sub2sup: SubordinateToSuperior = new SubordinateToSuperior(
                [
                    new MasterOrShadowAccessPoint(
                        myAccessPoint.ae_title,
                        myAccessPoint.address,
                        myAccessPoint.protocolInformation,
                        MasterOrShadowAccessPoint_category_master, // Could not be otherwise.
                        false,
                    ),
                    /** REVIEW:
                     * ITU Recommendation X.518 (2016), Section 23.1.2, says that:
                     *
                     * > The values of the consumerKnowledge and secondaryShadows (both
                     * > held in the subordinate context prefix DSE) are used to form
                     * > additional elements in accessPoints with category having the
                     * > value shadow.
                     *
                     * But the context prefix is newly created by the operation itself,
                     * so how could it possibly have shadows at that time?
                     */
                ],
                Boolean(newCP.dse.alias),
                cpInfo,
                subentryInfos.length
                    ? subentryInfos
                    : undefined,
            );
            const newBindingID = new OperationalBindingID(
                bindingID.identifier,
                Number(bindingID.version) + 1,
            );
            const newAgreement: HierarchicalAgreement = new HierarchicalAgreement(
                newCP.dse.rdn,
                agreement.immediateSuperior,
            );
            const arg: ModifyOperationalBindingArgument = {
                unsigned: new ModifyOperationalBindingArgumentData(
                    id_op_binding_hierarchical,
                    bindingID,
                    ctx.dsa.accessPoint,
                    {
                        roleB_initiates: _encode_SubordinateToSuperior(sub2sup, DER),
                    },
                    newBindingID,
                    _encode_HierarchicalAgreement(newAgreement, DER),
                    undefined, // Validity remains the same.
                    createSecurityParameters(
                        ctx,
                        undefined,
                        modifyOperationalBinding["&operationCode"]!,
                    ),
                ),
            };
            return assn.writeOperation({
                opCode: modifyOperationalBinding["&operationCode"]!,
                argument: _encode_ModifyOperationalBindingArgument(arg, DER),
            }, {
                timeLimitInMilliseconds: timeRemainingForOperation,
            });
        } catch (e) {
            ctx.log.warn(ctx.i18n.t("log:failed_to_update_hob", {
                obid: bindingID.identifier.toString(),
                version: bindingID.version.toString(),
                e: e.message,
            }));
        }
        break;
    }
    throw new UpdateError(
        ctx.i18n.t("err:failed_to_update_superior_dsa"),
        new UpdateErrorData(
            UpdateProblem_affectsMultipleDSAs,
            undefined,
            [],
            createSecurityParameters(
                ctx,
                undefined,
                undefined,
                updateError["&errorCode"],
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            aliasDereferenced,
            undefined,
        ),
    );
}

export default updateSuperiorDSA;

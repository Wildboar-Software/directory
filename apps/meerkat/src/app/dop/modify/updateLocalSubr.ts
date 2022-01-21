import { Context, ClientConnection, OperationalBindingError } from "@wildboar/meerkat-types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import findEntry from "../../x500/findEntry";
import rdnToJson from "../../x500/rdnToJson";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import { Knowledge } from "@prisma/client";
import * as errors from "@wildboar/meerkat-types";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { OpBindingErrorParam } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_roleAssignment,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import { DER } from "asn1-ts/dist/node/functional";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import createEntry from "../../database/createEntry";
import {
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import addAttributes from "../../database/entry/addAttributes";
import removeAttribute from "../../database/entry/removeAttribute";
import checkIfNameIsAlreadyTakenInNSSR from "../../distributed/checkIfNameIsAlreadyTakenInNSSR";
import {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import {
    OpBindingErrorParam_problem_invalidAgreement,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";


export
async function updateLocalSubr (
    ctx: Context,
    conn: ClientConnection,
    invokeId: InvokeId,
    oldAgreement: HierarchicalAgreement,
    newAgreement: HierarchicalAgreement,
    sub2sup: SubordinateToSuperior,
): Promise<void> {
    // oldAgreement.immediateSuperior === newAgreement.immediateSuperior
    const superior = await findEntry(ctx, ctx.dit.root, newAgreement.immediateSuperior, false);
    if (!superior) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:no_such_superior"),
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    if (superior.dse.shadow || superior.dse.subentry || superior.dse.alias) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:parent_dse_not_permissible"),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_roleAssignment,
                    undefined,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        undefined,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }
    // const oldDN = [ ...oldAgreement.immediateSuperior, oldAgreement.rdn ];
    const oldSubordinate = await findEntry(ctx, superior, [ oldAgreement.rdn ], false);
    if (!oldSubordinate) {
        throw new Error(); // The old subordinate should have disappeared.
    }
    if (!compareRDN(oldAgreement.rdn, newAgreement.rdn, getNamingMatcherGetter(ctx))) {
        // If newAgreement.rdn is different, change the RDN of the existing entry.
        if (superior.dse.nssr) {
            const newDN = [ ...newAgreement.immediateSuperior, newAgreement.rdn ];
            try {
                await checkIfNameIsAlreadyTakenInNSSR(
                    ctx,
                    conn,
                    invokeId,
                    false,
                    superior.dse.nssr.nonSpecificKnowledge,
                    newDN,
                );
            } catch (e) {
                throw new OperationalBindingError(
                    ctx.i18n.t("err:entry_already_exists_in_nssr"),
                    {
                        unsigned: new OpBindingErrorParam(
                            OpBindingErrorParam_problem_invalidAgreement,
                            id_op_binding_non_specific_hierarchical,
                            undefined,
                            undefined,
                            [],
                            createSecurityParameters(
                                ctx,
                                conn.boundNameAndUID?.dn,
                                undefined,
                                id_err_operationalBindingError,
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            false,
                            undefined,
                        ),
                    },
                );
            }
        }
        await ctx.db.$transaction([
            ctx.db.distinguishedValue.deleteMany({
                where: {
                    entry_id: oldSubordinate.dse.id,
                },
            }),
            ctx.db.distinguishedValue.createMany({
                data: newAgreement.rdn.map((atav, i) => ({
                    entry_id: oldSubordinate.dse.id,
                    type: atav.type_.toString(),
                    value: Buffer.from(atav.value.toBytes()),
                    order_index: i,
                })),
            }),
        ]);
    }

    if (sub2sup.accessPoints) {
        await ctx.db.$transaction([
            ctx.db.accessPoint.deleteMany({
                where: {
                    entry_id: oldSubordinate.dse.id,
                    knowledge_type: Knowledge.SPECIFIC,
                },
            }),
            ...sub2sup.accessPoints
                .map((ap) => ctx.db.accessPoint.create({
                    data: {
                        knowledge_type: Knowledge.SPECIFIC,
                        ae_title: ap.ae_title.rdnSequence.map((rdn) => rdnToJson(rdn)),
                        entry_id: oldSubordinate.dse.id,
                        ber: Buffer.from(_encode_AccessPoint(ap, DER).toBytes()),
                        NSAP: {
                            createMany: {
                                data: ap.address.nAddresses.map((nsap) => {
                                    const uri = naddrToURI(nsap);
                                    if (!uri) {
                                        return {
                                            bytes: Buffer.from(nsap),
                                        };
                                    }
                                    const url = new URL(uri);
                                    return {
                                        url: url.toString(),
                                        bytes: Buffer.from(nsap),
                                        hostname: url.hostname,
                                    };
                                }),
                            },
                        },
                    },
                }))
        ]);
    }

    // NOTE: SubordinateToSuperior.alias can be ignored, because you cannot change structural object classes.

    if (sub2sup.entryInfo) {
        const deletions = (
            await Promise.all(
                sub2sup.entryInfo
                    .map((attr) => removeAttribute(ctx, oldSubordinate, attr.type_, []))
            )
        ).flat();
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: oldSubordinate.dse.id,
                },
            }),
            ...deletions,
            ...await addAttributes(ctx, oldSubordinate, sub2sup.entryInfo),
        ]);
    }

    for (const subentry of sub2sup.subentries ?? []) {
        const existingSubentry = await findEntry(ctx, oldSubordinate, [ subentry.rdn ], false);
        if (!existingSubentry) {
            await createEntry(
                ctx,
                oldSubordinate,
                subentry.rdn,
                {
                    subr: true,
                },
                subentry.info.flatMap((attr) => valuesFromAttribute(attr)),
            );
        } else {
            const deletions = (
                await Promise.all(
                    subentry.info
                        .map((attr) => removeAttribute(ctx, oldSubordinate, attr.type_))
                )
            ).flat();
            await ctx.db.$transaction([
                ctx.db.attributeValue.deleteMany({
                    where: {
                        entry_id: existingSubentry.dse.id,
                    },
                }),
                ...deletions,
                ...await addAttributes(ctx, existingSubentry, subentry.info),
            ]);
        }
    }
}

export default updateLocalSubr;

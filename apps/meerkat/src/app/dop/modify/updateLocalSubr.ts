import { ClientAssociation, OperationalBindingError } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../../ctx";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    SubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import dnToVertex from "../../dit/dnToVertex";
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
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import createEntry from "../../database/createEntry";
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
import { operationalBindingError } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import saveAccessPoint from "../../database/saveAccessPoint";
import { ASN1Construction } from "asn1-ts";

/**
 * @summary Update an update to a local subr DSE given by a subordinate DSA
 * @description
 *
 * This function takes an update given by a subordinate DSA in a hierarchical
 * operational binding and applies it, thereby updating the local subr DSE if
 * changes need to be made.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param invokeId The InvokeId of the operation used to establish the
 *  operational binding
 * @param oldAgreement The old hierarchical agreement
 * @param newAgreement The new hierarchical agreement
 * @param sub2sup The `SubordinateToSuperior` argument
 * @param signErrors Whether to cryptographically sign errors
 *
 * @function
 * @async
 */
export
async function updateLocalSubr (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    invokeId: InvokeId,
    oldAgreement: HierarchicalAgreement,
    newAgreement: HierarchicalAgreement,
    sub2sup: SubordinateToSuperior,
    signErrors: boolean,
): Promise<void> {
    // oldAgreement.immediateSuperior === newAgreement.immediateSuperior
    const superior = await dnToVertex(ctx, ctx.dit.root, newAgreement.immediateSuperior);
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
                    signErrors,
                    undefined,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    if (superior.dse.shadow || superior.dse.subentry || superior.dse.alias) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:parent_dse_not_permissible"),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_roleAssignment,
                undefined,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    operationalBindingError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    // const oldDN = [ ...oldAgreement.immediateSuperior, oldAgreement.rdn ];
    const oldSubordinate = await dnToVertex(ctx, superior, [ oldAgreement.rdn ]);
    if (!oldSubordinate) {
        // The old subordinate should not have disappeared.
        throw new Error("63c307c5-35b4-41b8-94e6-f95b1828c951"); // TODO: Different error.
    }
    if (!compareRDN(oldAgreement.rdn, newAgreement.rdn, getNamingMatcherGetter(ctx))) {
        // If newAgreement.rdn is different, change the RDN of the existing entry.
        if (superior.dse.nssr) {
            const newDN = [ ...newAgreement.immediateSuperior, newAgreement.rdn ];
            try {
                await checkIfNameIsAlreadyTakenInNSSR(
                    ctx,
                    assn,
                    invokeId,
                    false,
                    superior.dse.nssr.nonSpecificKnowledge,
                    newDN,
                );
            } catch (e) {
                throw new OperationalBindingError(
                    ctx.i18n.t("err:entry_already_exists_in_nssr"),
                    new OpBindingErrorParam(
                        OpBindingErrorParam_problem_invalidAgreement,
                        id_op_binding_non_specific_hierarchical,
                        undefined,
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            id_err_operationalBindingError,
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        false,
                        undefined,
                    ),
                    signErrors,
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
                    type_oid: atav.type_.toBytes(),
                    tag_class: atav.value.tagClass,
                    constructed: (atav.value.construction === ASN1Construction.constructed),
                    tag_number: atav.value.tagNumber,
                    content_octets: Buffer.from(
                        atav.value.value.buffer,
                        atav.value.value.byteOffset,
                        atav.value.value.byteLength,
                    ),
                    order_index: i,
                })),
            }),
        ]);
    }

    await ctx.db.accessPoint.updateMany({
        where: {
            entry_id: oldSubordinate.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
        data: {
            active: false,
        },
    });

    if (sub2sup.accessPoints) {
        await Promise.all(
            sub2sup.accessPoints
                .map((ap) => saveAccessPoint(
                    ctx, ap, Knowledge.SPECIFIC, oldSubordinate.dse.id)),
        );
        await ctx.db.accessPoint.deleteMany({
            where: {
                entry_id: oldSubordinate.dse.id,
                knowledge_type: Knowledge.SPECIFIC,
                active: false,
            },
        });
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
            ...await addAttributes(ctx, oldSubordinate, sub2sup.entryInfo, undefined, false, signErrors),
        ]);
    }

    for (const subentry of sub2sup.subentries ?? []) {
        const existingSubentry = await dnToVertex(ctx, oldSubordinate, [ subentry.rdn ]);
        if (!existingSubentry) {
            await createEntry(
                ctx,
                oldSubordinate,
                subentry.rdn,
                {
                    subentry: true,
                    rhob: true,
                },
                subentry.info.flatMap((attr) => valuesFromAttribute(attr)),
                undefined,
                signErrors,
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
                ...await addAttributes(ctx, existingSubentry, subentry.info, undefined, false, signErrors),
            ]);
        }
    }
}

export default updateLocalSubr;

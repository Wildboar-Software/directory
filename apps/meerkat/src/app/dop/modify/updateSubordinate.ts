import type { Context } from "@wildboar/meerkat-types";
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
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import addAttributes from "../../database/entry/addAttributes";
import removeAttribute from "../../database/entry/removeAttribute";

// TODO: Put this in the X.500 library.
const commonPrefix: number[] = [
    0x54, // The AFI
    0x00, 0x72, 0x87, 0x22, // The IDI
];

export
async function updateSubordinate (
    ctx: Context,
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
    // const newDN = [ ...newAgreement.immediateSuperior, newAgreement.rdn ];
    const oldSubordinate = await findEntry(ctx, superior, [ oldAgreement.rdn ], false);
    if (!oldSubordinate) {
        throw new Error(); // The old subordinate should have disappeared.
    }
    if (!compareRDN(oldAgreement.rdn, newAgreement.rdn, getNamingMatcherGetter(ctx))) {
        // If newAgreement.rdn is different, change the RDN of the existing entry.
        if (superior.dse.nssr) {
            // TODO: Follow procedures in clause 19.1.5.
        }
        await ctx.db.$transaction([
            ctx.db.rDN.deleteMany({
                where: {
                    entry_id: oldSubordinate.dse.id,
                },
            }),
            ctx.db.rDN.createMany({
                data: newAgreement.rdn.map((atav) => ({
                    entry_id: oldSubordinate.dse.id,
                    type: atav.type_.toString(),
                    value: Buffer.from(atav.value.toBytes()),
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
                                    const url: string | undefined = ((): string | undefined => {
                                        if (nsap[0] !== 0xFF) { // It is not a URL.
                                            return undefined;
                                        }
                                        try {
                                            const [ , uri ] = uriFromNSAP(nsap);
                                            return uri;
                                        } catch {
                                            return undefined;
                                        }
                                    })();
                                    const ip_and_port = ((): [ string, number | undefined ] | undefined => {
                                        if (nsap[0] !== 0xFF) { // It is not a URL.
                                            return undefined;
                                        }
                                        for (let i = 0; i < commonPrefix.length; i++) {
                                            if (nsap[i] !== commonPrefix[i]) {
                                                return undefined;
                                            }
                                        }
                                        const [ , ip, port ] = ipv4FromNSAP(nsap);
                                        return [ Array.from(ip).join("."), port ];
                                    })();
                                    return {
                                        ipv4: ip_and_port
                                            ? ip_and_port[0]
                                            : undefined,
                                        tcp_port: ip_and_port
                                            ? ip_and_port[1]
                                            : undefined,
                                        url,
                                        bytes: Buffer.from(nsap),
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
            ...await addAttributes(ctx, oldSubordinate, sub2sup.entryInfo, []), // FIXME: modifiersName
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
                [], // FIXME: modifiersName
            );
        } else {
            const deletions = (
                await Promise.all(
                    subentry.info
                        .map((attr) => removeAttribute(ctx, oldSubordinate, attr.type_, []))
                )
            ).flat();
            await ctx.db.$transaction([
                ctx.db.attributeValue.deleteMany({
                    where: {
                        entry_id: existingSubentry.dse.id,
                    },
                }),
                ...deletions,
                ...await addAttributes(ctx, existingSubentry, subentry.info, []), // FIXME: modifiersName
            ]);
        }
    }
}

export default updateSubordinate;

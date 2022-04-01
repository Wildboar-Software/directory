import type {
    Context,
    Vertex,
    Value,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "@wildboar/meerkat-types";
import NOOP from "./NOOP";
import { BERElement } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import { namingContexts } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/namingContexts.oa";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    NonSpecificHierarchicalAgreement,
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import isFirstLevelDSA from "../../dit/isFirstLevelDSA";
import { Prisma } from "@prisma/client";

const HOB: string = id_op_binding_hierarchical.toString();
const NHOB: string = id_op_binding_non_specific_hierarchical.toString();

function getWhere (): Prisma.OperationalBindingWhereInput {
    const now = new Date();
    // This where clause was pretty much ripped from `getRelevantOperationalBindings()`.
    return {
        /**
         * This is a hack for getting the latest version: we are selecting
         * operational bindings that have no next version.
         */
        next_version: {
            none: {},
        },
        binding_type: {
            in: [
                HOB,
                NHOB,
            ],
        },
        accepted: true,
        terminated_time: null,
        validity_start: {
            lte: now,
        },
        AND: [
            {
                OR: [
                    { // Local DSA initiated role A (meaning local DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: false,
                    },
                    { // Remote DSA initiated role B (meaning local DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: true,
                    },
                ],
            },
            {
                OR: [
                    {
                        validity_end: null,
                    },
                    {
                        validity_end: {
                            gte: now,
                        },
                    },
                ],
            },
        ],
    };
}

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    const obs = await ctx.db.operationalBinding.findMany({
        where: getWhere(),
        select: {
            agreement_ber: true,
        },
    });

    const firstLevel = await isFirstLevelDSA(ctx);

    return [
            ...(firstLevel // If this is a first-level DSA, we still need to return an empty namingContext.
                ? [
                    {
                        type: namingContexts["&id"],
                        value: namingContexts.encoderFor["&Type"]!([], DER),
                    },
                ]
                : []),
            ...obs.map((ob): Value => {
                const argreementElement = new BERElement();
                argreementElement.fromBytes(ob.agreement_ber);
                const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
                return {
                    type: namingContexts["&id"],
                    value: namingContexts.encoderFor["&Type"]!([ ...agreement.immediateSuperior, agreement.rdn ], DER),
                };
            }),
        ];
};

export
const addValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return 0;
    }
    return ctx.db.operationalBinding.count({
        where: getWhere(),
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    return !!(await ctx.db.operationalBinding.findFirst({
        where: getWhere(),
        select: {
            id: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    const obs = await ctx.db.operationalBinding.findMany({
        where: getWhere(),
        select: {
            binding_type: true,
            agreement_ber: true,
        },
    });
    const assertedDN = namingContexts.decoderFor["&Type"]!(value.value);
    return obs.some((ob): boolean => {
        const argreementElement = new BERElement();
        argreementElement.fromBytes(ob.agreement_ber);
        if (ob.binding_type === HOB) {
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            const existingDN = [ ...agreement.immediateSuperior, agreement.rdn ];
            return compareDistinguishedName(existingDN, assertedDN, getNamingMatcherGetter(ctx));
        } else if (ob.binding_type === NHOB) {
            const agreement: NonSpecificHierarchicalAgreement = _decode_NonSpecificHierarchicalAgreement(argreementElement);
            const existingDN = [ ...agreement.immediateSuperior ];
            return compareDistinguishedName(existingDN, assertedDN, getNamingMatcherGetter(ctx));
        } else {
            return false;
        }
    });
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
};

export default driver;

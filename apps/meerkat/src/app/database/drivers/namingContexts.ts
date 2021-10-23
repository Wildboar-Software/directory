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
import { namingContexts } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/namingContexts.oa";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getEqualityMatcherGetter from "../../x500/getEqualityMatcherGetter";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    const now = new Date();
    const obs = await ctx.db.operationalBinding.findMany({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role B (meaning local DSA is subordinate.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: true,
                },
                { // Remote DSA initiated role A (meaning local DSA is subordinate again.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: false,
                },
            ],
        },
        select: {
            agreement_ber: true,
        },
    });
    return [
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
    const now = new Date();
    return ctx.db.operationalBinding.count({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role B (meaning local DSA is subordinate.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: true,
                },
                { // Remote DSA initiated role A (meaning local DSA is subordinate again.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: false,
                },
            ],
        },
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
    const now = new Date();
    return !!(await ctx.db.operationalBinding.findFirst({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role B (meaning local DSA is subordinate.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: true,
                },
                { // Remote DSA initiated role A (meaning local DSA is subordinate again.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: false,
                },
            ],
        },
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
    const now = new Date();
    const obs = await ctx.db.operationalBinding.findMany({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role B (meaning local DSA is subordinate.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: true,
                },
                { // Remote DSA initiated role A (meaning local DSA is subordinate again.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: false,
                },
            ],
        },
        select: {
            agreement_ber: true,
        },
    });
    const assertedDN = namingContexts.decoderFor["&Type"]!(value.value);
    return obs.some((ob): boolean => {
        const argreementElement = new BERElement();
        argreementElement.fromBytes(ob.agreement_ber);
        const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
        const existingDN = [ ...agreement.immediateSuperior, agreement.rdn ];
        return compareDistinguishedName(existingDN, assertedDN, getEqualityMatcherGetter(ctx));
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

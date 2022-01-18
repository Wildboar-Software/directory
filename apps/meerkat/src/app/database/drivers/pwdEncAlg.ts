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
import {
    BERElement,
    ObjectIdentifier,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    pwdEncAlg,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import getScryptAlgorithmIdentifier from "../../x500/getScryptAlgorithmIdentifier";
import NOOP from "./NOOP";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";

const ID_PWD_SUBENTRY: string = pwdAdminSubentry["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(ID_PWD_SUBENTRY)) {
        return [];
    }
    if (vertex.dse.shadow) {
        const result = await ctx.db.passwordEncryptionAlgorithm.findUnique({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                oid: true,
                parameters: true,
            },
        });
        if (!result) {
            return [];
        }
        const algid = new AlgorithmIdentifier(
            ObjectIdentifier.fromString(result.oid),
            result.parameters
                ? (() => {
                    const el = new BERElement();
                    el.fromBytes(result.parameters);
                    return el;
                })()
                : undefined,
        );
        return result
            ? [
                {
                    type: pwdEncAlg["&id"],
                    value: _encode_AlgorithmIdentifier(algid, DER),
                },
            ]
            : [];
    }
    return [
        {
            type: pwdEncAlg["&id"],
            value: _encode_AlgorithmIdentifier(getScryptAlgorithmIdentifier(), DER),
        },
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
    if (!vertex.dse.subentry) {
        return 0;
    }
    if (vertex.dse.shadow) {
        return ctx.db.passwordEncryptionAlgorithm.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    return (vertex.dse.subentry && vertex.dse.objectClass.has(ID_PWD_SUBENTRY))
        ? 1
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.passwordEncryptionAlgorithm.findFirst({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                id: true,
            },
        }));
    }
    return !!(vertex.dse.subentry && vertex.dse.objectClass.has(ID_PWD_SUBENTRY));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.subentry) {
        return false;
    }
    if (vertex.dse.shadow) {
        return !!(await ctx.db.passwordEncryptionAlgorithm.findFirst({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                id: true,
            },
        }));
    }
    if (!(vertex.dse.subentry && vertex.dse.objectClass.has(ID_PWD_SUBENTRY))) {
        return false;
    }
    const ALGORITHM_USED_BY_MEERKAT_DSA = getScryptAlgorithmIdentifier();
    const decoded = _decode_AlgorithmIdentifier(value.value);
    if (!decoded.algorithm) {
        return false;
    }
    return Boolean(
        decoded.algorithm.isEqualTo(ALGORITHM_USED_BY_MEERKAT_DSA.algorithm)
        && (decoded.parameters && ALGORITHM_USED_BY_MEERKAT_DSA.parameters)
        && (decoded.parameters.length === ALGORITHM_USED_BY_MEERKAT_DSA.parameters.length)
        && !Buffer.compare(decoded.parameters.toBytes(), ALGORITHM_USED_BY_MEERKAT_DSA.parameters.toBytes())
    );
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

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
    DERElement,
    BERElement,
} from "asn1-ts";
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    userPwdHistory,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
import NOOP from "./NOOP";
import { subSeconds } from "date-fns";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return (await ctx.db.passwordHistory.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            time: true,
            password: true,
        },
    }))
        .map((row) => {
            const passwordElement = new BERElement();
            passwordElement.fromBytes(row.password);
            return {
                type: userPwdHistory["&id"],
                value: DERElement.fromSequence([
                    _encodeGeneralizedTime(row.time, DER),
                    passwordElement,
                ]),
            };
        });
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
    return ctx.db.passwordHistory.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.passwordHistory.findFirst({
        where: {
            entry_id: vertex.dse.id,
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
    const seq = value.value.sequence;
    if (seq.length < 2) {
        return false;
    }
    return !!(await ctx.db.passwordHistory.findFirst({
        where: {
            entry_id: vertex.dse.id,
            password: Buffer.from(seq[1].toBytes()),
            time: {
                gte: subSeconds(seq[0].generalizedTime, 30),
            },
        },
        select: {
            id: true,
        },
    }));
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

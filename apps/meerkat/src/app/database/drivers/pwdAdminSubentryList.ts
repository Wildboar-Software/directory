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
import NOOP from "./NOOP.js";
import { DER } from "@wildboar/asn1/functional";
import {
    pwdAdminSubentryList,
} from "@wildboar/x500/InformationFramework";
import getDistinguishedName from "../../x500/getDistinguishedName.js";
import {
    id_sc_pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";

const SUBENTRY_CLASS: string = id_sc_pwdAdminSubentry.toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.subentry && sub.dse.objectClass.has(SUBENTRY_CLASS))
        .map(getDistinguishedName)
        .map((dn) => ({
            type: pwdAdminSubentryList["&id"],
            value: _encode_DistinguishedName(dn, DER),
        })) ?? [];
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
    relevantSubentries?: Vertex[],
): Promise<number> => {
    const count: number = relevantSubentries
        ?.filter((sub) => sub.dse.subentry && sub.dse.objectClass.has(SUBENTRY_CLASS)).length ?? 0;
    return count;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    entry: Vertex,
    relevantSubentries?: Vertex[],
): Promise<boolean> => {
    const count: number = relevantSubentries
        ?.filter((sub) => sub.dse.subentry && sub.dse.objectClass.has(SUBENTRY_CLASS)).length ?? 0;
    return (count > 0);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    relevantSubentries?: Vertex[],
): Promise<boolean> => {
    const sought = _decode_DistinguishedName(value.value);
    return relevantSubentries
        ?.filter((sub) => sub.dse.subentry && sub.dse.objectClass.has(SUBENTRY_CLASS))
        .map(getDistinguishedName)
        .some((dn) => compareDistinguishedName(
            dn,
            sought,
            getNamingMatcherGetter(ctx),
        )) ?? false;
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

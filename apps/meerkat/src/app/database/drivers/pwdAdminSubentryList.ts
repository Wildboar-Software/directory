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
import { DER } from "asn1-ts/dist/node/functional";
import {
    pwdAdminSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentryList.oa";
import getDistinguishedName from "../../x500/getDistinguishedName";
import {
    id_sc_pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-pwdAdminSubentry.va";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";

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

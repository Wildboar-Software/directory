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
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";
import { getDistinguishedName } from "../../x500/getDistinguishedName";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import { compareDistinguishedName } from "@wildboar/x500";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const dn = getDistinguishedName(vertex);
    return [
        {
            type: entryDN["&id"],
            value: _encode_DistinguishedName(dn, DER),
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
const countValues: SpecialAttributeCounter = async (): Promise<number> => {
    return 1;
};

export
const isPresent: SpecialAttributeDetector = async (): Promise<boolean> => {
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const asserted = _decode_DistinguishedName(value.value);
    const present = getDistinguishedName(vertex);
    const namingMatcher = getNamingMatcherGetter(ctx);
    return compareDistinguishedName(asserted, present, namingMatcher);
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

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
import { namingContexts } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/namingContexts.oa";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import isFirstLevelDSA from "../../dit/isFirstLevelDSA";


export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }

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
            ...ctx.dsa.namingContexts.map((dn): Value => {
                return {
                    type: namingContexts["&id"],
                    value: namingContexts.encoderFor["&Type"]!(dn, DER),
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
    const firstLevel = await isFirstLevelDSA(ctx);
    return (ctx.dsa.namingContexts.length + (firstLevel ? 1 : 0));
}

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    // Theoretically, a DSA could have no naming contexts by having no data at
    // all, but we're just going to hack this a little.
    return true;
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
    const namingMatcher = getNamingMatcherGetter(ctx);
    const assertedDN = namingContexts.decoderFor["&Type"]!(value.value);
    return ctx.dsa.namingContexts
        .some((dn) => compareDistinguishedName(assertedDN, dn, namingMatcher));
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

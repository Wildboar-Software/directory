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
import { directoryStringToString } from "@wildboar/x500";
import {
    fullVendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/fullVendorVersion.oa";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";

const PRODUCT_NAME: string = "Meerkat DSA";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.root) {
        return [];
    }

    if (
        (ctx.config.vendorVersion?.length === 0)
        || (ctx.config.vendorName?.length === 0)
    ) {
        return []; // Vendor version is disabled.
    }

    const vversion = ctx.config.vendorVersion
        ?? (ctx.dsa.version
            ? `${PRODUCT_NAME}, ${ctx.dsa.version}`
            : PRODUCT_NAME);
    return [
        {
            type: fullVendorVersion["&id"],
            value: fullVendorVersion.encoderFor["&Type"]!({ uTF8String: vversion }, DER),
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
    return vertex.dse.root ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!vertex.dse.root;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (
        (ctx.config.vendorVersion?.length === 0)
        || (ctx.config.vendorName?.length === 0)
    ) {
        return false; // Vendor version is disabled.
    }
    const asserted: string = directoryStringToString(_decode_UnboundedDirectoryString(value.value));
    const vversion = ctx.config.vendorVersion
        ?? (ctx.dsa.version
            ? `${PRODUCT_NAME}, ${ctx.dsa.version}`
            : PRODUCT_NAME);
    return (asserted.toUpperCase() === vversion.toUpperCase());
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

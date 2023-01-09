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
    vendorName,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorName.oa";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";

const VENDOR_NAME: string = "Wildboar Software";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.root) {
        return [];
    }
    if (ctx.config.vendorName?.length === 0) {
        return [];
    }
    const vname: string = ctx.config.vendorName ?? VENDOR_NAME;
    return [
        {
            type: vendorName["&id"],
            value: vendorName.encoderFor["&Type"]!({ uTF8String: vname }, DER),
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
    const asserted: string = directoryStringToString(_decode_UnboundedDirectoryString(value.value));
    const vname: string = ctx.config.vendorName ?? VENDOR_NAME;
    return (asserted.toUpperCase() === vname.toUpperCase());
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

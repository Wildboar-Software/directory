import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import readValues from "../database/entry/readValues";

async function readValuesOfType (
    ctx: Context,
    vertex: Vertex,
    type_: OBJECT_IDENTIFIER,
): Promise<Value[]> {
    const eis = new EntryInformationSelection(
        {
            select: [ type_ ],
        },
        undefined,
        {
            select: [ type_ ],
        },
    );
    const {
        userValues: userAttributes,
        operationalValues: operationalAttributes,
    } = await readValues(ctx, vertex, {
        selection: eis,
    });
    return [
        ...userAttributes,
        ...operationalAttributes,
    ];
}

export default readValuesOfType;

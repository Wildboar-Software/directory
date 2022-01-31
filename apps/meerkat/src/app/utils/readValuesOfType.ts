import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import readValues from "../database/entry/readValues";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";

async function readValuesOfType (
    ctx: Context,
    vertex: Vertex,
    type_: OBJECT_IDENTIFIER,
): Promise<Value[]> {
    const spec = ctx.attributeTypes.get(type_.toString());
    // Checking for this saves us one whole database round-trip.
    const isUser = ((spec?.usage ?? AttributeUsage_userApplications) === AttributeUsage_userApplications);
    const eis = new EntryInformationSelection(
        isUser
            ? {
                select: [ type_ ],
            }
            : {
                select: [],
            },
        undefined,
        isUser
            ? undefined
            : {
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

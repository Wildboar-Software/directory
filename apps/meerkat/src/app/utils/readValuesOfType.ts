import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import readValues from "../database/entry/readValues";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";

/**
 * @summary Read all values of a given type from a DSE
 * @description
 *
 * This function reads all values of a given attribute type from a DSE.
 *
 * @param ctx The context object
 * @param vertex The DSE whose values are to be read
 * @param type_ The attribute type whose values are to be read
 * @returns An array of values of the specified attribute type
 *
 * @function
 * @async
 */
export
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
        dontSelectFriends: true,
        noSubtypeSelection: true,
    });
    return [
        ...userAttributes,
        ...operationalAttributes,
    ];
}

export default readValuesOfType;

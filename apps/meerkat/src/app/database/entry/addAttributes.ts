import type {
    Context,
    Vertex,
} from "@wildboar/meerkat-types";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import addValues from "./addValues";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import valuesFromAttribute from "../../x500/valuesFromAttribute";

/**
 * @summary Add attributes to an entry.
 * @description
 *
 * Resolves an array of `PrismaPromise`s, which can be `await`ed or `.then()`'d
 * independently or within a Prisma transaction. These promises together will
 * execute the database queries to add the attibutes to the entry.
 *
 * @param ctx The context object
 * @param entry The vertex to which attributes are to be added
 * @param attributes The attributes to be added to the entry
 * @param modifier The modifier of the entry
 * @param checkForExisting Whether to check whether the values already exist and
 *  throw an error if so
 * @returns An array of `PrismaPromise`s that will effectively add those
 *  attributes to the entry
 *
 * @function
 * @async
 */
export
async function addAttributes (
    ctx: Context,
    entry: Vertex,
    attributes: Attribute[],
    modifier?: DistinguishedName,
    checkForExisting: boolean = true,
    signErrors: boolean = false,
): Promise<PrismaPromise<any>[]> {
    return addValues(
        ctx,
        entry,
        attributes.flatMap(valuesFromAttribute),
        modifier,
        checkForExisting,
        signErrors,
    );
}

export default addAttributes;

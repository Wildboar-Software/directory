import type {
    Context,
    Vertex,
} from "@wildboar/meerkat-types";
import type { PrismaPromise, Prisma } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import addValues from "./addValues";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import valuesFromAttribute from "../../x500/valuesFromAttribute";

export
async function addAttributes (
    ctx: Context,
    entry: Vertex,
    attributes: Attribute[],
    modifier: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    return addValues(ctx, entry, attributes.flatMap(valuesFromAttribute), modifier);
}

export default addAttributes;

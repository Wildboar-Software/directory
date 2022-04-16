import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import * as x500nf from "@wildboar/x500/src/lib/collections/nameForms";
import nameFormFromInformationObject from "./nameFormFromInformationObject";

/**
 * @summary Initialize Meerkat DSA's internal index of known name forms.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known name forms.
 *
 * @param ctx The context object
 *
 * @function
 */
export
async function loadNameForms (ctx: Context): Promise<void> {
    const nameFormInfoObjects = {
        ...x500nf,
    };
    Object.entries(nameFormInfoObjects)
        .map(([ name, io ]) => nameFormFromInformationObject(io, io["&ldapName"] ?? [ name ]))
        .forEach((nf) => {
            ctx.nameForms.set(nf.id.toString(), nf);
        });
    const nameForms = await ctx.db.nameForm.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const nameForm of nameForms) {
        ctx.nameForms.set(nameForm.identifier, {
            id: ObjectIdentifier.fromString(nameForm.identifier),
            name: nameForm.name?.split("|"),
            description: nameForm.description ?? undefined,
            obsolete: nameForm.obsolete,
            namedObjectClass: ObjectIdentifier.fromString(nameForm.namedObjectClass),
            mandatoryAttributes: nameForm.mandatoryAttributes
                .split(" ")
                .map(ObjectIdentifier.fromString),
            optionalAttributes: nameForm.optionalAttributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString) ?? [],
        });
    }
}

export default loadNameForms;

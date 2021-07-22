import type { Context } from "../types";
// import type { ASN1Element } from "asn1-ts";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
// import type {
//     DistinguishedName,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
// import {
//     AttributeTypeAndValue,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
// import {
//     id_ar_autonomousArea,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
// import rdnSequenceFromString from "@wildboar/ldap/src/lib/destringifiers/RDNSequence";
// import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
// import rdnToJson from "../x500/rdnToJson";
// import { strict as assert } from "assert";

const ROOT_DSE_NAME = [];

/**
 * This is a **really** handy diagram for clarifying what a DIT might look like:
 * http://sec.cs.kent.ac.uk/x500book/Chapter.2/fig2-10.gif
 */
export
async function initDIT (
    ctx: Context,
    name: string,
): Promise<void> {
    const aapDN = process.env.AAP;
    if (!aapDN || (aapDN.trim().length === 0)) {
        throw new Error("Environment variable AAP is required and must be set to a valid distinguished name.");
    }

    const dit = await ctx.db.dIT.create({
        data: {
            uuid: ctx.dit.uuid,
            name,
        },
    });
    ctx.log.warn(`Created DIT '${name}'.`);
    const now = new Date();
    const rootDSE = await ctx.db.entry.create({
        data: {
            rdn: [],
            root: true,
            glue: false,
            cp: false,
            entry: false,
            alias: false,
            subr: false,
            nssr: false,
            supr: false,
            xr: false,
            admPoint: false,
            subentry: false,
            shadow: false,
            immSupr: false,
            rhob: false,
            sa: false,
            dsSubentry: false,
            familyMember: false,
            ditBridge: false,
            writeableCopy: false,
            createdTimestamp: now,
            modifyTimestamp: now,
            // deleteTimestamp
            creatorsName: ROOT_DSE_NAME,
            modifiersName: ROOT_DSE_NAME,
            // hierarchyLevel
            // hierarchyBelow
            // hierarchyParent
            // hierarchyTop
            structuralObjectClass: top["&id"].toString(),
            // accessControlScheme
            // entryUUID
            objectClass: top["&id"].toString(),
            // administrativeRole
            dit_id: dit.id,
            // immediate_superior
        },
    });
    ctx.log.warn(`Created Root DSE ${rootDSE.entryUUID}.`);

    // const autonomousAdministrativePointName: DistinguishedName = Array.from(rdnSequenceFromString(
    //     aapDN,
    //     (syntax: string) => {
    //         const desc = normalizeAttributeDescription(Buffer.from(syntax));
    //         const attrSpec = ctx.attributes.get(desc);
    //         if (!attrSpec?.ldapSyntax) {
    //             return undefined;
    //         }
    //         const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
    //         if (!ldapSyntax?.decoder) {
    //             return undefined;
    //         }
    //         const decoder = ldapSyntax?.decoder;
    //         return [
    //             attrSpec.id,
    //             (value: string): ASN1Element => decoder(Buffer.from(value, "utf-8")),
    //         ];
    //     },
    // ))
    //     .map((rdn) => rdn.map((atav) => new AttributeTypeAndValue(
    //         atav[0],
    //         atav[1],
    //     )));

    // const glueData = {
    //     dit_id: dit.id,
    //     glue: true,
    //     creatorsName: ROOT_DSE_NAME,
    //     modifiersName: ROOT_DSE_NAME,
    //     is_family_parent: false,
    //     is_family_child: false,
    //     structuralObjectClass: top["&id"].toString(),
    //     objectClass: top["&id"].toString(),
    // };
    // let immediate_superior_id: number = rootDSE.id;
    // for (const aapRDN of autonomousAdministrativePointName.reverse().slice(1)) {
    //     // Create glue entries
    //     const createdEntry = await ctx.db.entry.create({
    //         data: {
    //             ...glueData,
    //             immediate_superior_id,
    //             rdn: rdnToJson(aapRDN),
    //         },
    //     });
    //     immediate_superior_id = createdEntry.id;
    //     ctx.log.debug(`Created glue entry ${createdEntry.entryUUID} as part of initialization.`);
    // }

    // const administrativeRDN = autonomousAdministrativePointName[0];
    // assert(administrativeRDN);
    // const createdEntry = await ctx.db.entry.create({
    //     data: {
    //         immediate_superior_id,
    //         rdn: rdnToJson(administrativeRDN),
    //         dit_id: dit.id,
    //         admPoint: true,
    //         creatorsName: ROOT_DSE_NAME,
    //         modifiersName: ROOT_DSE_NAME,
    //         is_family_parent: false,
    //         is_family_child: false,
    //         structuralObjectClass: top["&id"].toString(),
    //         objectClass: top["&id"].toString(),
    //         administrativeRole: id_ar_autonomousArea.toString(),
    //     },
    // });

//     - [ ] Read `SUPERIOR_KNOWLEDGE` environment variable and create the operational attributes on the AAP
//   - [ ] Create subentries under the AAP
//   - [ ] Create temporary admin user entry under the AAP
//   - [ ] Create temporary admin user password (Randomly generate, rather than environment variables)

}

export default initDIT;

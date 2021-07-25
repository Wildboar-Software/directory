import type { Context, Vertex } from "../types";
import { Controller, Get, Render, Inject, Param, NotFoundException } from "@nestjs/common";
import rdnToString from "@wildboar/ldap/src/lib/stringifiers/RelativeDistinguishedName";
import type StringEncoderGetter from "@wildboar/ldap/src/lib/types/StringEncoderGetter";
import type StringEncoder from "@wildboar/ldap/src/lib/types/StringEncoder";
import type { OBJECT_IDENTIFIER, ASN1Element } from "asn1-ts";
import type {
    RelativeDistinguishedName
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import { id_ar_accessControlSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import { id_ar_accessControlInnerArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import { id_ar_subschemaAdminSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import { id_ar_collectiveAttributeSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import { id_ar_collectiveAttributeInnerArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeInnerArea.va";
import { id_ar_contextDefaultSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-contextDefaultSpecificArea.va";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-serviceSpecificArea.va";
import { id_ar_pwdAdminSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-pwdAdminSpecificArea.va";
import { id_sc_accessControlSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-accessControlSubentry.va";
import { id_sc_collectiveAttributeSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-collectiveAttributeSubentry.va";
import { id_sc_contextAssertionSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-contextAssertionSubentry.va";
import { id_sc_serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-serviceAdminSubentry.va";
import { id_sc_pwdAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-pwdAdminSubentry.va";
import { id_oc_parent } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import { id_oc_child } from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import rdnFromJson from "../x500/rdnFromJson";
import entryFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import readEntryAttributes from "../database/readEntryAttributes";
import escape from "escape-html";

const autonomousArea: string = id_ar_autonomousArea.toString();
const accessControlSpecificArea: string = id_ar_accessControlSpecificArea.toString();
const accessControlInnerArea: string = id_ar_accessControlInnerArea.toString();
const subschemaAdminSpecificArea: string = id_ar_subschemaAdminSpecificArea.toString();
const collectiveAttributeSpecificArea: string = id_ar_collectiveAttributeSpecificArea.toString();
const collectiveAttributeInnerArea: string = id_ar_collectiveAttributeInnerArea.toString();
const contextDefaultSpecificArea: string = id_ar_contextDefaultSpecificArea.toString();
const serviceSpecificArea: string = id_ar_serviceSpecificArea.toString();
const pwdAdminSpecificArea: string = id_ar_pwdAdminSpecificArea.toString();

const accessControlSubentry: string = id_sc_accessControlSubentry.toString();
const collectiveAttributeSubentry: string = id_sc_collectiveAttributeSubentry.toString();
const contextAssertionSubentry: string = id_sc_contextAssertionSubentry.toString();
const serviceAdminSubentry: string = id_sc_serviceAdminSubentry.toString();
const pwdAdminSubentry: string = id_sc_pwdAdminSubentry.toString();


const parent: string = id_oc_parent.toString();
const child: string = id_oc_child.toString();

function encodeRDN (ctx: Context, rdn: RelativeDistinguishedName): string {
    const stringEncoderGetter: StringEncoderGetter = (syntax: OBJECT_IDENTIFIER): StringEncoder | undefined => {
        const attrSpec = ctx.attributes.get(syntax.toString());
        if (!attrSpec?.ldapSyntax) {
            return undefined;
        }
        const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
        if (!ldapSyntax?.encoder) {
            return undefined;
        }
        const encoder = ldapSyntax.encoder;
        return (value: ASN1Element): string => {
            return Buffer.from(encoder(value)).toString("utf-8");
        };
    };

    const typeNameGetter = (type: OBJECT_IDENTIFIER): string | undefined => {
        const attrSpec = ctx.attributes.get(type.toString());
        if (!attrSpec?.ldapNames || (attrSpec.ldapNames.length === 0)) {
            return undefined;
        }
        return attrSpec.ldapNames[0];
    };
    return rdnToString(
        rdn.map((atav) => [ atav.type_, atav.value ]),
        stringEncoderGetter,
        typeNameGetter,
    );
}

function printFlags (vertex: Vertex): string {
    let ret: string = "(";
    const dse = vertex.dse;
    if (dse.root) {
        ret += "🏠";
    }
    if (dse.glue) {
        ret += "🔗";
    }
    if (dse.cp) {
        ret += "📌";
    }
    if (dse.entry) {
        ret += "♟";
    }
    if (dse.alias) {
        ret += "@";
    }
    if (dse.subr) {
        ret += "👇";
    }
    if (dse.nssr) {
        ret += "?";
    }
    if (dse.supr) {
        ret += "🌙";
    }
    if (dse.xr) {
        ret += "👉";
    }
    if (dse.admPoint) {
        ret += "⚙️";
        const ar = dse.admPoint.administrativeRole;
        if (ar.has(autonomousArea)) {
            ret += "👑";
        }
        if (ar.has(accessControlSpecificArea)) {
            ret += "⚖️";
        }
        if (ar.has(accessControlInnerArea)) {
            ret += "⚖️";
        }
        if (ar.has(subschemaAdminSpecificArea)) {
            ret += "📐";
        }
        if (ar.has(collectiveAttributeSpecificArea)) {
            ret += "🌐";
        }
        if (ar.has(collectiveAttributeInnerArea)) {
            ret += "🌐";
        }
        if (ar.has(contextDefaultSpecificArea)) {
            ret += "🎯";
        }
        if (ar.has(serviceSpecificArea)) {
            ret += "🔍";
        }
        if (ar.has(pwdAdminSpecificArea)) {
            ret += "🔒";
        }
    }
    if (dse.subentry) {
        ret += "🧠";
    }
    if (dse.shadow) {
        ret += "👥";
    }
    if (dse.immSupr) {
        ret += "👆";
    }
    if (dse.rhob) {
        ret += "🚦";
    }
    if (dse.sa) {
        ret += "👋";
    }
    if (dse.dsSubentry) {
        ret += "🛠";
    }
    if (dse.familyMember) {
        ret += "👨‍👩‍👦‍👦";
    }
    if (dse.ditBridge) {
        ret += "📡";
    }
    if (dse.objectClass.has(accessControlSubentry)) {
        ret += "⚖️";
    }
    if (dse.objectClass.has(collectiveAttributeSubentry)) {
        ret += "🌐";
    }
    if (dse.objectClass.has(contextAssertionSubentry)) {
        ret += "🎯";
    }
    if (dse.objectClass.has(serviceAdminSubentry)) {
        ret += "🔍";
    }
    if (dse.objectClass.has(pwdAdminSubentry)) {
        ret += "🔒";
    }
    if (dse.objectClass.has(parent)) {
        ret += "👨‍👧";
    }
    if (dse.objectClass.has(child)) {
        ret += "👶";
    }
    ret += ")";
    return ret;
}

async function convertVertexToHTML (ctx: Context, vertex: Vertex): Promise<string> {
    const stringifiedRDN = (vertex.dse.rdn.length === 0)
        ? "(Empty RDN)"
        : escape(encodeRDN(ctx, vertex.dse.rdn));

    const subordinates = await Promise.all(
        vertex.subordinates?.map((sub) => convertVertexToHTML(ctx, sub)) ?? [],
    );

    return (
        "<li>"
        + "<span>"
        + `<a href="/dit/dse/${vertex.dse.uuid}">${stringifiedRDN}</a>`
        + printFlags(vertex)
        + "</span>"
        + "<ul>"
        + subordinates.join("")
        + "</ul>"
        + "</li>"
    );
}

function hexEncode (value: ASN1Element): string {
    return `#${Buffer.from(value.toBytes()).toString("hex")}`;
}

@Controller()
export class DitController {

    constructor (
        @Inject("CONTEXT") readonly ctx: Context,
    ) {}

    @Get("/dit/tree")
    @Render('tree')
    async tree () {
        return {
            tree: await convertVertexToHTML(this.ctx, this.ctx.dit.root),
        };
    }

    @Get("/dit/dse/:id")
    @Render("dit_dse_id")
    async dse_id (
        @Param("id") id: string,
    ) {
        const entry = await this.ctx.db.entry.findUnique({
            where: {
                entryUUID: id,
            },
        });
        if (!entry) {
            throw new NotFoundException();
        }
        const superior = entry.immediate_superior_id
            ? await this.ctx.db.entry.findUnique({
                where: {
                    id: entry.immediate_superior_id,
                },
            })
            : undefined;
        const superiorUUID: string | undefined = superior?.entryUUID;
        const rdn = rdnFromJson(entry.rdn as Record<string, string>);
        const vertex = await entryFromDatabaseEntry(this.ctx, undefined, entry, true);
        const {
            userAttributes,
            operationalAttributes,
        } = await readEntryAttributes(this.ctx, vertex, {
            includeOperationalAttributes: true,
            returnContexts: true,
        });
        const attributes: [ string, string, string ][] = [
            ...userAttributes,
            ...operationalAttributes,
        ]
            .map((attr) => [
                ((): string => {
                    const spec = this.ctx.attributes.get(attr.id.toString());
                    return spec?.ldapNames?.[0] ?? attr.id.toString();
                })(),
                ((): string => {
                    const spec = this.ctx.attributes.get(attr.id.toString());
                    if (!spec?.ldapSyntax) {
                        return hexEncode(attr.value);
                    }
                    const ldapSyntax = this.ctx.ldapSyntaxes.get(spec?.ldapSyntax.toString());
                    if (!ldapSyntax?.encoder) {
                        return hexEncode(attr.value);
                    }
                    const encoder = ldapSyntax.encoder;
                    return Buffer.from(encoder(attr.value)).toString("utf-8");
                })(),
                Array.from(attr.contexts.values())
                    .map((context) => context.id.toString())
                    .join(", "),
            ]);

        return {
            ...entry,
            superiorUUID,
            rdn: (rdn.length === 0)
                ? "(Empty RDN)"
                : escape(encodeRDN(this.ctx, rdn)),
            flags: printFlags(vertex),
            objectClasses: entry.objectClass.map((oc) => ({
                oid: oc,
                name: this.ctx.objectClasses.get(oc)?.ldapNames?.[0],
            })),
            createdTimestamp: entry.createdTimestamp.toISOString(),
            modifyTimestamp: entry.modifyTimestamp.toISOString(),
            deleteTimestamp: entry.deleteTimestamp?.toISOString(),
            creatorsName: (vertex.dse.creatorsName?.rdnSequence ?? [])
                .map((rdn) => escape(encodeRDN(this.ctx, rdn))),
            modifiersName: (vertex.dse.modifiersName?.rdnSequence ?? [])
                .map((rdn) => escape(encodeRDN(this.ctx, rdn))),
            attributes,
        };
    }

}

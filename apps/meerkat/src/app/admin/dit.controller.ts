import type { Context, Vertex } from "@wildboar/meerkat-types";
import { CONTEXT } from "../constants";
import type { Entry } from "@prisma/client";
import {
    Controller,
    Get,
    Post,
    Render,
    Inject,
    Param,
    NotFoundException,
    Req,
    Res,
} from "@nestjs/common";
import type { Response } from "express";
import rdnToString from "@wildboar/ldap/src/lib/stringifiers/RelativeDistinguishedName";
import type StringEncoderGetter from "@wildboar/ldap/src/lib/types/StringEncoderGetter";
import type StringEncoder from "@wildboar/ldap/src/lib/types/StringEncoder";
import { OBJECT_IDENTIFIER, ASN1Element, ASN1TagClass, ASN1UniversalType } from "asn1-ts";
import type {
    RelativeDistinguishedName
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import getRDNFromEntryId from "../database/getRDNFromEntryId";
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
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import readValues from "../database/entry/readValues";
import deleteEntry from "../database/deleteEntry";
import escape from "escape-html";
import type { DistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/DistinguishedName.ta";
import dnToVertex from "../dit/dnToVertex";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    distinguishedNameMatch,
} from "@wildboar/x500/src/lib/modules/InformationFramework/distinguishedNameMatch.oa";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import stringifyDN from "../x500/stringifyDN";
import readSubordinates from "../dit/readSubordinates";
import { subschema } from "@wildboar/x500/src/lib/collections/objectClasses";
import { getLDAPSyntax } from "../x500/getLDAPSyntax";
import { at } from "lodash";
import { entryDN } from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";

const selectAllInfo = new EntryInformationSelection(
    {
        allUserAttributes: null,
    },
    undefined,
    {
        allOperationalAttributes: null,
    },
    {
        allContexts: null,
    },
    true,
    undefined,
);

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
const subschemaSubentry: string = subschema["&id"].toString();


const parent: string = id_oc_parent.toString();
const child: string = id_oc_child.toString();

function encodeRDN (ctx: Context, rdn: RelativeDistinguishedName): string {
    const stringEncoderGetter: StringEncoderGetter = (syntax: OBJECT_IDENTIFIER): StringEncoder | undefined => {
        const attrSpec = ctx.attributeTypes.get(syntax.toString());
        if (!attrSpec) {
            return undefined;
        }
        const ldapSyntax = getLDAPSyntax(ctx, attrSpec.id);
        if (!ldapSyntax?.encoder) {
            return undefined;
        }
        const encoder = ldapSyntax.encoder;
        return (value: ASN1Element): string => {
            return Buffer.from(encoder(value)).toString("utf-8");
        };
    };

    const typeNameGetter = (type: OBJECT_IDENTIFIER): string | undefined => {
        const attrSpec = ctx.attributeTypes.get(type.toString());
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

const CYAN: string = "#00FFFF";
const BLUE: string = "#0088FF";
const GREEN: string = "#00FF00";
const YELLOW: string = "#FFFF00";
const ORANGE: string = "#FFAA00";
const MAGENTA: string = "#FF00FF";
const GREY: string = "#AAAAAA";
const WHITE: string = "#FFFFFF";

function printFlags (vertex: Vertex): string {
    const ret: string[] = [];
    const dse = vertex.dse;
    if (dse.root) {
        ret.push(`<span style="color: ${GREY};">root</span>`);
    }
    if (dse.glue) {
        ret.push(`<span style="color: ${GREY};">glue</span>`);
    }
    if (dse.cp) {
        ret.push(`<span style="color: ${GREEN};">cp</span>`);
    }
    if (dse.entry) {
        ret.push(`<span style="color: ${WHITE};">entry</span>`);
    }
    if (dse.alias) {
        ret.push(`<span style="color: ${CYAN};">alias</span>`);
    }
    if (dse.subr) {
        ret.push(`<span style="color: ${BLUE};">subr</span>`);
    }
    if (dse.nssr) {
        ret.push(`<span style="color: ${BLUE};">nssr</span>`);
    }
    if (dse.supr) {
        ret.push(`<span style="color: ${BLUE};">supr</span>`);
    }
    if (dse.xr) {
        ret.push(`<span style="color: ${BLUE};">xr</span>`);
    }
    if (dse.admPoint) {
        ret.push(`<span style="color: ${YELLOW};">admPoint</span>`);
        const ar = dse.admPoint.administrativeRole;
        if (ar.has(autonomousArea)) {
            ret.push(`<span style="color: ${GREY};">AA</span>`);
        }
        if (ar.has(accessControlSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">ACSA</span>`);
        }
        if (ar.has(accessControlInnerArea)) {
            ret.push(`<span style="color: ${GREY};">ACIA</span>`);
        }
        if (ar.has(subschemaAdminSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">SASA</span>`);
        }
        if (ar.has(collectiveAttributeSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">CASA</span>`);
        }
        if (ar.has(collectiveAttributeInnerArea)) {
            ret.push(`<span style="color: ${GREY};">CAIA</span>`);
        }
        if (ar.has(contextDefaultSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">CDSA</span>`);
        }
        if (ar.has(serviceSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">SSA</span>`);
        }
        if (ar.has(pwdAdminSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">PASA</span>`);
        }
    }
    if (dse.subentry) {
        ret.push(`<span style="color: ${MAGENTA};">subentry</span>`);
    }
    if (dse.shadow) {
        ret.push(`<span style="color: ${GREY};">shadow</span>`);
    }
    if (dse.immSupr) {
        ret.push(`<span style="color: ${BLUE};">immSupr</span>`);
    }
    if (dse.rhob) {
        ret.push(`<span style="color: ${BLUE};">rhob</span>`);
    }
    if (dse.sa) {
        ret.push(`<span style="color: ${BLUE};">sa</span>`);
    }
    if (dse.dsSubentry) {
        ret.push(`<span style="color: ${MAGENTA};">dsSubentry</span>`);
    }
    if (dse.familyMember) {
        ret.push(`<span style="color: ${ORANGE};">familyMember</span>`);
    }
    if (dse.ditBridge) {
        ret.push(`<span style="color: ${BLUE};">ditBridge</span>`);
    }
    if (dse.objectClass.has(accessControlSubentry)) {
        ret.push(`<span style="color: ${GREY};">access-control</span>`);
    }
    if (dse.objectClass.has(collectiveAttributeSubentry)) {
        ret.push(`<span style="color: ${GREY};">coll-attrs</span>`);
    }
    if (dse.objectClass.has(contextAssertionSubentry)) {
        ret.push(`<span style="color: ${GREY};">context-assert</span>`);
    }
    if (dse.objectClass.has(serviceAdminSubentry)) {
        ret.push(`<span style="color: ${GREY};">service-admin</span>`);
    }
    if (dse.objectClass.has(pwdAdminSubentry)) {
        ret.push(`<span style="color: ${GREY};">pwd-admin</span>`);
    }
    if (dse.objectClass.has(subschemaSubentry)) {
        ret.push(`<span style="color: ${GREY};">schema-admin</span>`);
    }
    if (dse.objectClass.has(parent)) {
        ret.push(`<span style="color: ${ORANGE};">parent</span>`);
    }
    if (dse.objectClass.has(child)) {
        ret.push(`<span style="color: ${ORANGE};">child</span>`);
    }
    return `(${ret.join(" &amp; ")})`;
}

function convertDSEToHTML (ctx: Context, vertex: Vertex): [ string, string, string ] {
    const stringifiedRDN = (vertex.dse.rdn.length === 0)
        ? "(Empty RDN)"
        : escape(encodeRDN(ctx, vertex.dse.rdn));
    return [ vertex.dse.uuid, stringifiedRDN, printFlags(vertex) ];
}

function hexEncode (value: ASN1Element): string {
    return `#${Buffer.from(value.toBytes()).toString("hex")}`;
}

function defaultEncoder (value: ASN1Element): string {
    if (
        (value.tagClass !== ASN1TagClass.universal)
        || (value.tagNumber === ASN1UniversalType.sequence)
        || (value.tagNumber === ASN1UniversalType.set)
    ) {
        return hexEncode(value);
    }
    return value.toString();
}


@Controller()
export class DitController {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
    ) {}

    @Get("/dsait/dse/:id")
    @Render("dsait_dse_id")
    async dse_id (
        @Req() req: { csrfToken: () => string },
        @Param("id") id: string,
    ) {
        const entry = await this.ctx.db.entry.findUnique({
            where: {
                dseUUID: id,
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
        const superiorUUID: string | undefined = superior?.dseUUID;
        const rdn: RelativeDistinguishedName = await getRDNFromEntryId(this.ctx, entry.id);
        const vertex = await vertexFromDatabaseEntry(this.ctx, undefined, entry);
        const {
            userValues: userAttributes,
            operationalValues: operationalAttributes,
            collectiveValues,
        } = await readValues(this.ctx, vertex, {
            selection: selectAllInfo,
        });
        const attributes: [ string, string, string ][] = [
            ...userAttributes,
            ...operationalAttributes
                /**
                 * We don't display the entryDN attribute because the vertex's
                 * superior is not loaded in this controller, so this will
                 * display incorrectly.
                 */
                .filter((a) => !a.type.isEqualTo(entryDN["&id"])),
            ...collectiveValues,
        ]
            .map((attr) => [
                ((): string => {
                    const spec = this.ctx.attributeTypes.get(attr.type.toString());
                    return spec?.name?.[0] ?? spec?.ldapNames?.[0] ?? attr.type.toString();
                })(),
                ((): string => {
                    const spec = this.ctx.attributeTypes.get(attr.type.toString());
                    if (spec?.equalityMatchingRule?.isEqualTo(distinguishedNameMatch["&id"])) {
                        const dn_ = _decode_DistinguishedName(attr.value);
                        return stringifyDN(this.ctx, dn_);
                    }
                    if (!spec) {
                        return defaultEncoder(attr.value);
                    }
                    const ldapSyntax = getLDAPSyntax(this.ctx, spec.id);
                    if (!ldapSyntax?.encoder) {
                        return defaultEncoder(attr.value);
                    }
                    const encoder = ldapSyntax.encoder;
                    try {
                        return Buffer.from(encoder(attr.value)).toString("utf-8");
                    } catch {
                        return "COULD NOT DISPLAY";
                    }
                })(),
                Array.from(attr.contexts?.values() ?? [])
                    .map((context) => context.contextType.toString())
                    .join(", "),
            ]);

        const subordinates: [ string, string, string ][] = (await readSubordinates(this.ctx, vertex))
            .map((sub) => convertDSEToHTML(this.ctx, sub));

        return {
            csrfToken: req.csrfToken(),
            ...entry,
            uuid: entry.dseUUID,
            superiorUUID,
            rdn: (rdn.length === 0)
                ? "(Empty RDN)"
                : escape(encodeRDN(this.ctx, rdn)),
            flags: printFlags(vertex),
            objectClasses: (await this.ctx.db.entryObjectClass.findMany({
                where: {
                    entry_id: entry.id,
                },
                select: {
                    object_class: true,
                },
            }))
                .map(({ object_class: oc }) => ({
                    oid: oc,
                    name: this.ctx.objectClasses.get(oc)?.ldapNames?.[0],
                })),
            createTimestamp: entry.createTimestamp?.toISOString(),
            modifyTimestamp: entry.modifyTimestamp?.toISOString(),
            deleteTimestamp: entry.deleteTimestamp?.toISOString(),
            creatorsName: (vertex.dse.creatorsName?.rdnSequence ?? [])
                .map((rdn) => escape(encodeRDN(this.ctx, rdn))),
            modifiersName: (vertex.dse.modifiersName?.rdnSequence ?? [])
                .map((rdn) => escape(encodeRDN(this.ctx, rdn))),
            attributes,
            subordinates,
        };
    }

    @Post("/dsait/dse/:id/delete")
    async delete_dse_id (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const soughtEntry = await this.ctx.db.entry.findUnique({
            where: {
                dseUUID: id,
            },
        });
        if (!soughtEntry) {
            throw new NotFoundException();
        }
        let current: Entry | null = soughtEntry;
        const currentDN: DistinguishedName = [];
        while (current?.immediate_superior_id) {
            const rdn = await getRDNFromEntryId(this.ctx, current.id);
            currentDN.unshift(rdn);
            current = await this.ctx.db.entry.findUnique({
                where: {
                    id: current.immediate_superior_id,
                },
            });
        }
        const entry = await dnToVertex(this.ctx, this.ctx.dit.root, currentDN);
        if (entry) {
            await deleteEntry(this.ctx, entry);
        }
        res.redirect("/");
    }
}

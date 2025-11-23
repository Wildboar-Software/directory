import type { Context } from "../types";
import type {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import type {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import type {
    AccessPointInformation,
} from "@wildboar/x500/DistributedOperations";
import {
    MasterOrShadowAccessPoint_category,
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
    MasterOrShadowAccessPoint_category_writeableCopy,
} from "@wildboar/x500/DistributedOperations";
import stringifyDN from "../utils/stringifyDN";
import { naddrToURI } from "@wildboar/x500";
import { EOL } from "node:os";

function printCategory (cat: MasterOrShadowAccessPoint_category): string {
    return ({
        [MasterOrShadowAccessPoint_category_master]: "master",
        [MasterOrShadowAccessPoint_category_shadow]: "shadow",
        [MasterOrShadowAccessPoint_category_writeableCopy]: "writeableCopy",
    })[cat] ?? "UNKNOWN";
}

// AccessPoint ::= SET {
//     ae-title             [0]  Name,
//     address              [1]  PresentationAddress,
//     protocolInformation  [2]  SET SIZE (1..MAX) OF ProtocolInformation OPTIONAL,
//     --                   [6]  Not to be used
//     ... }

//   MasterOrShadowAccessPoint ::= SET {
//     COMPONENTS OF          AccessPoint,
//     category          [3]  ENUMERATED {
//       master            (0),
//       shadow            (1),
//       writeableCopy     (2),
//       ... } DEFAULT master,
//     chainingRequired  [5]  BOOLEAN DEFAULT FALSE,
//     ... }

export
function printAccessPoint (
    ctx: Context,
    mosap: AccessPointInformation | MasterOrShadowAccessPoint | AccessPoint,
    index: number = 0,
    indent: number = 0,
): string {
    const lines: string[] = [
        `Access Point #${(index + 1).toString().padStart(2, "0")}`,
        `| APPLICATION ENTITY TITLE: ${stringifyDN(ctx, mosap.ae_title.rdnSequence)}`,
    ];
    for (const naddr of mosap.address.nAddresses) {
        const uri = naddrToURI(naddr);
        if (uri) {
            lines.push(`| NETWORK ADDRESS: ${uri}`);
        } else {
            lines.push(`| NETWORK ADDRESS: ${Buffer.from(naddr).toString("hex")}`);
        }
    }
    if (mosap.address.tSelector) {
        lines.push(`| TRANSPORT SELECTOR: ${Buffer.from(mosap.address.tSelector).toString("hex")}`);
    }
    if (mosap.address.sSelector) {
        lines.push(`| SESSION SELECTOR: ${Buffer.from(mosap.address.sSelector).toString("hex")}`);
    }
    if (mosap.address.pSelector) {
        lines.push(`| PRESENTATION SELECTOR: ${Buffer.from(mosap.address.pSelector).toString("hex")}`);
    }
    for (const pinfo of mosap.protocolInformation ?? []) {
        const uri = naddrToURI(pinfo.nAddress);
        const oids = pinfo.profiles.map((oid) => oid.toString());
        if (uri) {
            lines.push(`| PROTOCOL INFO [${uri}]: ${oids}`);
        } else {
            lines.push(`| PROTOCOL INFO [${Buffer.from(pinfo.nAddress).toString("hex")}]: ${oids}`);
        }
    }
    if (("category" in mosap) && (mosap.category !== undefined)) {
        lines.push(`| CATEGORY: ${printCategory(mosap.category)}`);
    }
    if (("chainingRequired" in mosap) && (mosap.chainingRequired !== undefined)) {
        lines.push(`| CHAINING REQUIRED: ${mosap.chainingRequired.toString().toUpperCase()}`);
    }
    return lines.map((line) => "\t".repeat(indent) + line).join(EOL);
}

export
function print (ctx: Context, api: AccessPointInformation, index: number = 0): string {
    let ret: string = printAccessPoint(ctx, api, index, 0);
    const additionalPoints = api.additionalPoints ?? [];
    for (let i = 0; i < additionalPoints.length; i++) {
        ret += EOL;
        ret += printAccessPoint(ctx, additionalPoints[i], i, 1);
    }
    return ret;
}

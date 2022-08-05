import type { MeerkatContext } from "../ctx";
import { CONTEXT } from "../constants";
import {
    Controller,
    Get,
    Post,
    Render,
    Inject,
    Param,
    Req,
    Res,
    NotFoundException,
} from "@nestjs/common";
import type { Response, Request } from "express";
import * as fs from "fs/promises";
import * as path from "path";
import { flatten } from "flat";
import { getServerStatistics } from "../telemetry/getServerStatistics";
import sleep from "../utils/sleep";
import stringifyDN from "../x500/stringifyDN";
import { rdnFromJson } from "../x500/rdnFromJson";

const conformancePath = path.join(__dirname, "assets", "static", "conformance.md");
const ROBOTS: string = `User-agent: *\r\nDisallow: /\r\n`;
const SECURITY_TXT: string = [
    "Contact: mailto:jonathan.wilbur@wildboarsoftware.com",
    "Expires: 2023-12-19T18:28:00.000Z",
    "Preferred-Languages: en",
].join("\r\n");

// TODO: Dedupe
function breakIntoLines (str: string, lineLength: number): string[] {
    const lines: string[] = [];
    for (let i = 0; i < str.length; i = i + lineLength) {
        lines.push(str.slice(i, i + lineLength));
    }
    return lines;
}

@Controller()
export class HomeController {

    constructor (
        @Inject(CONTEXT) readonly ctx: MeerkatContext,
    ) {
        /**
         * hbs (Handlebars templating engine) is an implicit dependency for
         * NestJS template rendering. However, since it is never explicitly
         * imported, webpack will shake it out of the dependencies in the
         * resulting package.json. Merely importing this here and doing nothing
         * else with it makes sure that it appears in the post-webpack
         * package.json file.
         */
        import("hbs").then();
    }

    @Get()
    @Get("/index")
    @Get("/home")
    @Render('index')
    public index (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            dsa: this.ctx.dsa.accessPoint.ae_title.rdnSequence.length
                ? stringifyDN(this.ctx, this.ctx.dsa.accessPoint.ae_title.rdnSequence)
                : "<UNSET> (Consider configuring signing PKI)",
            csrfToken: req.csrfToken(),
            rootuuid: this.ctx.dit.root.dse.uuid,
            dhparams: !!process.env.MEERKAT_TLS_DH_PARAM_FILE,
        };
    }

    @Get("/conformance")
    @Render("markdown")
    public async conformance (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            csrfToken: req.csrfToken(),
            title: "Conformance",
            content: await fs.readFile(conformancePath, { encoding: "utf-8" }),
        };
    }

    @Get("/ob")
    @Render('ob')
    async ob (
        @Req() req: { csrfToken: () => string },
    ) {
        const templateVariables = {
            csrfToken: req.csrfToken(),
            obs: (await this.ctx.db.operationalBinding.findMany({
                select: {
                    uuid: true,
                    binding_type: true,
                    binding_identifier: true,
                    binding_version: true,
                    terminated_time: true,
                    accepted: true,
                    validity_start: true,
                    validity_end: true,
                },
            }))
                .map((ob) => {
                    const status: string = (() => {
                        if (ob.terminated_time) {
                            return "TERMINATED";
                        }
                        if (ob.validity_start.valueOf() > Date.now()) {
                            return "PENDING";
                        }
                        if (ob.validity_end && (ob.validity_end.valueOf() > Date.now())) {
                            return "EXPIRED";
                        }
                        if (ob.accepted === null) {
                            return "REQUESTED";
                        }
                        if (ob.accepted) {
                            return "ACCEPTED";
                        }
                        if (ob.accepted === false) {
                            return "REJECTED";
                        }
                        return "ASSERTION_ERROR";
                    })();
                    return {
                        ...ob,
                        status,
                        waiting: (ob.accepted === undefined || ob.accepted === null),
                        binding_type: ob.binding_type,
                        validity_start: ob.validity_start.toISOString(),
                        validity_end: ob.validity_end
                            ? ob.validity_end.toISOString()
                            : "EXPLICIT_TERMINATION",
                    };
                }),
        };
        return templateVariables;
    }

    @Get("/ob/:id")
    @Render("ob_id")
    async obDetails (
        @Req() req: { csrfToken: () => string },
        @Param("id") id: string,
    ) {
        const ob = await this.ctx.db.operationalBinding.findUnique({
            where: {
                uuid: id,
            },
            include: {
                previous: {
                    select: {
                        uuid: true,
                    },
                },
            },
        });
        if (!ob) {
            throw new NotFoundException();
        }
        const cp_rdn = ((typeof ob.new_context_prefix_rdn === "object") && ob.new_context_prefix_rdn)
            ? rdnFromJson(ob.new_context_prefix_rdn as Record<string, string>)
            : undefined;
        const cp_superior_dn = Array.isArray(ob.immediate_superior)
            ? ob.immediate_superior.map(rdnFromJson)
            : undefined;
        const cpdn = (cp_superior_dn && cp_rdn)
            ? [ ...cp_superior_dn, cp_rdn ]
            : undefined;
        const status: string = (ob.accepted === null)
            ? "WAITING DECISION"
            : (ob.accepted ? "ACCEPTED" : "REJECTED");
        const templateVariables = {
            csrfToken: req.csrfToken(),
            ...ob,
            status,
            binding_type: ob.binding_type,
            validity_start: ob.validity_start.toISOString(),
            validity_end: ob.validity_end?.toISOString(),
            actionable: (ob.accepted === null),
            cp: cpdn
                ? stringifyDN(this.ctx, cpdn)
                : undefined,
            agreement_bytes: ob.agreement_ber
                ? breakIntoLines(ob.agreement_ber.toString("hex"), 60)
                : undefined,
            init_param_bytes: ob.initiator_ber
                ? breakIntoLines(ob.initiator_ber.toString("hex"), 60)
                : undefined,
            previous_uuid: ob.previous?.uuid,
        };
        return templateVariables;
    }

    @Post("/ob/:id/accept")
    async accept (
        @Param("id") id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const result = await this.ctx.db.operationalBinding.findUnique({
            where: {
                uuid: id,
            },
        });
        if (!result) {
            throw new NotFoundException(id);
        }
        this.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten({
                    server: getServerStatistics(this.ctx),
                }),
                accepted: true,
                administratorEmail: this.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        await this.ctx.db.accessPoint.updateMany({
            where: {
                operational_bindings: {
                    some: {
                        uuid: result.uuid,
                    },
                },
            },
            data: {
                trust_ibra: (req.body?.ibra === "on"),
                disclose_cross_refs: (req.body?.xr === "on"),
            },
        });
        this.ctx.operationalBindingControlEvents.emit(id, true);
        // I know it's lazy programming, but this was the best way I could wait until the OB updates.
        await sleep(3000);
        res.redirect(`/ob/${id}`);
    }

    @Post("/ob/:id/reject")
    async reject (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.ctx.db.operationalBinding.findUnique({
            where: {
                uuid: id,
            },
        });
        if (!result) {
            throw new NotFoundException(id);
        }
        this.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten({
                    server: getServerStatistics(this.ctx),
                }),
                accepted: false,
                administratorEmail: this.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        this.ctx.operationalBindingControlEvents.emit(id, false);
        res.redirect(`/ob/${id}`);
    }

    @Post("/ob/:id/cancel")
    async cancel (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.ctx.db.operationalBinding.update({
            where: {
                uuid: id,
            },
            data: {
                terminated_time: new Date(),
            },
        });
        this.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten({
                    server: getServerStatistics(this.ctx),
                }),
                accepted: false,
                administratorEmail: this.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        this.ctx.operationalBindingControlEvents.emit(id, false);
        res.redirect(`/ob/${id}`);
    }

    @Get("/robots.txt")
    public robots (
        @Res() res: Response,
    ) {
        res.contentType("text/plain; charset=utf-8");
        res.send(ROBOTS);
    }

    @Get("/.well-known/security.txt")
    public wellKnownSecurityTxt (
        @Res() res: Response,
    ) {
        res.contentType("text/plain; charset=utf-8");
        res.send(SECURITY_TXT);
    }

    @Get("/security.txt")
    public securityTxt (
        @Res() res: Response,
    ) {
        res.contentType("text/plain; charset=utf-8");
        res.send(SECURITY_TXT);
    }

}

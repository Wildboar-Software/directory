import type { MeerkatContext } from "../ctx";
import { CONTEXT } from "../constants";
import { Controller, Get, Post, Render, Inject, Param, Res, NotFoundException } from "@nestjs/common";
import type { Response } from "express";
import * as fs from "fs/promises";
import * as path from "path";
import { flatten } from "flat";
import { getServerStatistics } from "../telemetry/getServerStatistics";

const conformancePath = path.join(__dirname, "assets", "static", "conformance.md");

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
    index () {
        return {
            rootuuid: this.ctx.dit.root.dse.uuid,
        };
    }

    @Get("/conformance")
    @Render("markdown")
    public async conformance () {
        return {
            title: "Conformance",
            content: await fs.readFile(conformancePath, { encoding: "utf-8" }),
        };
    }

    @Get("/ob")
    @Render('ob')
    async ob () {
        const templateVariables = {
            obs: (await this.ctx.db.operationalBinding.findMany({
                select: {
                    uuid: true,
                    binding_type: true,
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
        @Param("id") id: string,
    ) {
        const ob = await this.ctx.db.operationalBinding.findUnique({
            where: {
                uuid: id,
            },
        });
        if (!ob) {
            throw new NotFoundException();
        }
        const status: string = (ob.accepted === null)
            ? "WAITING DECISION"
            : (ob.accepted ? "ACCEPTED" : "REJECTED");
        const templateVariables = {
            ...ob,
            status,
            binding_type: ob.binding_type,
            validity_start: ob.validity_start.toISOString(),
            validity_end: ob.validity_end?.toISOString(),
            actionable: (ob.accepted === null),
        };
        return templateVariables;
    }

    @Post("/ob/:id/accept")
    async accept (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.ctx.db.operationalBinding.update({
            where: {
                uuid: id,
            },
            data: {
                accepted: true,
            },
        });
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
        this.ctx.operationalBindingControlEvents.emit(id, true);
        res.redirect(`/ob/${id}`);
    }

    @Post("/ob/:id/reject")
    async reject (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.ctx.db.operationalBinding.update({
            where: {
                uuid: id,
            },
            data: {
                accepted: false,
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
                accepted: null,
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

}

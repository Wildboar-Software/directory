import type { MeerkatContext } from "../ctx";
import { CONTEXT } from "../constants";
import { Controller, Get, Post, Render, Inject, Res, Req } from "@nestjs/common";
import type { Response } from "express";
import * as os from "os";
import { flatten } from "flat";
import { getServerStatistics } from "../telemetry/getServerStatistics";

function canFail (cb: () => string): string {
    try {
        return cb();
    } catch {
        return "ERROR";
    }
}

@Controller()
export class SystemController {

    constructor (
        @Inject(CONTEXT) readonly ctx: MeerkatContext,
    ) {}

    @Get("/updates")
    @Render('updates')
    public updates (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            csrfToken: req.csrfToken(),
        };
    }

    @Get("/help")
    @Render('help')
    public help (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            csrfToken: req.csrfToken(),
        };
    }

    @Get("/about")
    @Render('about')
    public about (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            csrfToken: req.csrfToken(),
            version: "1.2.0",
            hash: "", // TODO:
            license: "", // TODO:
            os_arch: canFail(() => os.arch()),
            // os_cpus: os.cpus(), // TODO:
            os_endianness: canFail(() => os.endianness()),
            os_freemem: canFail(() => os.freemem().toString()),
            os_homedir: canFail(() => os.homedir()),
            os_hostname: canFail(() => os.hostname()),
            os_platform: canFail(() => os.platform()),
            os_release: canFail(() => os.release()),
            os_totalmem: canFail(() => os.totalmem().toString()),
            os_type: canFail(() => os.type()),
            os_uptime: canFail(() => os.uptime().toString() + " seconds"),
            os_version: canFail(() => os.version()),
        };
    }

    @Get("/hibernate")
    @Render("hibernate")
    public hibernate (
        @Req() req: { csrfToken: () => string },
    ) {
        return {
            csrfToken: req.csrfToken(),
            hibernatingSince: this.ctx.dsa.hibernatingSince
                ? this.ctx.dsa.hibernatingSince.toISOString()
                : undefined,
        };
    }

    @Post("/hibernate/start")
    startHibernation (
        @Res() res: Response,
    ) {
        const startDate = new Date();
        this.ctx.telemetry.trackEvent({
            name: "Hibernation",
            properties: {
                ...flatten({
                    server: getServerStatistics(this.ctx),
                }),
                since: startDate,
                started: true,
                administratorEmail: this.ctx.config.administratorEmail,
            },
        });
        this.ctx.dsa.hibernatingSince = startDate;
        res.redirect("/hibernate");
    }

    @Post("/hibernate/end")
    endHibernation (
        @Res() res: Response,
    ) {
        this.ctx.telemetry.trackEvent({
            name: "Hibernation",
            properties: {
                ...flatten({
                    server: getServerStatistics(this.ctx),
                }),
                since: this.ctx.dsa.hibernatingSince,
                started: false,
                administratorEmail: this.ctx.config.administratorEmail,
            },
        });
        this.ctx.dsa.hibernatingSince = undefined;
        res.redirect("/hibernate");
    }

}

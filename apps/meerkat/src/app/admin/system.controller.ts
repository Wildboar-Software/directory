import type { MeerkatContext } from "../ctx";
import { CONTEXT } from "../constants";
import { Controller, Get, Post, Render, Inject, Res } from "@nestjs/common";
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
    updates () {
        return {};
    }

    @Get("/help")
    @Render('help')
    help () {
        return {};
    }

    @Get("/about")
    @Render('about')
    about () {
        return {
            version: "1.0.0",
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
    hibernate () {
        return {
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

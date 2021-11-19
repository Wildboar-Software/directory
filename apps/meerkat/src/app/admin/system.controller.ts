import type { Context } from "@wildboar/meerkat-types";
import { CONTEXT } from "../constants";
import { Controller, Get, Post, Render, Inject, Res } from "@nestjs/common";
import type { Response } from "express";
import * as os from "os";
import canFail from "../utils/canFail";

@Controller()
export class SystemController {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
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
        this.ctx.dsa.hibernatingSince = new Date();
        res.redirect("/hibernate");
    }

    @Post("/hibernate/end")
    endHibernation (
        @Res() res: Response,
    ) {
        this.ctx.dsa.hibernatingSince = undefined;
        res.redirect("/hibernate");
    }

}

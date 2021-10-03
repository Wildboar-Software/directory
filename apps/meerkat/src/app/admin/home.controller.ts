import type { Context } from "../types";
import { CONTEXT } from "../constants";
import { Controller, Get, Post, Render, Inject, Param, Res } from "@nestjs/common";
import type { Response } from "express";
import * as fs from "fs/promises";
import * as path from "path";

const conformancePath = path.join(__dirname, "assets", "static", "conformance.md");

@Controller()
export class HomeController {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
    ) {}

    @Get()
    @Get("/index")
    @Get("/home")
    @Render('index')
    index () {
        return {};
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
            obs: (await this.ctx.db.operationalBinding.findMany())
                .map((ob) => ({
                    ...ob,
                    status: (ob.accepted === true) ? "ACCEPTED" : "NO",

                    // TODO: Active, Expired, Rejected, Requested, Impending
                    active: (ob.accepted === true),
                    waiting: (ob.accepted === undefined || ob.accepted === null),
                    rejected: (ob.accepted === false),

                    binding_type: ob.binding_type,
                    validity_start: ob.validity_start.toISOString(),
                    validity_end: ob.validity_end
                        ? ob.validity_end.toISOString()
                        : "Explicit_termination",
                })),
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
            throw new Error();
        }
        const templateVariables = {
            ...ob,
            binding_type: ob.binding_type,
            validity_start: ob.validity_start.toISOString(),
            validity_end: ob.validity_end?.toISOString(),
        };
        return templateVariables;
    }

    @Post("/ob/:id/accept")
    async accept (
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        await this.ctx.db.operationalBinding.update({
            where: {
                uuid: id,
            },
            data: {
                accepted: true,
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
        await this.ctx.db.operationalBinding.update({
            where: {
                uuid: id,
            },
            data: {
                accepted: false,
            },
        });
        this.ctx.operationalBindingControlEvents.emit(id, false);
        res.redirect(`/ob/${id}`);
    }

}

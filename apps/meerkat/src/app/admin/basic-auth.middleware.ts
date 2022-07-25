
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import type { Context } from '@wildboar/meerkat-types';
import { CONTEXT } from "../constants";
import { timingSafeEqual, randomInt } from "crypto";
import { sleep } from "../utils/sleep";

async function unauthorized (
    ctx: Context,
    req: Request,
    res: Response,
    invalidCredentials: boolean = false,
): Promise<void> {
    if (res.socket && invalidCredentials) {
        const host = `${res.socket.remoteFamily}://${res.socket.remoteAddress}/${res.socket.remotePort}`;
        const logInfo = {
            host,
            method: req.method,
            path: req.path,
        };
        ctx.log.warn(ctx.i18n.t("log:auth_failure_web_admin", logInfo), logInfo);
    }
    /**
     * Wait 1 - 3 seconds before responding to mitigate timing attacks.
     */
    await sleep(randomInt(1000, 3000));
    if (ctx.config.webAdmin.auth?.realm) {
        const realm = ctx.config.webAdmin.auth.realm;
        // `realm` was already escaped at start-time.
        res.setHeader("WWW-Authenticate", `Basic realm="${realm}", charset="UTF-8"`);
    } else {
        res.setHeader("WWW-Authenticate", "Basic charset=\"UTF-8\"");
    }
    res.sendStatus(401);
}

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
    ) {}

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!this.ctx.config.webAdmin.auth) {
            next();
            return;
        }
        const authzHeader = req.headers["authorization"];
        if (!authzHeader || !authzHeader.startsWith("Basic ")) {
            await unauthorized(this.ctx, req, res);
            return;
        }
        const base64Creds: string = authzHeader.slice("Basic ".length).trim();
        const decoded = Buffer.from(base64Creds, "base64").toString("utf-8");
        const indexOfFirstColon: number = decoded.indexOf(":");
        if (indexOfFirstColon < 0) {
            await unauthorized(this.ctx, req, res);
            return;
        }
        const suppliedUsername = decoded.slice(0, indexOfFirstColon);
        const suppliedPassword = decoded.slice(indexOfFirstColon + 1);
        const expectedUsernameBuf = Buffer.from(this.ctx.config.webAdmin.auth.username);
        const expectedPasswordBuf = Buffer.from(this.ctx.config.webAdmin.auth.password);
        // NOTE: The realm is not used.
        const usernameBuf = Buffer.from(suppliedUsername);
        const passwordBuf = Buffer.from(suppliedPassword);

        /**
         * NOTE: We convert the username and password strings to `Buffer`s first
         * because the `.length` of a string is UTF-16 code units, but the
         * length of a buffer is bytes; therefore, two strings having a similar
         * number of characters may not have the same buffer length when
         * converted to bytes.
         *
         * This matters because `crypto.timingSafeEqual()` expects the buffers
         * to be of the same length before it is called, so we have to compare
         * the two correctly.
         */
        const validCredentials: boolean = (
            (usernameBuf.length === expectedUsernameBuf.length)
            && (passwordBuf.length === expectedPasswordBuf.length)
            && timingSafeEqual(usernameBuf, expectedUsernameBuf)
            && timingSafeEqual(passwordBuf, expectedPasswordBuf)
        );
        if (!validCredentials) {
            await unauthorized(this.ctx, req, res, true);
            return;
        }
        next();
    }
}

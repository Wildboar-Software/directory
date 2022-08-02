
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import type { Context } from '@wildboar/meerkat-types';
import { CONTEXT } from "../constants";


@Injectable()
export class LoggingMiddleware implements NestMiddleware {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
    ) {}

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (res.socket) {
            const host = `${res.socket.remoteFamily}://${res.socket.remoteAddress}/${res.socket.remotePort}`;
            const logInfo = {
                host,
                method: req.method,
                path: req.path,
            };
            this.ctx.log.info(this.ctx.i18n.t("log:web_admin_http", logInfo), logInfo);
        }
        next();
    }
}

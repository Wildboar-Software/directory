
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import type { Context } from '@wildboar/meerkat-types';
import { CONTEXT } from "../constants";

// const PERMISSIONS_POLICY: string = "default 'none';";

@Injectable()
export class SecurityMiddleware implements NestMiddleware {

    constructor (
        @Inject(CONTEXT) readonly ctx: Context,
    ) {}

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline'; script-src 'none'");
        res.setHeader("X-Frame-Options", "deny");
        if (this.ctx.config.webAdmin.useTLS) {
            res.setHeader("Strict-Transport-Security", "max-age=3600; includeSubDomains; preload");
        }
        // Deprecated, but might as well provide it just to be thorough.
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-Robots-Tag", "noindex");
        // res.setHeader("Clear-Site-Data", "*");
        // Uncomment if this is ever supported: https://github.com/w3c/webappsec-permissions-policy/issues/189
        // res.setHeader("Feature-Policy", PERMISSIONS_POLICY);
        // res.setHeader("Permissions-Policy", PERMISSIONS_POLICY);
        next();
    }
}

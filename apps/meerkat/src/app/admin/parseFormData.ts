import type { Request, Response, NextFunction } from "express";

export
interface RequestWithBodyReadIndicator extends Request {
    _body?: boolean;
}

/**
 * @summary Parse URL-encoded form data
 * @description
 *
 * This is my custom-made replacement for the `body-parser` NPM module.
 * I only need the ability to decode URL-encoded form data, so
 *
 * @function
 */
export
function parseFormData (
    req: RequestWithBodyReadIndicator,
    res: Response,
    next: NextFunction,
): void {
    if (!req.body) {
        req.body = {};
    }
    /**
     * This single line of code is very necessary and I went through an
     * enormous trial to figure it out. I still don't know exactly why
     * this is necessary, but this is what `body-parser` did
     * differently from my library: it sets this. Once I added this line
     * of code, CSRF protection seems to work as expected.
     */
    (req as any)._body = true;
    if (req.headers["content-type"]?.toLowerCase() !== "application/x-www-form-urlencoded") {
        next();
        return;
    }
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
    });
    req.once("error", () => {
        req.removeAllListeners();
        res.status(500).send();
    });
    req.once("end", () => {
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        if (rawBody.length === 0) {
            next();
            return;
        }
        const fields = rawBody.split("&");
        for (const field of fields) {
            const [ key, value ] = field.split("=");
            if (!key) {
                req.removeAllListeners();
                res.status(400).send();
                return;
            }
            req.body[key] = decodeURIComponent(value ?? "");
        }
        next();
    });
}

import type { Request, Response, NextFunction } from "express";

/**
 * @summary Apply the XSRF-Token header.
 * @description
 *
 * This seems to be an implicit requirement for the `csurf` module to work when
 * using cookies.
 *
 * @function
 */
export
function applyXSRFCookie (
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token);
    res.locals.csrfToken = token;
    next();
}

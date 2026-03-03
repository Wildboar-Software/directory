import type { Context } from "../../types/index.js";
import { orNameElementsMatcher } from "./oRNameElementsMatch.js";
import getRedirectionOrDLExpansionMatchingGetter from "./redirectionOrDLExpansionMatchCommon.js";

export const redirectionOrDLExpansionElementsMatcher
    = (ctx: Context) => getRedirectionOrDLExpansionMatchingGetter(ctx, () => orNameElementsMatcher);

export default redirectionOrDLExpansionElementsMatcher;

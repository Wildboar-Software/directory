import type { Context } from "../../types/index.js";
import { getORNameMatcher } from "./oRNameMatch.js";
import getRedirectionOrDLExpansionMatchingGetter from "./redirectionOrDLExpansionMatchCommon.js";

export const redirectionOrDLExpansionMatcher
    = (ctx: Context) => getRedirectionOrDLExpansionMatchingGetter(ctx, getORNameMatcher);

export default redirectionOrDLExpansionMatcher;

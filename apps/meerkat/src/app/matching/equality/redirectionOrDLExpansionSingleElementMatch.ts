import { oRNameSingleElementMatch } from "./oRNameSingleElementMatch.js";
import type { Context } from "../../types/index.js";
import getRedirectionOrDLExpansionMatchingGetter from "./redirectionOrDLExpansionMatchCommon.js";

export const redirectionOrDLExpansionSingleElementMatcher
    = (ctx: Context) => getRedirectionOrDLExpansionMatchingGetter(ctx, () => oRNameSingleElementMatch);

export default redirectionOrDLExpansionSingleElementMatcher;

import type { Vertex } from "../types/index.js";

/**
 * @summary Determine whether a DSE is a master DSE
 * @description
 *
 * This function takes a DSE and returns a `boolean` indicating whether the
 * DSE is a master DSE.
 * 
 * @param dse The DSE to check
 * @returns `true` if the DSE is a master DSE, `false` otherwise.
 * 
 * @function
 */
export
function isMasterDSE (dse: Vertex): boolean {
    return !!(dse.dse.entry && !dse.dse.shadow);
}

export default isMasterDSE;

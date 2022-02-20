/**
 * @summary Return a fallback value if a function throws
 * @description
 *
 * This function returns a fallback value if the `attempt` function throws.
 *
 * @param attempt The function to attempt
 * @param fallback The fallback value, if the `attempt` function throws
 * @returns Either the return value from the `attempt` function, or the `fallback` value.
 *
 * @function
 */
export
function failover <T, F = undefined> (attempt: () => T, fallback: F): T | F {
    try {
        return attempt();
    } catch {
        return fallback;
    }
}

export default failover;

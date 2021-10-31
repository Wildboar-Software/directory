export
function failover <T, F = undefined> (attempt: () => T, fallback: F): T | F {
    try {
        return attempt();
    } catch {
        return fallback;
    }
}

export default failover;

import { randomInt } from "node:crypto";

let bindingsSinceStart = randomInt(256);

/**
 * The algorithm is simple enough to ensure uniqueness of OB identifiers
 * within a single DSA. We want this identifier to fit in a 64-bit integer.
 * 
 * We start with the Unix timestamp in milliseconds, and we replace the
 * milliseconds with a serial counter, modulo 1000. To be able to create
 * duplicate identifiers, you would have to create 1000 OB identifiers per
 * second, which would get stopped by rate limiting, if it were even possible,
 * and even then, some operational bindings have to be manually approved, so
 * only the auto-approved operational bindings are at risk of doing this.
 * 
 * @returns A new operational binding identifier.
 */
export function getUniqueOpBindingId(): number {
    return (Math.floor(Date.now() / 1000) * 1000) + (bindingsSinceStart++ % 1000);
}

export default getUniqueOpBindingId;

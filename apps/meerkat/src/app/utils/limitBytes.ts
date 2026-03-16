import { TransformStream } from "node:stream/web";

/**
 * @summary A function that limits the size of a response
 * @description
 *
 * This function returns a transform stream that limits the size of a response
 * to the maximum number of bytes specified.
 *
 * @param maxBytes The maximum number of bytes to allow in the response
 * @returns A transform stream that limits the response to the maximum number of bytes
 *
 * @function
 */
export
function limitBytes(maxBytes: number) {
    let total = 0;
    return new TransformStream({
        transform(chunk, controller) {
            total += chunk.byteLength;
            if (total > maxBytes) {
                controller.error(new Error("Response too large"));
                return;
            }
            controller.enqueue(chunk);
        }
    });
}

export default limitBytes;

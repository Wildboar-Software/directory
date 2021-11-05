import type { UUID } from "@wildboar/meerkat-types";

// 992F2AC3-9113-4E91-960A-203A418E57D4
export
function bytesToUUID (bytes: Uint8Array): UUID {
    const buf = Buffer.from(bytes);
    return (
        buf.slice(0, 4).toString("hex") +
        "-" +
        buf.slice(4, 6).toString("hex") +
        "-" +
        buf.slice(6, 8).toString("hex") +
        "-" +
        buf.slice(8, 10).toString("hex") +
        "-" +
        buf.slice(10, 16).toString("hex")
    );
}

export default bytesToUUID;

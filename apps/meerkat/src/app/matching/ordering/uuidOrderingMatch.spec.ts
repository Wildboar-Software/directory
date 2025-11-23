import { uuidOrderingMatch } from "./uuidOrderingMatch.js";
import { DER, _encodeOctetString } from "@wildboar/asn1/functional";

describe("uuidOrderingMatch", () => {
    it("works with unequal UUIDs", () => {
        const a = Buffer.from("e7d13cc6-c5e6-4359-a39a-34f821828a8e".replace(/-/, ""), "hex");
        const b = Buffer.from("60330f57-21cb-4f66-959a-9f88be5ac41d".replace(/-/, ""), "hex");
        const ae = _encodeOctetString(a, DER);
        const be = _encodeOctetString(b, DER);
        expect(uuidOrderingMatch(ae, be)).toBeGreaterThan(0); // Meaning that B comes before A.
    });

    it("works with equal UUIDs", () => {
        const a = Buffer.from("35027d89-fc1a-46e1-8de3-23aee694a49b".replace(/-/, ""), "hex");
        const b = Buffer.from("35027d89-fc1a-46e1-8de3-23aee694a49b".replace(/-/, ""), "hex");
        const ae = _encodeOctetString(a, DER);
        const be = _encodeOctetString(b, DER);
        expect(uuidOrderingMatch(ae, be)).toBe(0); // Meaning that they are equal.
    });
})

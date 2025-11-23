import { recursivelyNormalize } from "./orAddressUtilities.js";

describe("recursivelyNormalize()", () => {
    test("#1", () => {
        const value = {
            asdf: "  \r\n zx  \r\n cv",
            qwer: "yuiop  ",
        };
        const expected = {
            asdf: "ZX CV",
            qwer: "YUIOP",
        };
        expect(recursivelyNormalize(value)).toEqual(expected);
    });
});

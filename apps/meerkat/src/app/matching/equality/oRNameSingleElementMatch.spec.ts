import { extractStrings } from "./oRNameSingleElementMatch";

describe("extractStrings()", () => {
    test("#1", () => {
        const value = {
            asdf: "zxcv",
            qwer: "yuiop",
        };
        const expected: string[] = [ "zxcv", "yuiop" ];
        expect(extractStrings(value)).toEqual(expected);
    });
    test("#2", () => {
        const value = {
            asdf: "zxcv",
            qwer: {
                baz: "foo",
                quux: "baz",
            },
        };
        const expected: string[] = [ "zxcv", "foo", "baz" ];
        expect(extractStrings(value)).toEqual(expected);
    });
});

import { TRUE_BIT, FALSE_BIT } from "@wildboar/asn1";
import {
    Period,
    _encode_Period,
} from "@wildboar/x500/SelectedAttributeTypes";
import { normalizePeriod } from "./normalizePeriod.js";
import { DER } from "@wildboar/asn1/functional";

describe("normalizePeriod", () => {
    it("should normalize very basic period", () => {
        const period1 = new Period(
            undefined,
            {
                bitDay: new Uint8ClampedArray([
                    TRUE_BIT, // sunday
                    FALSE_BIT, // monday
                    TRUE_BIT, // tuesday
                    TRUE_BIT, // wednesday
                    FALSE_BIT, // thursday
                    TRUE_BIT, // friday
                    TRUE_BIT, // saturday
                ]),
            },
            { allWeeks: null },
        );
        const period2 = new Period(
            undefined,
            {
                intDay: [1, 3, 4, 6, 7],
            },
            { allWeeks: null },
        );
        const np1 = normalizePeriod(period1);
        const np2 = normalizePeriod(period2);
        const bytes1 = _encode_Period(np1, DER);
        const bytes2 = _encode_Period(np2, DER);
        expect(bytes1).toEqual(bytes2);
    });
});

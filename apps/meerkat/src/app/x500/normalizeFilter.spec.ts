// import type { Filter } from "@wildboar/x500/DirectoryAbstractService";
// import normalizeFilter from "./normalizeFilter";

describe("normalizeFilter()", () => {

    /**
     * // TODO: Fix these tests.
     * This was originally implemented in the `@wildboar/ldap` package, where it
     * was well-tested, then copied over here and modified almost without
     * modification. All of the tests below should pass. It's just an annoying
     * chore to have to modify the assertions from LDAP to X.500, which isn't a
     * high priority for right now.
     */
    test.todo("fix these tests");

    // it("not{and{x,y,z}} is the same as or{not{x}, not{y}, not{z}}", () => {
    //     const filter: Filter = {
    //         not: {
    //             and: [
    //                 {
    //                     present: new Uint8Array([ "x".charCodeAt(0) ]),
    //                 },
    //                 {
    //                     present: new Uint8Array([ "y".charCodeAt(0) ]),
    //                 },
    //                 {
    //                     present: new Uint8Array([ "z".charCodeAt(0) ]),
    //                 },
    //             ],
    //         },
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("or" in normed).toBeTruthy();
    //     if (!("or" in normed)) {
    //         return;
    //     }
    //     expect(normed.or.length).toBe(3);
    //     expect(normed.or.every((sub) => ("not" in sub))).toBeTruthy();
    //     if (!("not" in normed.or[0]) || !("not" in normed.or[1]) || !("not" in normed.or[2])) {
    //         return;
    //     }
    //     const ornot0 = normed.or[0].not;
    //     const ornot1 = normed.or[1].not;
    //     const ornot2 = normed.or[2].not;
    //     expect(("present" in ornot0) && (ornot0.present[0] === "x".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in ornot1) && (ornot1.present[0] === "y".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in ornot2) && (ornot2.present[0] === "z".charCodeAt(0))).toBeTruthy();
    // });

    // it("not{or{x,y,z}} is the same as and{not{x}, not{y}, not{z}}", () => {
    //     const filter: Filter = {
    //         not: {
    //             or: [
    //                 {
    //                     present: new Uint8Array([ "x".charCodeAt(0) ]),
    //                 },
    //                 {
    //                     present: new Uint8Array([ "y".charCodeAt(0) ]),
    //                 },
    //                 {
    //                     present: new Uint8Array([ "z".charCodeAt(0) ]),
    //                 },
    //             ],
    //         },
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("and" in normed).toBeTruthy();
    //     if (!("and" in normed)) {
    //         return;
    //     }
    //     expect(normed.and.every((sub) => ("not" in sub))).toBeTruthy();
    //     if (!("not" in normed.and[0]) || !("not" in normed.and[1]) || !("not" in normed.and[2])) {
    //         return;
    //     }
    //     const andnot0 = normed.and[0].not;
    //     const andnot1 = normed.and[1].not;
    //     const andnot2 = normed.and[2].not;
    //     expect(("present" in andnot0) && (andnot0.present[0] === "x".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in andnot1) && (andnot1.present[0] === "y".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in andnot2) && (andnot2.present[0] === "z".charCodeAt(0))).toBeTruthy();
    // });

    // it("not{not{x}} is the same as x", () => {
    //     const filter: Filter = {
    //         not: {
    //             not: {
    //                 present: new Uint8Array([ "x".charCodeAt(0) ]),
    //             },
    //         },
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("present" in normed).toBeTruthy();
    //     if (!("present" in normed)) {
    //         return;
    //     }
    //     expect(normed.present[0]).toBe("x".charCodeAt(0));
    // });

    // it("and{and{x,y,z}, p, q} is the same as and{x,y,z,p,q}", () => {
    //     const filter: Filter = {
    //         and: [
    //             {
    //                 and: [
    //                     {
    //                         present: new Uint8Array([ "x".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "y".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "z".charCodeAt(0) ]),
    //                     },
    //                 ],
    //             },
    //             {
    //                 present: new Uint8Array([ "p".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "q".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("and" in normed).toBeTruthy();
    //     if (!("and" in normed)) {
    //         return;
    //     }
    //     expect(normed.and.length).toBe(5);
    //     expect(normed.and.every((sub) => ("present" in sub))).toBeTruthy();
    // });

    // it("or{or{x,y,z}, p, q} is the same as or{x,y,z,p,q}", () => {
    //     const filter: Filter = {
    //         or: [
    //             {
    //                 or: [
    //                     {
    //                         present: new Uint8Array([ "x".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "y".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "z".charCodeAt(0) ]),
    //                     },
    //                 ],
    //             },
    //             {
    //                 present: new Uint8Array([ "p".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "q".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("or" in normed).toBeTruthy();
    //     if (!("or" in normed)) {
    //         return;
    //     }
    //     expect(normed.or.length).toBe(5);
    //     expect(normed.or.every((sub) => ("present" in sub))).toBeTruthy();
    // });

    // it("and{or{x,y,z}, p, q} is the same as or{and{x,p,q}, and{y,p,q}, and{z,p,q}}", () => {
    //     const filter: Filter = {
    //         and: [
    //             {
    //                 or: [
    //                     {
    //                         present: new Uint8Array([ "x".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "y".charCodeAt(0) ]),
    //                     },
    //                     {
    //                         present: new Uint8Array([ "z".charCodeAt(0) ]),
    //                     },
    //                 ],
    //             },
    //             {
    //                 present: new Uint8Array([ "p".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "q".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("or" in normed).toBeTruthy();
    //     if (!("or" in normed)) {
    //         return;
    //     }
    //     expect(normed.or.length).toBe(3);
    //     expect(normed.or.every((sub) => ("and" in sub))).toBeTruthy();
    //     if (!("and" in normed.or[0]) || !("and" in normed.or[1]) || !("and" in normed.or[2])) {
    //         return;
    //     }
    //     const orand0 = normed.or[0].and;
    //     const orand1 = normed.or[1].and;
    //     const orand2 = normed.or[2].and;
    //     expect(orand0.length).toBe(3);
    //     expect(orand1.length).toBe(3);
    //     expect(orand2.length).toBe(3);
    //     // The ordering does not matter here, we just have to check that these elements are present in each subset.
    //     expect(("present" in orand0[0]) && (orand0[0].present[0] === "x".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand0[1]) && (orand0[1].present[0] === "p".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand0[2]) && (orand0[2].present[0] === "q".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand1[0]) && (orand1[0].present[0] === "y".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand1[1]) && (orand1[1].present[0] === "p".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand1[2]) && (orand1[2].present[0] === "q".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand2[0]) && (orand2[0].present[0] === "z".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand2[1]) && (orand2[1].present[0] === "p".charCodeAt(0))).toBeTruthy();
    //     expect(("present" in orand2[2]) && (orand2[2].present[0] === "q".charCodeAt(0))).toBeTruthy();
    // });

    // it("and{and{},x,y,z} is the same as and{x,y,z}", () => {
    //     const filter: Filter = {
    //         and: [
    //             {
    //                 and: [],
    //             },
    //             {
    //                 present: new Uint8Array([ "x".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "y".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "z".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("and" in normed).toBeTruthy();
    //     if (!("and" in normed)) {
    //         return;
    //     }
    //     expect(normed.and.length).toBe(3);
    //     expect(normed.and.every((sub) => ("present" in sub))).toBeTruthy();
    // });

    // it("and{} is TRUE, so that or{and{},x,y,z} is always TRUE", () => {
    //     const filter: Filter = {
    //         or: [
    //             {
    //                 and: [],
    //             },
    //             {
    //                 present: new Uint8Array([ "x".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "y".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "z".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("and" in normed).toBeTruthy();
    //     if (!("and" in normed)) {
    //         return;
    //     }
    //     expect(normed.and.length).toBe(0);
    // });

    // it("or{or{},x,y,z} is the same as or{x,y,z}", () => {
    //     const filter: Filter = {
    //         or: [
    //             {
    //                 or: [],
    //             },
    //             {
    //                 present: new Uint8Array([ "x".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "y".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "z".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("or" in normed).toBeTruthy();
    //     if (!("or" in normed)) {
    //         return;
    //     }
    //     expect(normed.or.length).toBe(3);
    // });

    // it("or{} is FALSE, so that and{or{},x,y,z} is always FALSE", () => {
    //     const filter: Filter = {
    //         and: [
    //             {
    //                 or: [],
    //             },
    //             {
    //                 present: new Uint8Array([ "x".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "y".charCodeAt(0) ]),
    //             },
    //             {
    //                 present: new Uint8Array([ "z".charCodeAt(0) ]),
    //             },
    //         ],
    //     };
    //     const normed = normalizeFilter(filter);
    //     expect("or" in normed).toBeTruthy();
    //     if (!("or" in normed)) {
    //         return;
    //     }
    //     expect(normed.or.length).toBe(0);
    // });
});

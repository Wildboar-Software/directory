import type { Context } from "../types/index.js";
import {
    OperationProgress,
    OperationProgress_nameResolutionPhase_completed,
    OperationProgress_nameResolutionPhase_proceeding,
    TraceItem,
} from "@wildboar/x500/DistributedOperations";
import { Name, RelativeDistinguishedName as RDN, AttributeTypeAndValue } from "@wildboar/x500/InformationFramework";
import { getNamingMatcherGetter } from "../x500/getNamingMatcherGetter.js";
import { compareDistinguishedName, type EqualityMatcher } from "@wildboar/x500";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { commonName, countryName } from "@wildboar/x500/SelectedAttributeTypes";
import { isLoopDetected } from "./isLoopDetected.js";
import { getMockCtx } from "../testing.spec.js";
import { DER } from "@wildboar/asn1/functional";

describe("isLoopDetected", () => {
    it("should return false if the trace is empty", () => {
        const ctx: Context = getMockCtx();
        const trace: TraceItem[] = [];
        const result = isLoopDetected(ctx, trace);
        expect(result).toBe(false);
    });

    it("should return false if the trace has only one item", () => {
        const ctx: Context = getMockCtx();
        const trace: TraceItem[] = [
            new TraceItem(
                {
                    rdnSequence: [
                        [
                            new AttributeTypeAndValue(
                                commonName["&id"],
                                commonName.encoderFor["&Type"]!({ uTF8String: "test" }, DER),
                            ),
                        ]
                    ],
                },
                undefined,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_completed,
                    undefined,
                ),
            ),
        ];
        const result = isLoopDetected(ctx, trace);
        expect(result).toBe(false);
    });

    it("should return true if the trace has two identical trace items", () => {
        const ctx: Context = getMockCtx();
        const traceItem = new TraceItem(
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "test" }, DER),
                        ),
                    ]
                ],
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
        );
        const trace: TraceItem[] = [
            traceItem,
            traceItem,
        ];
        const result = isLoopDetected(ctx, trace);
        expect(result).toBe(true);
    });

    it("should return false if the trace has two extremely similar but different trace items", () => {
        const ctx: Context = getMockCtx();
        const traceItem1 = new TraceItem(
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "test" }, DER),
                        ),
                    ]
                ],
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
        );

        const diffNames: Name[] = [
            {
                rdnSequence: [
                    traceItem1.dsa.rdnSequence[0],
                    traceItem1.dsa.rdnSequence[0],
                ],
            },
            {
                rdnSequence: [
                    [
                        traceItem1.dsa.rdnSequence[0][0],
                        new AttributeTypeAndValue(
                            countryName["&id"],
                            countryName.encoderFor["&Type"]!("US", DER),
                        ),
                    ],
                ],
            },
            {
                rdnSequence: [],
            },
            {
                rdnSequence: [[]],
            },
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "test1" }, DER),
                        ),
                    ],
                ],
            },
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "" }, DER),
                        ),
                    ],
                ],
            },
        ];

        // Ensure different but similar DSA DNs are not detected as loops
        for (const diffName of diffNames) {
            const diffItem = new TraceItem(
                diffName,
                traceItem1.targetObject,
                traceItem1.operationProgress,
            );
            expect(isLoopDetected(ctx, [ traceItem1, diffItem ])).toBe(false);
        }

        // Ensure different but similar target object DNs are not detected as loops
        for (const diffName of diffNames) {
            const diffItem = new TraceItem(
                traceItem1.dsa,
                diffName,
                traceItem1.operationProgress,
            );
            expect(isLoopDetected(ctx, [ traceItem1, diffItem ])).toBe(false);
        }

        const diffByOperationPhase = new TraceItem(
            traceItem1.dsa,
            traceItem1.targetObject,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_proceeding,
                undefined,
            ),
        );
        expect(isLoopDetected(ctx, [ traceItem1, diffByOperationPhase ])).toBe(false);

        const diffByNextRDN = new TraceItem(
            traceItem1.dsa,
            traceItem1.targetObject,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                2,
            ),
        );
        expect(isLoopDetected(ctx, [ traceItem1, diffByNextRDN ])).toBe(false);
    });

    // The attribute values for commonName "test" and "  TEST  " matching,
    // according to the caseIgnoreMatch matching rule.
    it("should return true if the trace has two matching trace items, even though the DNs differ slightly", () => {
        const ctx: Context = getMockCtx();
        const traceItem1 = new TraceItem(
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "test" }, DER),
                        ),
                    ]
                ],
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
        );
        const traceItem2 = new TraceItem(
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "  TEST  " }, DER),
                        ),
                    ]
                ],
            },
            traceItem1.targetObject,
            traceItem1.operationProgress,
        );
        const trace: TraceItem[] = [
            traceItem1,
            traceItem2,
        ];
        const result = isLoopDetected(ctx, trace);
        expect(result).toBe(true);
    });

    // This test should not time out. This is in part to check for DoS vectors.
    it("should return true if bombarded with too many trace similar trace items", () => {
        const ctx: Context = getMockCtx();
        const traceItem1 = new TraceItem(
            {
                rdnSequence: [
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({ uTF8String: "test" }, DER),
                        ),
                    ]
                ],
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
        );
        const trace: TraceItem[] = [];
        for (let i = 0; i < 10000; i++) {
            trace.push(traceItem1);
        }
        const result = isLoopDetected(ctx, trace);
        expect(result).toBe(true);
    });
});
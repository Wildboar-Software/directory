// import type {
//     Context,
//     Vertex,
//     Value,
//     PendingUpdates,
//     AttributeTypeDatabaseDriver,
//     SpecialAttributeDatabaseReader,
//     SpecialAttributeDatabaseEditor,
//     SpecialAttributeDatabaseRemover,
//     SpecialAttributeCounter,
//     SpecialAttributeDetector,
//     SpecialAttributeValueDetector,
// } from "../../types/index.js";
// import { BOOLEAN, TRUE } from "@wildboar/asn1";
// import { DER } from "@wildboar/asn1/functional";
// import {
//     contextAssertionDefaults,
// } from "@wildboar/x500/InformationFramework";
// import {
//     TypeAndContextAssertion,
//     _decode_TypeAndContextAssertion,
//     _encode_TypeAndContextAssertion,
// } from "@wildboar/x500/DirectoryAbstractService";

// export
// const readValues: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     if (!vertex.dse.subentry?.contextAssertionDefaults) {
//         return [];
//     }
//     return vertex.dse.subentry.contextAssertionDefaults.map((cad) => ({
//         type: contextAssertionDefaults["&id"],
//         value: _encode_TypeAndContextAssertion(cad, DER),
//     }));
// };

// export
// const addValue: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     const decoded = _decode_TypeAndContextAssertion(value.value);
//     // const unmarked: BOOLEAN = !!decoded.classList?.[ClassList_unmarked];
//     // const unclassified: BOOLEAN = decoded.classList
//     //     ? !!decoded.classList[ClassList_unclassified]
//     //     : TRUE;
//     // const restricted: BOOLEAN = !!decoded.classList?.[ClassList_restricted];
//     // const confidential: BOOLEAN = !!decoded.classList?.[ClassList_confidential];
//     // const secret: BOOLEAN = !!decoded.classList?.[ClassList_secret];
//     // const topSecret: BOOLEAN = !!decoded.classList?.[ClassList_topSecret];
//     // pendingUpdates.otherWrites.push(ctx.db.clearance.create({
//     //     data: {
//     //         entry_id: vertex.dse.id,
//     //         policy_id: decoded.policyId.toString(),
//     //         unmarked,
//     //         unclassified,
//     //         restricted,
//     //         confidential,
//     //         secret,
//     //         topSecret,
//     //         ClearanceSecurityCategory: {
//     //             createMany: {
//     //                 data: decoded.securityCategories?.map((sc) => ({
//     //                     type: sc.type_.toString(),
//     //                     value: Buffer.from(sc.value.toBytes()),
//     //                 })) ?? [],
//     //             },
//     //         },
//     //         ber: Buffer.from(value.value.toBytes()),
//     //     },
//     // }));
// };

// export
// const removeValue: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     // pendingUpdates.otherWrites.push(ctx.db.clearance.deleteMany({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //         ber: Buffer.from(value.value.toBytes()),
//     //     },
//     // }));
// };

// export
// const removeAttribute: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     // pendingUpdates.otherWrites.push(ctx.db.clearance.deleteMany({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //     },
//     // }));
// };

// export
// const countValues: SpecialAttributeCounter = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<number> => {
//     // return ctx.db.clearance.count({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //     },
//     // });
// };

// export
// const isPresent: SpecialAttributeDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<boolean> => {
// /
// };

// export
// const hasValue: SpecialAttributeValueDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
// ): Promise<boolean> => {
//     // return !!(await ctx.db.clearance.findFirst({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //         ber: Buffer.from(value.value.toBytes()),
//     //     },
//     // }));
// };

// export
// const driver: AttributeTypeDatabaseDriver = {
//     readValues,
//     addValue,
//     removeValue,
//     removeAttribute,
//     countValues,
//     isPresent,
//     hasValue,
// };

// export default driver;

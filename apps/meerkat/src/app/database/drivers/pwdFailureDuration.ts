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
// } from "@wildboar/meerkat-types";
// import { DER, _encodeBoolean } from "asn1-ts/dist/node/functional";
// import {
//     pwdFailureDuration,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";

// export
// const readValues: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.pwdFailureDuration.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value) {
//         return [];
//     }
//     return [
//         {
//             type: pwdFailureDuration["&id"],
//             value: _encodeInteger(value.value, DER),
//         },
//     ];
// };

// export
// const addValue: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdFailureDuration.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             value: value.value.integer,
//         },
//     }));
// };

// export
// const removeValue: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(
//         ctx.db.pwdFailureDuration.deleteMany({
//             where: {
//                 entry_id: vertex.dse.id,
//                 value: value.value.integer,
//             },
//         }),
//     );
// };

// export
// const removeAttribute: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdFailureDuration.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

// export
// const countValues: SpecialAttributeCounter = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     relevantSubentries?: Vertex[],
// ): Promise<number> => {
//     // return ctx.db.entryObjectClass.count({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //     },
//     // });
// };

// export
// const isPresent: SpecialAttributeDetector = async (
//     ctx: Readonly<Context>,
//     entry: Vertex,
//     relevantSubentries?: Vertex[],
// ): Promise<boolean> => {
//     // return true;
// };

// export
// const hasValue: SpecialAttributeValueDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
// ): Promise<boolean> => {

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

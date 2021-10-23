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
// import NOOP from "./NOOP";
// import { DER, _encodeBoolean } from "asn1-ts/dist/node/functional";
// import {
//     pwdFailureTime,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";

// export
// const readValues: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.password.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value?.pwdFailureTime) {
//         return [];
//     }
//     return [
//         {
//             type: pwdStartTime["&id"],
//             value: _encodeGeneralizedTime(value.pwdFailureTime, DER),
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
//     // pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.create({
//     //     data: {
//     //         entry_id: vertex.dse.id,
//     //         object_class: value.value.objectIdentifier.toString(),
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
//     // pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.deleteMany({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //         object_class: value.value.objectIdentifier.toString(),
//     //     },
//     // }));
// };

// export
// const removeAttribute: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     // pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.deleteMany({
//     //     where: {
//     //         entry_id: vertex.dse.id,
//     //     },
//     // }));
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

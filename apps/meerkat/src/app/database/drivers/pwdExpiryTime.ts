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
//     pwdExpiryTime,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";

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
//     if (!value?.pwdExpiryTime) {
//         return [];
//     }
//     return [
//         {
//             type: pwdExpiryTime["&id"],
//             value: _encodeGeneralizedTime(value.pwdExpiryTime, DER),
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
//     pendingUpdates.otherWrites.push(ctx.db.password.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             pwdExpiryTime: value.value.generalizedTime,
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
//     const password = await ctx.db.password.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         select: {
//             pwdExpiryTime: true,
//         },
//     });
//     if (!password) {
//         return; // TODO: Should this throw an error?
//     }
//     if (password.pwdExpiryTime?.valueOf() === value.value.generalizedTime.valueOf()) {
//         pendingUpdates.otherWrites.push(ctx.db.password.updateMany({
//             where: {
//                 entry_id: vertex.dse.id,
//             },
//             data: {
//                 pwdExpiryTime: null,
//             },
//         }));
//     }
// };

// export
// const removeAttribute: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.password.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             pwdExpiryTime: null,
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

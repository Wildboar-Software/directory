// import type {
//     Context,
//     Vertex,
//     Value,
//     AttributeTypeDatabaseDriver,
//     SpecialAttributeDatabaseReader,
//     SpecialAttributeDatabaseEditor,
//     SpecialAttributeDatabaseRemover,
//     SpecialAttributeCounter,
//     SpecialAttributeDetector,
//     SpecialAttributeValueDetector,
// } from "@wildboar/meerkat-types";
// import {
//     BERElement,
//     ObjectIdentifier,
// } from "asn1-ts";
// import { DER } from "asn1-ts/dist/node/functional";
// import {
//     userPwdRecentlyExpired,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
// import {
//     UserPwd,
//     _decode_UserPwd,
//     _encode_UserPwd,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
// import {
//     UserPwd_encrypted,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd-encrypted.ta";
// import {
//     AlgorithmIdentifier,
// } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
// import NOOP from "./NOOP";

// // model Password {
// //     id                       Int       @id @default(autoincrement())
// //     entry_id                 Int
// //     entry                    Entry     @relation(fields: [entry_id], references: [id], onDelete: Cascade)
// //     encrypted                Bytes
// //     algorithm_oid            String // OID
// //     algorithm_parameters_der Bytes?
// //     pwdStartTime             DateTime  @default(now())
// //     pwdExpiryTime            DateTime?
// //     pwdEndTime               DateTime?
// //     pwdFails                 Int       @default(0)
// //     pwdFailureTime           DateTime?
// //     pwdGracesUsed            Int       @default(0)
// //     @@unique([entry_id])
// // }

// export
// const readValues: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const password = await ctx.db.password.findFirst({
//         where: {
//             entry_id: vertex.dse.id,
//             entry: {
//                 PwdExpiryTime: {
//                     some: {
//                         value: {
//                             lte: new Date(),
//                         },
//                     },
//                 } as any, // There's some weird Prisma bug going on here.
//             },
//         },
//     });
//     if (!password) {
//         return [];
//     }
//     const algorithmParametersElement = new BERElement();
//     if (password.algorithm_parameters_der) {
//         algorithmParametersElement.fromBytes(password.algorithm_parameters_der);
//     }
//     const pwd: UserPwd = {
//         encrypted: new UserPwd_encrypted(
//             new AlgorithmIdentifier(
//                 ObjectIdentifier.fromString(password.algorithm_oid),
//                 password.algorithm_parameters_der
//                     ? algorithmParametersElement
//                     : undefined,
//             ),
//             password.encrypted,
//         ),
//     };
//     return [
//         {
//             type: userPwdRecentlyExpired["&id"],
//             value: _encode_UserPwd(pwd, DER),
//         },
//     ];
// };

// export
// const addValue: SpecialAttributeDatabaseEditor = NOOP;

// export
// const removeValue: SpecialAttributeDatabaseEditor = NOOP;

// export
// const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

// export
// const countValues: SpecialAttributeCounter = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<number> => {
//     return ctx.db.password.count({
//         where: {
//             entry_id: vertex.dse.id,
//             pwdExpiryTime: {
//                 lte: new Date(),
//             },
//         },
//     });
// };

// export
// const isPresent: SpecialAttributeDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<boolean> => {
//     return !!(await ctx.db.password.findFirst({
//         where: {
//             entry_id: vertex.dse.id,
//             pwdExpiryTime: {
//                 lte: new Date(),
//             },
//         },
//         select: {
//             id: true,
//         },
//     }));
// };

// export
// const hasValue: SpecialAttributeValueDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
// ): Promise<boolean> => {
//     const decoded = _decode_UserPwd(value.value);
//     if (!("encrypted" in decoded)) {
//         return false;
//     }
//     return !!(await ctx.db.password.findFirst({
//         where: {
//             entry_id: vertex.dse.id,
//             pwdExpiryTime: {
//                 lte: new Date(),
//             },
//             encrypted: Buffer.from(decoded.encrypted.encryptedString),
//             algorithm_oid: decoded.encrypted.algorithmIdentifier.algorithm.toString(),
//             algorithm_parameters_der: decoded.encrypted.algorithmIdentifier.parameters
//                 ? Buffer.from(decoded.encrypted.algorithmIdentifier.parameters.toBytes())
//                 : undefined,
//         },
//         select: {
//             id: true,
//         },
//     }));
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

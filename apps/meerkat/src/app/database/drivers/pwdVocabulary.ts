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
// import {
//     DERElement,
//     ASN1TagClass,
//     ASN1UniversalType,
//     ObjectIdentifier,
// } from "asn1-ts";
// import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
// import {
//     pwdVocabulary,
// } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";

// export
// const readValues: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     relevantSubentries?: Vertex[],
// ): Promise<Value[]> => {
//     // return Array.from(vertex.dse.objectClass)
//     //     .map(ObjectIdentifier.fromString)
//     //     .map((oid) => _encodeObjectIdentifier(oid, DER))
//     //     .map((value): Value => ({
//     //         type: objectClass["&id"]!,
//     //         value,
//     //     }));
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

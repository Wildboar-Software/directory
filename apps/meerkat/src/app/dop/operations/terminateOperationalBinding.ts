// import type { Context } from "../../types";
// import * as errors from "../errors";
// import type {
//     TerminateOperationalBindingArgument,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
// import type {
//     TerminateOperationalBindingArgumentData,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
// import type {
//     TerminateOperationalBindingResult,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";
// import {
//     TerminateOperationalBindingResultData,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResultData.ta";

// export
// async function establishOperationalBinding (
//     ctx: Context,
//     arg: TerminateOperationalBindingArgument,
// ): Promise<TerminateOperationalBindingResult> {
//     const data: TerminateOperationalBindingArgumentData = ("signed" in arg)
//         ? arg.signed.toBeSigned
//         : arg.unsigned;

//     return {
//         unsigned: new TerminateOperationalBindingResultData(

//         ),
//     };
// }

// export default establishOperationalBinding;

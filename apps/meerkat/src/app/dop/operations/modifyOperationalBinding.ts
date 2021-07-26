// import type { Context } from "../../types";
// import type DOPConnection from "../DOPConnection";
// import * as errors from "../errors";
// import type {
//     ModifyOperationalBindingArgument,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgument.ta";
// import type {
//     ModifyOperationalBindingArgumentData,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingArgumentData.ta";
// import type {
//     ModifyOperationalBindingResult,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResult.ta";
// import {
//     ModifyOperationalBindingResultData,
// } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/ModifyOperationalBindingResultData.ta";

// export
// async function modifyOperationalBinding (
//     ctx: Context,
//     arg: ModifyOperationalBindingArgument,
// ): Promise<ModifyOperationalBindingResult> {
//     const data: ModifyOperationalBindingArgumentData = ("signed" in arg)
//         ? arg.signed.toBeSigned
//         : arg.unsigned;

//     return {
//         unsigned: new ModifyOperationalBindingResultData(

//         ),
//     };
// }

// export default modifyOperationalBinding;

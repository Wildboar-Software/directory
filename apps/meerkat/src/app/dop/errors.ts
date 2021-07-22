import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

// operationalBindingError ERROR ::= {
//     PARAMETER OPTIONALLY-PROTECTED-SEQ  {OpBindingErrorParam}
//     CODE      id-err-operationalBindingError }

//   OpBindingErrorParam ::= SEQUENCE {
//     problem            [0]  ENUMERATED {
//       invalidID              (0),
//       duplicateID            (1),
//       unsupportedBindingType (2),
//       notAllowedForRole      (3),
//       parametersMissing      (4),
//       roleAssignment         (5),
//       invalidStartTime       (6),
//       invalidEndTime         (7),
//       invalidAgreement       (8),
//       currentlyNotDecidable  (9),
//       modificationNotAllowed (10),
//       invalidBindingType     (11),
//       invalidNewID           (12),
//       ... },
//     bindingType        [1]  OPERATIONAL-BINDING.&id({OpBindingSet}) OPTIONAL,
//     agreementProposal  [2]  OPERATIONAL-BINDING.&Agreement
//                             ({OpBindingSet}{@bindingType}) OPTIONAL,
//     retryAt            [3]  Time OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF           CommonResultsSeq }

export
class OperationalBindingError extends Error {
    public static readonly errcode: Code = operationalBindingError["&errorCode"]!;
    constructor (readonly message: string, readonly data: typeof operationalBindingError["&ParameterType"]) {
        super(message);
        Object.setPrototypeOf(this, OperationalBindingError.prototype);
    }
}

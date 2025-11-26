import { ASN1Element, INTEGER } from "@wildboar/asn1";
import type {
    AbandonedData,
    AbandonFailedData,
    AttributeErrorData,
    NameErrorData,
    ReferralData,
    SecurityErrorData,
    ServiceErrorData,
    UpdateErrorData,
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    OpBindingErrorParam,
    operationalBindingError,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    ShadowErrorData,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import type {
    InvokeId,
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    id_errcode_abandoned,
    id_errcode_abandonFailed,
    id_errcode_attributeError,
    id_errcode_nameError,
    id_errcode_referral,
    id_errcode_securityError,
    id_errcode_serviceError,
    id_errcode_updateError,
    id_errcode_shadowError,
} from "@wildboar/x500/CommonProtocolSpecification";
import type {
    Abort,
    IdmReject_reason,
} from "@wildboar/x500/IDMProtocolSpecification";

/**
 * @summary A superclass of all errors received from bind operations
 * @description
 *
 * A superclass of all errors received from bind operations
 *
 * @abstract
 * @class
 * @augments Error
 */
export
abstract class BindError extends Error {

    /**
     * @param message An error message
     */
    constructor (
        readonly message: string,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message);
        Object.setPrototypeOf(this, BindError.prototype);
    }

}

/**
 * @summary A superclass of all error types that relate to operation errors in the X.500 directory protocols.
 * @description
 *
 * A superclass of all error types that relate to operation errors in the X.500 directory protocols.
 *
 * @abstract
 * @class
 * @augments Error
 */
export
abstract class DirectoryError extends Error {

    /** The error code */
    public static readonly errcode: Code;

    /** A function for retrieving the error code */
    public abstract getErrCode (): Code;

    constructor (
        message: string,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message);
    }

}

/**
 * @summary A superclass of all error types that relate to transport-layer errors
 * @description
 *
 * Error types that relate to transport-layer errors, such as those indicated
 * by IDM Reject or Abort PDUs, or ISO transport errors.
 *
 * @abstract
 * @class
 * @augments Error
 */
export
abstract class TransportError extends Error {

    constructor(message?: string) {
        super(message);
    }

}

/**
 * @summary A throwable `directoryBindError`
 * @description
 *
 * A throwable error type corresponding to the `directoryBindError` defined in
 * ITU Recommendation X.511 (2016), Section 9.1.1.
 *
 * @class
 * @augments BindError
 */
export
class DirectoryBindError extends BindError {

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: DirectoryBindErrorData,
        readonly shouldBeSigned: boolean = false,
        readonly unbind: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, DirectoryBindError.prototype);
    }

}

export
class DSABindError extends BindError {

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: DirectoryBindErrorData,
        readonly shouldBeSigned: boolean = false,
        readonly unbind: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, DSABindError.prototype);
    }

}

/**
 * @summary A throwable `abandonError`
 * @description
 *
 * A throwable error type corresponding to the `abandonError` defined in
 * ITU Recommendation X.511 (2016), Section 14.3.
 *
 * @class
 * @augments DirectoryError
 */
export
class AbandonError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_abandoned;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: AbandonedData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, AbandonError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return AbandonError.errcode;
    }

}

/**
 * @summary A throwable `abandonFailed`
 * @description
 *
 * A throwable error type corresponding to the `abandonFailed` defined in
 * ITU Recommendation X.511 (2016), Section 14.2.
 *
 * @class
 * @augments DirectoryError
 */
export
class AbandonFailedError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_abandonFailed;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: AbandonFailedData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, AbandonFailedError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return AbandonFailedError.errcode;
    }

}

/**
 * @summary A throwable `attributeError`
 * @description
 *
 * A throwable error type corresponding to the `attributeError` defined in
 * ITU Recommendation X.511 (2016), Section 14.4.
 *
 * @class
 * @augments DirectoryError
 */
export
class AttributeError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_attributeError;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: AttributeErrorData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, AttributeError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return AttributeError.errcode;
    }

}

/**
 * @summary A throwable `nameError`
 * @description
 *
 * A throwable error type corresponding to the `nameError` defined in
 * ITU Recommendation X.511 (2016), Section 14.5.
 *
 * @class
 * @augments DirectoryError
 */
export
class NameError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_nameError;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: NameErrorData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, NameError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return NameError.errcode;
    }

}

/**
 * @summary A throwable `referral`
 * @description
 *
 * A throwable error type corresponding to the `referral` defined in
 * ITU Recommendation X.511 (2016), Section 14.6.
 *
 * @class
 * @augments DirectoryError
 */
export
class ReferralError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_referral;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: ReferralData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, ReferralError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return ReferralError.errcode;
    }

}

/**
 * @summary A throwable `securityError`
 * @description
 *
 * A throwable error type corresponding to the `securityError` defined in
 * ITU Recommendation X.511 (2016), Section 14.7.
 *
 * @class
 * @augments DirectoryError
 */
export
class SecurityError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_securityError;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: SecurityErrorData,
        readonly shouldBeSigned: boolean = false,
        readonly unbind: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, SecurityError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return SecurityError.errcode;
    }

}

/**
 * @summary A throwable `serviceError`
 * @description
 *
 * A throwable error type corresponding to the `serviceError` defined in
 * ITU Recommendation X.511 (2016), Section 14.8.
 *
 * @class
 * @augments DirectoryError
 */
export
class ServiceError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_serviceError;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: ServiceErrorData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, ServiceError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return ServiceError.errcode;
    }

}

/**
 * @summary A throwable `updateError`
 * @description
 *
 * A throwable error type corresponding to the `updateError` defined in
 * ITU Recommendation X.511 (2016), Section 14.9.
 *
 * @class
 * @augments DirectoryError
 */
export
class UpdateError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = id_errcode_updateError;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: UpdateErrorData,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, UpdateError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return UpdateError.errcode;
    }

}

/**
 * @summary A throwable `operationalBindingError`
 * @description
 *
 * A throwable error type corresponding to the `operationalBindingError` defined
 * in ITU Recommendation X.501 (2016), Section 28.5.
 *
 * @class
 * @augments DirectoryError
 */
export
class OperationalBindingError extends DirectoryError {

    /** The error code */
    public static readonly errcode: Code = operationalBindingError["&errorCode"]!;

    /**
     * @param message The error message
     * @param data The error parameter
     */
    constructor (
        readonly message: string,
        readonly data: OpBindingErrorParam,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message, shouldBeSigned);
        Object.setPrototypeOf(this, OperationalBindingError.prototype);
    }

    /** A function for retrieving the error code */
    public getErrCode (): Code {
        return OperationalBindingError.errcode;
    }

}

/**
 * @summary A throwable `shadowError`
 * @description
 *
 * A throwable error type corresponding to the `shadowError` defined in
 * ITU Recommendation X.525 (2019), Section 12.
 *
 * @class
 * @augments DirectoryError
 */
 export
 class ShadowError extends DirectoryError {

     /** The error code */
     public static readonly errcode: Code = id_errcode_shadowError;

     /**
      * @param message The error message
      * @param data The error parameter
      */
     constructor (
         readonly message: string,
         readonly data: ShadowErrorData,
         readonly shouldBeSigned: boolean = false,
     ) {
         super(message, shouldBeSigned);
         Object.setPrototypeOf(this, ShadowError.prototype);
     }

     /** A function for retrieving the error code */
     public getErrCode (): Code {
         return ShadowError.errcode;
     }

 }

/**
 * @summary Converts a non-thrown error received from a chained operation into a throwable error
 * @description
 *
 * This error does not correspond to any particular error defined in the X.500
 * specifications or elsewhere, but rather, exists as a container for a
 * non-thrown error that is received from a chained operation.
 *
 * @class
 * @augments Error
 */
export
class ChainedError extends Error {

    /**
     * @param message The error message
     * @param error The error parameter
     * @param errcode The error code
     */
    constructor (
        readonly message: string,
        readonly error?: ASN1Element | undefined,
        readonly errcode?: Code | undefined,
        readonly shouldBeSigned: boolean = false,
    ) {
        super(message);
        Object.setPrototypeOf(this, ChainedError.prototype);
    }

}

/**
 * @summary Converts a reject received from a chained operation into a throwable error
 * @description
 *
 * This error does not correspond to any particular error defined in the X.500
 * specifications or elsewhere, but rather, exists as a container for a Reject
 * PDU that is received from a chained operation.
 *
 * @class
 * @augments Error
 */
 export
 class ChainedReject extends Error {

      /**
       * @param invokeId The invokeId of the operation that was rejected
       * @param reason The reason for the Reject
       */
      constructor (
          readonly invokeId: Extract<InvokeId, { present: INTEGER }>["present"],
          readonly reason: IdmReject_reason,
      ) {
          super();
          Object.setPrototypeOf(this, ChainedReject.prototype);
      }

 }

/**
 * @summary Converts an abort received from a chained operation into a throwable error
 * @description
 *
 * This error does not correspond to any particular error defined in the X.500
 * specifications or elsewhere, but rather, exists as a container for an abort
 * PDU that is received from a chained operation.
 *
 * @class
 * @augments Error
 */
export
class ChainedAbort extends Error {

     /**
      * @param reason The reason for the Abort
      */
     constructor (
         readonly reason: Abort,
     ) {
         super();
         Object.setPrototypeOf(this, ChainedAbort.prototype);
     }

}

// Errors based on IDM Reject and Abort reasons
// These are only the errors that the DSA would throw, not those that it might receive.

/**
 * @summary A throwable error indicating a duplicate InvokeId
 * @description
 *
 * A throwable error indicating a duplicate InvokeId. This corresponds to the
 * IDM `duplicateInvokeIDRequest` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class DuplicateInvokeIdError extends TransportError {}

/**
 * @summary A throwable error indicating an unsupported operation
 * @description
 *
 * A throwable error indicating an unsupported operation. This corresponds to the
 * IDM `unsupportedOperationRequest` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class UnsupportedOperationError extends TransportError {}

/**
 * @summary A throwable error indicating an unknown operation
 * @description
 *
 * A throwable error indicating an unknown operation. This corresponds to the
 * IDM `unknownOperationRequest` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class UnknownOperationError extends TransportError {}

/**
 * @summary A throwable error indicating a mistyped PDU
 * @description
 *
 * A throwable error indicating a mistyped PDU. This corresponds to the
 * IDM `mistypedPDU` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class MistypedPDUError extends TransportError {}

/**
 * @summary A throwable error indicating a mistyped argument
 * @description
 *
 * A throwable error indicating a mistyped argument. This corresponds to the
 * IDM `mistypedArgumentRequest` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class MistypedArgumentError extends TransportError {}

/**
 * @summary A throwable error indicating a resource limitation
 * @description
 *
 * A throwable error indicating a resource limitation. This corresponds to the
 * IDM `resourceLimitationRequest` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class ResourceLimitationError extends TransportError {}

/**
 * @summary A throwable error indicating an unknown error
 * @description
 *
 * A throwable error indicating an unknown error. This corresponds to the
 * IDM `unknownError` reject reason defined in ITU Recommendation
 * X.519 (2016), Section 9.4.
 *
 * @class
 * @augments TransportError
 */
export class UnknownError extends TransportError {}

/**
 * @summary A throwable error indicating an unbound request
 * @description
 *
 * A throwable error indicating an unbound request. This corresponds to the
 * IDM `mistypedPDU` abort reason defined in ITU Recommendation
 * X.519 (2016), Section 9.5.
 *
 * @class
 * @augments TransportError
 */
export class UnboundRequestError extends TransportError {}

/**
 * @summary A throwable error indicating an invalid protocol
 * @description
 *
 * A throwable error indicating an invalid protocol. This corresponds to the
 * IDM `invalidProtocol` abort reason defined in ITU Recommendation
 * X.519 (2016), Section 9.5.
 *
 * @class
 * @augments TransportError
 */
export class InvalidProtocolError extends TransportError {}

/**
 * @summary A throwable error that does not specify a reason
 * @description
 *
 * A throwable error that does not specify a reason. This corresponds to the
 * IDM `reasonNotSpecified` abort reason defined in ITU Recommendation
 * X.519 (2016), Section 9.5.
 *
 * @class
 * @augments TransportError
 */
export class ReasonNotSpecifiedError extends TransportError {}

// ConnectionFailedError?

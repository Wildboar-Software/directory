import type {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import type {
    AbandonFailedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonFailedData.ta";
import type {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import type {
    ReferralData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    id_errcode_abandoned,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-abandoned.va";
import {
    id_errcode_abandonFailed,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-abandonFailed.va";
import {
    id_errcode_attributeError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-attributeError.va";
import {
    id_errcode_nameError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-nameError.va";
import {
    id_errcode_referral,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-referral.va";
import {
    id_errcode_securityError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-securityError.va";
import {
    id_errcode_serviceError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-serviceError.va";
import {
    id_errcode_updateError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-updateError.va";
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import { ASN1Element } from "asn1-ts";

export
abstract class DirectoryError extends Error {
    public static readonly errcode: Code;
    public abstract getErrCode (): Code;
}

export
class AbandonError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_abandoned;
    constructor (readonly message: string, readonly data: AbandonedData) {
        super(message);
        Object.setPrototypeOf(this, AbandonError.prototype);
    }
    public getErrCode (): Code {
        return AbandonError.errcode;
    }
}

export
class AbandonFailedError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_abandonFailed;
    constructor (readonly message: string, readonly data: AbandonFailedData) {
        super(message);
        Object.setPrototypeOf(this, AbandonFailedError.prototype);
    }
    public getErrCode (): Code {
        return AbandonFailedError.errcode;
    }
}

export
class AttributeError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_attributeError;
    constructor (readonly message: string, readonly data: AttributeErrorData) {
        super(message);
        Object.setPrototypeOf(this, AttributeError.prototype);
    }
    public getErrCode (): Code {
        return AttributeError.errcode;
    }
}

export
class NameError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_nameError;
    constructor (readonly message: string, readonly data: NameErrorData) {
        super(message);
        Object.setPrototypeOf(this, NameError.prototype);
    }
    public getErrCode (): Code {
        return NameError.errcode;
    }
}

export
class ReferralError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_referral;
    constructor (readonly message: string, readonly data: ReferralData) {
        super(message);
        Object.setPrototypeOf(this, ReferralError.prototype);
    }
    public getErrCode (): Code {
        return ReferralError.errcode;
    }
}

export
class SecurityError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_securityError;
    constructor (readonly message: string, readonly data: SecurityErrorData) {
        super(message);
        Object.setPrototypeOf(this, SecurityError.prototype);
    }
    public getErrCode (): Code {
        return SecurityError.errcode;
    }
}

export
class ServiceError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_serviceError;
    constructor (readonly message: string, readonly data: ServiceErrorData) {
        super(message);
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
    public getErrCode (): Code {
        return ServiceError.errcode;
    }
}

export
class UpdateError extends DirectoryError {
    public static readonly errcode: Code = id_errcode_updateError;
    constructor (readonly message: string, readonly data: UpdateErrorData) {
        super(message);
        Object.setPrototypeOf(this, UpdateError.prototype);
    }
    public getErrCode (): Code {
        return UpdateError.errcode;
    }
}

export
class OperationalBindingError extends DirectoryError {
    public static readonly errcode: Code = operationalBindingError["&errorCode"]!;
    constructor (readonly message: string, readonly data: typeof operationalBindingError["&ParameterType"]) {
        super(message);
        Object.setPrototypeOf(this, OperationalBindingError.prototype);
    }
    public getErrCode (): Code {
        return OperationalBindingError.errcode;
    }
}

export
class ChainedError extends Error {
    constructor (
        readonly message: string,
        readonly error?: ASN1Element,
        readonly errcode?: Code,
    ) {
        super(message);
        Object.setPrototypeOf(this, ChainedError.prototype);
    }
}

export
class UnknownOperationError extends Error {
    constructor (message?: string) {
        super(message ?? "Unknown operation.");
        Object.setPrototypeOf(this, UnknownOperationError.prototype);
    }
}

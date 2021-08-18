import type { Context } from "./types";
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
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
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
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    UpdateProblem_namingViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import findEntry from "./x500/findEntry";
import getDistinguishedName from "./x500/getDistinguishedName";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { unpackBits } from "asn1-ts";
import { randomBytes } from "crypto";

// ReferralError

export
class AbandonError extends Error {
    public static readonly errcode: Code = id_errcode_abandoned;
    constructor (readonly message: string, readonly data: AbandonedData) {
        super(message);
        Object.setPrototypeOf(this, AbandonError.prototype);
    }
}

export
class AbandonFailedError extends Error {
    public static readonly errcode: Code = id_errcode_abandonFailed;
    constructor (readonly message: string, readonly data: AbandonFailedData) {
        super(message);
        Object.setPrototypeOf(this, AbandonFailedError.prototype);
    }
}

export
class AttributeError extends Error {
    public static readonly errcode: Code = id_errcode_attributeError;
    constructor (readonly message: string, readonly data: AttributeErrorData) {
        super(message);
        Object.setPrototypeOf(this, AttributeError.prototype);
    }
}

export
class NameError extends Error {
    public static readonly errcode: Code = id_errcode_nameError;
    constructor (readonly message: string, readonly data: NameErrorData) {
        super(message);
        Object.setPrototypeOf(this, NameError.prototype);
    }
}

export
class ReferralError extends Error {
    public static readonly errcode: Code = id_errcode_referral;
    constructor (readonly message: string, readonly data: ReferralData) {
        super(message);
        Object.setPrototypeOf(this, ReferralError.prototype);
    }
}

export
class SecurityError extends Error {
    public static readonly errcode: Code = id_errcode_securityError;
    constructor (readonly message: string, readonly data: SecurityErrorData) {
        super(message);
        Object.setPrototypeOf(this, SecurityError.prototype);
    }
}

export
class ServiceError extends Error {
    public static readonly errcode: Code = id_errcode_serviceError;
    constructor (readonly message: string, readonly data: ServiceErrorData) {
        super(message);
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}

export
class UpdateError extends Error {
    public static readonly errcode: Code = id_errcode_updateError;
    constructor (readonly message: string, readonly data: UpdateErrorData) {
        super(message);
        Object.setPrototypeOf(this, UpdateError.prototype);
    }
}

export
class OperationalBindingError extends Error {
    public static readonly errcode: Code = operationalBindingError["&errorCode"]!;
    constructor (readonly message: string, readonly data: typeof operationalBindingError["&ParameterType"]) {
        super(message);
        Object.setPrototypeOf(this, OperationalBindingError.prototype);
    }
}

export
class UnknownOperationError extends Error {
    constructor (message?: string) {
        super(message ?? "Unknown operation.");
        Object.setPrototypeOf(this, UnknownOperationError.prototype);
    }
}

export
async function objectDoesNotExistErrorData (ctx: Context, soughtName: Name): Promise<NameErrorData> {
    let name: Name = {
        rdnSequence: [ ...soughtName.rdnSequence.slice(0, -1) ],
    };
    let match = await findEntry(ctx, ctx.dit.root, name.rdnSequence);
    while (!match) {
        name = {
            rdnSequence: [ ...name.rdnSequence.slice(0, -1) ],
        };
        match = await findEntry(ctx, ctx.dit.root, name.rdnSequence);
    }
    return new NameErrorData(
        NameProblem_noSuchObject,
        {
            rdnSequence: getDistinguishedName(match),
        },
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export
const CONTEXTS_NOT_ENABLED_ERROR = new ServiceError(
    "Use of contexts was not enabled by the request.",
    new ServiceErrorData(
        ServiceProblem_unavailable,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    ),
);

export
function namingViolationErrorData (attributeTypes: AttributeType[]): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function securityParameters (): SecurityParameters {
    return new SecurityParameters(
        undefined,
        undefined, // DSA name
        {
            generalizedTime: new Date(),
        },
        unpackBits(randomBytes(16)),
        undefined,
        undefined,
        undefined,
        undefined,
    );
}


export
function invalidRequestErrorData (): SecurityErrorData {
    return new SecurityErrorData(
        SecurityProblem_noInformation,
        undefined,
        undefined,
        [],
        new SecurityParameters(
            undefined,
            undefined, // DSA name
            {
                generalizedTime: new Date(),
            },
            unpackBits(randomBytes(16)),
            undefined,
            undefined,
            undefined,
            SecurityError.errcode,
        ),
        undefined,
        undefined,
        undefined,
    );
}

/**
 * This is implemented because the X.500 specifications do not seem to specify
 * a general-purpose "invalid request" error. For a lack thereof, we use a
 * no-information security error.
 *
 * @param message The error message
 * @returns A security error, which is not thrown.
 */
export
function invalidRequestError (message: string): SecurityError {
    return new SecurityError(
        message,
        invalidRequestErrorData(),
    );
}

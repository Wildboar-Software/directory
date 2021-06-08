import type { Context } from "../types";
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
import type {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import type {
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
import nameToString from "@wildboar/x500/src/lib/stringifiers/nameToString";

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
class UnknownOperationError extends Error {
    constructor (message?: string) {
        super(message ?? "Unknown operation.");
        Object.setPrototypeOf(this, UnknownOperationError.prototype);
    }
}

export
function objectDoesNotExistErrorData (ctx: Context, soughtName: Name): NameErrorData {
    let match: Name = {
        rdnSequence: [],
    };
    const matches: Map<string, Name> = new Map();
    let name: Name = {
        rdnSequence: [ ...soughtName.rdnSequence.slice(1) ],
    };
    const definiteParentDN = nameToString(name);
    while (name.rdnSequence.length > 0) {
        matches.set(nameToString(name), name);
        name = {
            rdnSequence: [ ...name.rdnSequence.slice(1) ],
        };
    }
    for (const e of ctx.database.data.entries.values()) {
        const entryDN = nameToString(e.dn);
        if (entryDN === definiteParentDN) {
            match = matches.get(entryDN)!;
            break;
        }
        const potential = matches.get(entryDN);
        if (potential && (potential.rdnSequence.length > match.rdnSequence.length)) {
            match = potential;
        }
    }
    return new NameErrorData(
        NameProblem_noSuchObject,
        match,
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

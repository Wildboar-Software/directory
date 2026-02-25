import type { Buffer } from "node:buffer";
import type { Context, ClientAssociation, Vertex } from "../types/index.js";
import { ServiceError } from "../types/index.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import {
    administrativeRole,
    id_ar_autonomousArea,
    id_ar_serviceSpecificArea,
} from "@wildboar/x500/InformationFramework";
import {
    SearchArgumentData,
    ServiceErrorData,
    ServiceProblem_unwillingToPerform,
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import printInvokeId from "../utils/printInvokeId.js";
import { ObjectIdentifier } from "@wildboar/asn1";
import { getMockCtx } from "../testing.spec.js";

const rule_oid = ObjectIdentifier.fromString("1.2.3.4");

describe("searchRuleCheckProcedure_ii", () => {
    it("should return the search rule if it is valid", async () => {
        const ctx = getMockCtx();
    });
});

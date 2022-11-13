import { IDMConnection } from "@wildboar/idm";
import { create_dap_client } from "./dap";
import { createConnection } from "node:net";
import { rose_transport_from_idm_socket } from "./idm";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "node:assert";
import { DirectoryBindArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    id_idm_dap,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/id-idm-dap.va";

describe("DAP Client", () => {
    it.skip("works", async () => {
        const socket = createConnection({
            host: "localhost",
            port: 4632,
        });
        const idm = new IDMConnection(socket);
        const rose = rose_transport_from_idm_socket(idm);
        const dap = create_dap_client(rose);
        const bind_response = await dap.bind({
            protocol_id: id_idm_dap,
            parameter: new DirectoryBindArgument(undefined, undefined),
        });
        if ("result" in bind_response) {
            expect(bind_response.result.parameter).toBeDefined();
        } else {
            assert(false);
        }
        const response = await dap.read({
            object: {
                rdnSequence: [],
            },
            selection: {
                extraAttributes: {
                    allOperationalAttributes: null,
                },
            },
        });
        if ("result" in response) {
            const resultData = getOptionallyProtectedValue(response.result.parameter);
            return expect(resultData).toBeDefined();
        } else {
            assert(false);
        }
    });
});

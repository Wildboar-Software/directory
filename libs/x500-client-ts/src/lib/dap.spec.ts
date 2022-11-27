import { IDMConnection } from "@wildboar/idm";
import { create_dap_client } from "./dap";
import { createConnection } from "node:net";
import { rose_transport_from_idm_socket } from "./idm";
import { rose_transport_from_itot_stack } from "./itot";
import { create_itot_stack } from "@wildboar/osi-net";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "node:assert";
import {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    id_idm_dap,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/id-idm-dap.va";
import {
    createTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";

describe("DAP Client", () => {
    it.skip("works with IDM transport", async () => {
        const socket = createConnection({
            host: "localhost",
            port: 4632,
        });
        await new Promise((resolve) => socket.on("connect", resolve));
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
            const ctinfo = resultData.entry.information?.find((info) => ("attribute" in info) && (
                info.attribute.type_.isEqualTo(createTimestamp["&id"])
            ));
            assert(ctinfo);
            assert("attribute" in ctinfo);
            const ctattr = ctinfo.attribute;
            const ct = ctattr.values[0];
            console.log(`Root DSE created at ${ct.generalizedTime.toISOString()}`);
            return expect(resultData).toBeDefined();

        } else {
            assert(false);
        }
    });

    it("works with ITOT transport", async () => {
        const socket = createConnection({
            host: "localhost",
            port: 17003,
        });
        await new Promise((resolve) => socket.on("connect", resolve));
        const itot = create_itot_stack(socket, {
            sessionCaller: true,
            transportCaller: true,
        });
        const rose = rose_transport_from_itot_stack(itot);
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
            const ctinfo = resultData.entry.information?.find((info) => ("attribute" in info) && (
                info.attribute.type_.isEqualTo(createTimestamp["&id"])
            ));
            assert(ctinfo);
            assert("attribute" in ctinfo);
            const ctattr = ctinfo.attribute;
            const ct = ctattr.values[0];
            console.log(`Root DSE created at ${ct.generalizedTime.toISOString()}`);
            return expect(resultData).toBeDefined();

        } else {
            assert(false);
        }
    });

    it("works with ITOT transport (2)", async () => {
        const socket = createConnection({
            host: "localhost",
            port: 17003,
        });
        await new Promise((resolve) => socket.on("connect", resolve));
        const itot = create_itot_stack(socket, {
            sessionCaller: true,
            transportCaller: true,
        });
        const rose = rose_transport_from_itot_stack(itot);
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
        const op1_response = await dap.list({
            object: {
                rdnSequence: [],
            },
        });
        if ("result" in op1_response) {
            const resultData = getOptionallyProtectedValue(op1_response.result.parameter);
            assert("listInfo" in resultData);
        } else {
            assert(false);
        }
        const op2_response = await dap.search({
            object: {
                rdnSequence: [],
            },
            subset: "level",
        });
        if ("result" in op2_response) {
            const resultData = getOptionallyProtectedValue(op2_response.result.parameter);
            assert("searchInfo" in resultData);
        } else {
            assert(false);
        }
        const unbind_response = await dap.unbind();
        assert("result" in unbind_response);
    });
});

import { create_itot_stack } from "@wildboar/osi-net";
import { rose_transport_from_itot_stack } from "./rose/itot";
import {
    id_ac_directoryAccessAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import { createConnection } from "node:net";
import { BER } from "asn1-ts/dist/node/functional";
import {
    id_opcode_list,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import {
    _decode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { assert } from "node:console";
import type { MeerkatContext } from "./ctx";

const RUNNING_MEERKAT_DSA_HOST: string = "localhost";
const RUNNING_MEERKAT_DSA_ITOT_PORT: number = 1102;
const HOST = RUNNING_MEERKAT_DSA_HOST;
const PORT = RUNNING_MEERKAT_DSA_ITOT_PORT;

describe("Meerkat DSA ITOT Transport", () => {
    it.skip("works with a real live server", (done) => {
        const tcp = createConnection({
            host: HOST,
            port: PORT,
        }, () => {
            const stack = create_itot_stack(tcp, {
                sessionCaller: true,
                transportCaller: true,
            });
            const rose = rose_transport_from_itot_stack({} as MeerkatContext, stack);
            rose.events.on("bind_result", () => {
                const arg: ListArgument = {
                    unsigned: new ListArgumentData(
                        {
                            rdnSequence: [],
                        },
                    ),
                };
                rose.write_request({
                    invoke_id: {
                        present: 1,
                    },
                    code: id_opcode_list,
                    parameter: _encode_ListArgument(arg, BER),
                });
            });
            rose.events.on("result", (response) => {
                const result = _decode_ListResult(response.parameter);
                const data = getOptionallyProtectedValue(result);
                if ("listInfo" in data) {
                    expect(data.listInfo.subordinates.length).toBeGreaterThan(0);
                } else {
                    assert(false);
                }
                rose.write_unbind();
            });
            stack.transport.outgoingEvents.on("NDISreq", done);
            rose.write_bind({
                protocol_id: id_ac_directoryAccessAC,
                parameter: _encode_DirectoryBindArgument(new DirectoryBindArgument(
                    undefined,
                    undefined,
                ), BER),
            });
        });
    });
});

import {
    AccessPoint, PresentationAddress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    EstablishOperationalBindingArgument,
    _encode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinate.ta";
import {
    HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import * as crypto from "crypto";
import { DERElement } from "asn1-ts";
import {
    IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import {
    Request,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import * as net from "net";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
const { IDMConnection } = require("../../dist/libs/idm/src/index");

const DER = () => new DERElement();

/**
 * Create an operational binding (for testing purposes.)
 */
async function main() {
    const bindingIdentifier: number = crypto.randomInt(2147483648);
    const invokeID: number = crypto.randomInt(2147483648);
    const sup2sub = new SuperiorToSubordinate(
        [],
        undefined,
        undefined,
    );
    const agreement = new HierarchicalAgreement(
        [],
        [],
    );
    const arg: EstablishOperationalBindingArgument = {
        unsigned: new EstablishOperationalBindingArgumentData(
            id_op_binding_hierarchical,
            new OperationalBindingID(
                bindingIdentifier,
                0,
            ),
            new AccessPoint(
                {
                    rdnSequence: [],
                },
                new PresentationAddress(
                    undefined,
                    undefined,
                    undefined,
                    [],
                ),
                [],
            ),
            {
                roleA_initiates: _encode_SuperiorToSubordinate(sup2sub, () => new DERElement()),
            },
            _encode_HierarchicalAgreement(agreement, () => new DERElement()),
            undefined,
            undefined,
        ),
    };
    const socket = net.createConnection({
        host: "localhost",
        port: process.env.IDM_PORT
            ? Number.parseInt(process.env.IDM_PORT, 10)
            : 4632,
    });
    const idm = new IDMConnection(socket);
    { // Bind
        const pdu: IDM_PDU = {
            bind: new IdmBind(
                dop_ip["&id"]!,
                {
                    directoryName: {
                        rdnSequence: [],
                    },
                },
                {
                    directoryName: {
                        rdnSequence: [],
                    },
                },
                _encode_DSABindArgument(new DSABindArgument(
                    {
                        simple: new SimpleCredentials(
                            [],
                            undefined,
                            undefined,
                        ),
                    },
                    undefined, // v1
                ), DER),
            ),
        };
        const encoded = _encode_IDM_PDU(pdu, DER);
        await new Promise((resolve, reject) => {
            idm.events.once("bindError", (err: any) => {
                reject(err.error);
            });
            idm.events.once("bindResult", (result: any) => {
                resolve(result);
            });
            idm.write(encoded.toBytes());
        });
    }

    { // Request HOB
        const pdu: IDM_PDU = {
            request: new Request(
                invokeID,
                {
                    local: 100, // Establish
                },
                _encode_EstablishOperationalBindingArgument(arg, DER),
            ),
        };
        const encoded = _encode_IDM_PDU(pdu, DER);
        const result = await new Promise((resolve) => {
            idm.events.once(invokeID.toString(), (result: any) => {
                resolve(result);
            });
            idm.write(encoded.toBytes());
        });
        console.log(result);
    }
}

main();

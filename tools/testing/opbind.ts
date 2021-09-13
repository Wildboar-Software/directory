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
import { ASN1Construction, ASN1TagClass, ASN1UniversalType, DERElement, OBJECT_IDENTIFIER } from "asn1-ts";
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
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    countryName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import {
    SubentryInfo,
    Vertex,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/Vertex.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import * as net from "net";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
const { IDMConnection } = require("../../dist/libs/idm/src/index");
import { DER } from "asn1-ts/dist/node/functional";

const US = new AttributeTypeAndValue(
    countryName["&id"],
    new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.printableString,
        "US",
    ),
);

const utf = (str: string) => new DERElement(
    ASN1TagClass.universal,
    ASN1Construction.primitive,
    ASN1UniversalType.utf8String,
    str,
);

const oid = (oid: OBJECT_IDENTIFIER) => new DERElement(
    ASN1TagClass.universal,
    ASN1Construction.primitive,
    ASN1UniversalType.objectIdentifier,
    oid,
);

const cn = (str: string) => new AttributeTypeAndValue(
    commonName["&id"],
    utf(str),
);

/**
 * Create an operational binding (for testing purposes.)
 */
async function main() {
    const bindingIdentifier: number = crypto.randomInt(2147483648);
    const invokeID: number = crypto.randomInt(2147483648);
    const sup2sub = new SuperiorToSubordinate(
        [
            new Vertex(
                [US],
                [
                    new Attribute(
                        administrativeRole["&id"],
                        [
                            oid(id_ar_autonomousArea),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        accessControlScheme["&id"],
                        [
                            oid(basicAccessControlScheme),
                        ],
                        undefined,
                    ),
                ],
                [
                    new SubentryInfo(
                        [cn("asdf")],
                        [
                            new Attribute(
                                commonName["&id"],
                                [utf("zxcv")],
                                undefined,
                            ),
                        ],
                    ),
                ],
                undefined,
            ),
        ],
        [
            new Attribute(
                commonName["&id"],
                [utf("qwerty")],
                undefined,
            ),
        ],
        undefined,
    );
    const agreement = new HierarchicalAgreement(
        [
            new AttributeTypeAndValue(
                commonName["&id"],
                new DERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    ASN1UniversalType.utf8String,
                    "bigboi",
                ),
            ),
        ],
        [
            [
                US,
            ],
        ],
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
                roleA_initiates: _encode_SuperiorToSubordinate(sup2sub, DER),
            },
            _encode_HierarchicalAgreement(agreement, DER),
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

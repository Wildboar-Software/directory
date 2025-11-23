import {
    AccessPoint, PresentationAddress,
} from "@wildboar/x500/DistributedOperations";
import {
    EstablishOperationalBindingArgument,
    _encode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    SuperiorToSubordinate,
    _encode_SuperiorToSubordinate,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    HierarchicalAgreement,
    _encode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import * as crypto from "crypto";
import { ASN1Construction, ASN1TagClass, ASN1UniversalType, DERElement, ObjectIdentifier, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    IdmBind,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    Request,
} from "@wildboar/x500/IDMProtocolSpecification";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/DistributedOperations";
import {
    SimpleCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    administrativeRole,
} from "@wildboar/x500/InformationFramework";
import {
    accessControlScheme,
} from "@wildboar/x500/BasicAccessControl";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/InformationFramework";
import {
    basicAccessControlScheme,
} from "@wildboar/x500/BasicAccessControl";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import {
    commonName,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    countryName,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    SubentryInfo,
    Vertex,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import * as net from "net";
import { dop_ip } from "@wildboar/x500/DirectoryIDMProtocols";
const { IDMConnection } = require("../../dist/libs/idm/src/index");
import { DER } from "@wildboar/asn1/functional";
import { objectClass } from "@wildboar/x500/InformationFramework";
import {
    applicationProcess,
} from "@wildboar/x500/SelectedObjectClasses";

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
            new Attribute(
                objectClass["&id"],
                [oid(applicationProcess["&id"]!)],
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
                    "qwerty",
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
        port: process.env.MEERKAT_IDM_PORT
            ? Number.parseInt(process.env.MEERKAT_IDM_PORT, 10)
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

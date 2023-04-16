import type { Connection, Context } from "../../types";
import { DER } from "asn1-ts/dist/node/functional";
import destringifyDN from "../../utils/destringifyDN";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import { AccessPoint, _encode_AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { PresentationAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { addSeconds } from "date-fns";
import { ASN1Construction, ASN1TagClass, DERElement, ObjectIdentifier, unpackBits } from "asn1-ts";
import { randomBytes, sign, createSign } from "crypto";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { getAlgorithmInfoFromKey } from "../../crypto/getAlgorithmInfoFromKey";
import printError from "../../printers/Error_";
import { uriToNSAP } from "@wildboar/x500";
import {
    TerminateOperationalBindingArgumentData,
    _encode_TerminateOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import {
    TerminateOperationalBindingArgument,
    _encode_TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import {
    terminateOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/terminateOperationalBinding.oa";

export
async function do_terminate (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    if (!conn.certPath || !conn.signingKey) {
        throw new Error("You must provide a certification path and signing key in the configuration file.");
    }
    if (!conn.called_ae_title) {
        throw new Error("You must associate an AE-Title with the DSA in the configuration file.");
    }
    if (!Array.isArray(argv["naddr"]) || (argv["naddr"].length === 0)) {
        throw new Error("You must specify at least one network address for the DSA with which the operational binding should be terminated.");
    }
    const alg_info = getAlgorithmInfoFromKey(conn.signingKey);
    if (!alg_info) {
        throw new Error("Could not determine a signing algorithm for your private key.");
    }
    const [ sig_alg_id, hash_str ] = alg_info;

    const relayTo = new AccessPoint(
        {
            rdnSequence: destringifyDN(ctx, argv["ae-title"]),
        },
        new PresentationAddress(
            (typeof argv["p-selector"] === "string")
                ? Buffer.from(argv["p-selector"], "hex")
                : undefined,
            (typeof argv["s-selector"] === "string")
                ? Buffer.from(argv["s-selector"], "hex")
                : undefined,
            (typeof argv["t-selector"] === "string")
                ? Buffer.from(argv["t-selector"], "hex")
                : undefined,
            argv["naddr"].map((naddr: string) => uriToNSAP(naddr, naddr.toLowerCase().startsWith("itot"))),
        ),
        undefined, // Protocol information unsupported.
    );
    const relayToElement = _encode_AccessPoint(relayTo, DER);
    const relayToOuterElement = new DERElement();
    relayToOuterElement.tagClass = ASN1TagClass.private;
    relayToOuterElement.construction = ASN1Construction.constructed;
    relayToOuterElement.tagNumber = 0;
    relayToOuterElement.value = relayToElement.toBytes();

    const sp = new SecurityParameters(
        conn.certPath,
        conn.called_ae_title,
        {
            generalizedTime: addSeconds(new Date(), 60),
        },
        unpackBits(randomBytes(4)),
        ProtectionRequest_signed,
        establishOperationalBinding["&operationCode"]!,
        ErrorProtectionRequest_signed,
    );
    const data = new TerminateOperationalBindingArgumentData(
        ObjectIdentifier.fromString(argv["binding-type"]),
        new OperationalBindingID(
            Number.parseInt(argv["binding-id"], 10),
            1,
        ),
        undefined,
        argv["at"]
            ? { generalizedTime: new Date(argv["at"]) }
            : undefined,
        sp,
        [ // This allows Meerkat DSA's relayed operational bindings.
            relayToOuterElement,
        ],
    );
    const data_bytes = _encode_TerminateOperationalBindingArgumentData(data, DER).toBytes();
    let arg!: TerminateOperationalBindingArgument;
    if (hash_str) {
        const signer = createSign(hash_str);
        signer.update(data_bytes);
        const signature = signer.sign(conn.signingKey);
        arg = {
            signed: new SIGNED(
                data,
                sig_alg_id,
                unpackBits(signature),
                undefined,
                undefined,
            ),
        };
    } else {
        const signature = sign(null, data_bytes, conn.signingKey);
        arg = {
            signed: new SIGNED(
                data,
                sig_alg_id,
                unpackBits(signature),
                undefined,
                undefined,
            ),
        };
    }
    const outcome = await conn.writeOperation({
        opCode: terminateOperationalBinding["&operationCode"]!,
        argument: _encode_TerminateOperationalBindingArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    ctx.log.info("Operational binding terminated.");
}

export default do_terminate;

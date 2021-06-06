import { Context, Entry } from "./types";
import * as net from "net";
import { IdmBind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
// import { v4 as uuidv4 } from "uuid";
// import ono from "@jsdevtools/ono";
// import moment from "moment";
// import eol from "eol"
// import i18n from "i18next";
// import osLocale from "os-locale";
// import isDebugging from "is-debugging";
import { IDMConnection } from "@wildboar/idm";
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import DAPConnection from "./dap/DAPConnection";
import {
    // DirectoryBindArgument,
    _decode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
// import type { Request } from "@wildboar/x500/src/lib/modules/modules/IDMProtocolSpecification/Request.ta";
import objectClassFromInformationObject from "./x500/objectClassFromInformationObject";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { v4 as uuid } from "uuid";

const DEFAULT_TCP_PORT: number = 4632;

export default
async function main (): Promise<void> {
    const rootID = uuid();
    const rootDSE: Entry = {
        id: rootID,
        dn: "",
    };
    const ctx: Context = {
        log: console,
        database: {
            data: {
                entries: new Map([
                    [ rootID, rootDSE ],
                ]),
                values: [],
            },
        },
        structuralObjectClassHierarchy: {
            ...objectClassFromInformationObject(top),
            parent: undefined,
            children: [],
        },
        objectClasses: new Map([]),
        attributes: new Map([]),
    };
    const server = net.createServer((c) => {
        console.log("client connected");
        const idm = new IDMConnection(c); // eslint-disable-line
        // let dap: DAPConnection | undefined;

        idm.events.on("bind", (idmBind: IdmBind) => {
            if (idmBind.protocolID.toString() === dap_ip["&id"]?.toString()) {
                const dba = _decode_DirectoryBindArgument(idmBind.argument);
                new DAPConnection(ctx, idm, dba); // eslint-disable-line
            } else {
                console.log(`Unsupported protocol: ${idmBind.protocolID.toString()}.`);
            }
        });

        idm.events.on("unbind", () => {
            c.end();
        });

        // idm.events.on("unbind", () => {
        //     dap = undefined;
        // });
    });
    server.on("error", (err) => {
        throw err;
    });

    const port = process.env.PORT
      ? Number.parseInt(process.env.PORT, 10)
      : DEFAULT_TCP_PORT;

    server.listen(port, () => {
        console.log("server bound");
    });
}

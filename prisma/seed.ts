import { PrismaClient, Knowledge, OperationalBindingInitiator } from "@prisma/client";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";

export
function rdnToJson (rdn: RDN): Record<string, string> {
    return Object.fromEntries(
        rdn.map((atav) => [ atav.type_.toString(), "#" + Buffer.from(atav.value.toBytes()).toString("hex") ]),
    );
}

const prisma = new PrismaClient();

export
async function seed () {
    // await prisma.dIT.create({
    //     data: {
    //         id: 1,
    //         name: "Default DIT",
    //         uuid: ""
    //     }
    // })
    // await prisma.entry.create({
    //     data: {
    //         rdn: [],
    //         root: true,
    //         dit_id: 1,
    //     },
    // })
    await prisma.operationalBinding.create({
        data: {
            outbound: false,
            binding_type: id_op_binding_hierarchical.nodes,
            binding_identifier: 1,
            binding_version: 1,
            agreement_ber: Buffer.from([ 0 ]), // FIXME:
            access_point: {
                create: {
                    knowledge_type: Knowledge.OB_REQUEST,
                    ae_title: [],
                    // TODO: ipv4
                    // TODO: tcp_port
                    // TODO: url
                    ber: Buffer.from([ 0 ]),
                },
            },
            initiator: OperationalBindingInitiator.ROLE_A,
            initiator_ber: Buffer.from([ 0 ]),
            validity_start: new Date(),
            validity_end: new Date(2025, 10, 15, 13, 14, 15),
            new_context_prefix_rdn: [],
            immediate_superior: [],
            requested_time: new Date(),
        },
    });
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

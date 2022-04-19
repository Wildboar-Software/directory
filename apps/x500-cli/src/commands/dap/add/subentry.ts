import type { Connection, Context } from "../../../types";
import destringifyDN from "../../../utils/destringifyDN";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "asn1-ts/dist/node/functional";
import do_addEntry from "../add";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts";
import type {
    LocalName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { lexRefinement } from "../../../parsers/parseRefinement";

// subentry OBJECT-CLASS ::= {
//     SUBCLASS OF      {top}
//     KIND             structural
//     MUST CONTAIN     {commonName | subtreeSpecification}
//     LDAP-NAME        {"subentry"}
//     ID               id-sc-subentry }

export
async function do_addEntry_subentry (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const chopsPresent: boolean = ((argv.chopBefore?.length ?? 0) + (argv.chopAfter?.length ?? 0)) > 0;
    const refinement = argv.refinement
        ? lexRefinement(argv.refinement).refinement
        : undefined;
    const ss = new SubtreeSpecification(
        argv.baseName
            ? destringifyDN(ctx, argv.baseName)
            : undefined,
        chopsPresent
            ? [
                ...(argv.chopBefore?.map((c: string) => destringifyDN(ctx, c)) ?? []).map((dn: LocalName) => ({
                    chopBefore: dn,
                })),
                ...(argv.chopAfter?.map((c: string) => destringifyDN(ctx, c)) ?? []).map((dn: LocalName) => ({
                    chopAfter: dn,
                })),
            ]
            : undefined,
        argv.minimum,
        argv.maximum,
        refinement,
    );
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.subentry["&id"]!, DER),
            ],
            undefined,
        ),
        ...[ argv.commonName ]
            .flat()
            .map((value: string) => new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String(value, DER),
                ],
                undefined,
            )),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [
                selat.subtreeSpecification.encoderFor["&Type"]!(ss, DER),
            ],
            undefined,
        ),
    ];
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_subentry;

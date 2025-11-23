import type { Connection, Context } from "../../../types";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import { TRUE_BIT, FALSE_BIT } from "@wildboar/asn1";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/InformationFramework";
import {
    NameAndOptionalUID,
    _encode_NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import destringifyDN from "../../../utils/destringifyDN";
import do_addEntry from "../add";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts";

export
async function do_addEntry_group (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                argv.unique
                    ? _encodeObjectIdentifier(seloc.groupOfUniqueNames["&id"]!, DER)
                    : _encodeObjectIdentifier(seloc.groupOfNames["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"]!,
            [
                _encodeUTF8String(argv.cn, DER),
            ],
            undefined,
        ),
        new Attribute(
            argv.unique
                ? selat.uniqueMember["&id"]!
                : selat.member["&id"]!,
            [
                argv.unique
                    ? _encode_NameAndOptionalUID(new NameAndOptionalUID(
                        destringifyDN(ctx, argv.member),
                        (typeof argv.uniqueIdentifier === "string")
                            ? new Uint8ClampedArray(
                                Array.from(argv.uniqueIdentifier)
                                    .map((bit) => bit === "1" ? TRUE_BIT: FALSE_BIT),
                            )
                            : undefined,
                    ), DER)
                    : _encode_RDNSequence(destringifyDN(ctx, argv.member), DER)
            ],
            undefined,
        ),
    ];
    if (argv.description?.length) {
        const values = [ argv.description ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.description["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.seeAlso?.length) {
        const values = [ argv.seeAlso ].flat();
        attributes.push(...values.map((value: string) => {
            const seeAlso = destringifyDN(ctx, value);
            return new Attribute(
                selat.seeAlso["&id"]!,
                [
                    _encode_RDNSequence(seeAlso, DER),
                ],
                undefined,
            );
        }));
    }
    if (argv.businessCategory?.length) {
        const values = [ argv.businessCategory ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.businessCategory["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.organizationName?.length) {
        const values = [ argv.organizationName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.organizationName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.organizationalUnitName?.length) {
        const values = [ argv.organizationalUnitName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.organizationalUnitName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.owner?.length) {
        const values = [ argv.owner ].flat();
        attributes.push(...values.map((value: string) => {
            const owner = destringifyDN(ctx, value);
            return new Attribute(
                selat.owner["&id"]!,
                [
                    _encode_RDNSequence(owner, DER),
                ],
                undefined,
            );
        }));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_group;

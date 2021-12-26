import type { Context, ValuePrinter } from "../types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import attributeFromInformationObject from "./attributeFromInformationObject";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    hierarchyTop,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyTop.oa";
import {
    dseType,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/dseType.oa";
import { ASN1Element, TRUE_BIT } from "asn1-ts";
import stringifyDN from "./stringifyDN";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import * as dseTypes from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/DSEType.ta";

const printObjectClass: ValuePrinter = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const OID: string = value.objectIdentifier.toString();
    const spec = ctx.objectClasses.get(OID);
    if (spec?.name) {
        return `${spec.name} (${OID})`;
    } else {
        return OID;
    }
};

const printDN: ValuePrinter = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const dn = _decode_DistinguishedName(value);
    return stringifyDN(ctx, dn);
};

const printDSEType: ValuePrinter = (
    ctx: Context,
    value: ASN1Element,
): string | undefined => {
    const decoded = dseType.decoderFor["&Type"]!(value);
    const types = {
        root: (decoded[dseTypes.DSEType_root] === TRUE_BIT),
        glue: (decoded[dseTypes.DSEType_glue] === TRUE_BIT),
        cp: (decoded[dseTypes.DSEType_cp] === TRUE_BIT),
        entry: (decoded[dseTypes.DSEType_entry] === TRUE_BIT),
        alias: (decoded[dseTypes.DSEType_alias] === TRUE_BIT),
        subr: (decoded[dseTypes.DSEType_subr] === TRUE_BIT),
        nssr: (decoded[dseTypes.DSEType_nssr] === TRUE_BIT),
        supr: (decoded[dseTypes.DSEType_supr] === TRUE_BIT),
        xr: (decoded[dseTypes.DSEType_xr] === TRUE_BIT),
        admPoint: (decoded[dseTypes.DSEType_admPoint] === TRUE_BIT),
        subentry: (decoded[dseTypes.DSEType_subentry] === TRUE_BIT),
        shadow: (decoded[dseTypes.DSEType_shadow] === TRUE_BIT),
        immSupr: (decoded[dseTypes.DSEType_immSupr] === TRUE_BIT),
        rhob: (decoded[dseTypes.DSEType_rhob] === TRUE_BIT),
        sa: (decoded[dseTypes.DSEType_sa] === TRUE_BIT),
        dsSubentry: (decoded[dseTypes.DSEType_dsSubentry] === TRUE_BIT),
        familyMember: (decoded[dseTypes.DSEType_familyMember] === TRUE_BIT),
        ditBridge: (decoded[dseTypes.DSEType_ditBridge] === TRUE_BIT),
    };
    return Object.entries(types)
        .filter(([ , has ]) => has)
        .map(([ name ]) => name)
        .join(", ");
};

export
function loadAttributeTypes (ctx: Context): void {
    Object.entries(x500at)
        .forEach(([ name, io ]) => {
            const attr = attributeFromInformationObject(io, name);
            ctx.attributes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });

    ctx.attributes.get(objectClass["&id"].toString())!.valuePrinter = printObjectClass;
    ctx.attributes.get(hierarchyParent["&id"].toString())!.valuePrinter = printDN;
    ctx.attributes.get(hierarchyTop["&id"].toString())!.valuePrinter = printDN;
    ctx.attributes.get(dseType["&id"].toString())!.valuePrinter = printDSEType;
}

export default loadAttributeTypes;

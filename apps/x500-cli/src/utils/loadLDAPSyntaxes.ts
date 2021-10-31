import type { Context } from "../types";
import ldapSyntaxFromInformationObject from "./ldapSyntaxFromInformationObject";
import { attributeTypeDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/attributeTypeDescription.oa";
import { bitString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/bitString.oa";
import { boolean_ } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/boolean.oa";
import { countryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryString.oa";
import { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
import { deliveryMethod } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/deliveryMethod.oa";
import { directoryString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/directoryString.oa";
import { dITContentRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dITContentRuleDescription.oa";
import { dITStructureRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dITStructureRuleDescription.oa";
import { enhancedGuide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/enhancedGuide.oa";
import { facsimileTelephoneNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/facsimileTelephoneNr.oa";
import { fax } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/fax.oa";
import { generalizedTime } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/generalizedTime.oa";
import { guide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/guide.oa";
import { ia5String } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ia5String.oa";
import { integer } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/integer.oa";
import { jpeg } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/jpeg.oa";
import { matchingRuleDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/matchingRuleDescription.oa";
import { matchingRuleUseDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/matchingRuleUseDescription.oa";
import { nameAndOptionalUID } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/nameAndOptionalUID.oa";
import { nameFormDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/nameFormDescription.oa";
import { numericString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/numericString.oa";
import { objectClassDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/objectClassDescription.oa";
import { oid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oid.oa";
import { otherMailbox } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/otherMailbox.oa";
import { octetString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/octetString.oa";
import { postalAddr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddr.oa";
import { presentationAddr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/presentationAddr.oa";
import { printableString } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/printableString.oa";
import { subtreeSpec } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/subtreeSpec.oa";
import { telephoneNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNr.oa";
import { telexNr } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telexNr.oa";
import { utcTime } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/utcTime.oa";
import { ldapSyntaxDescription } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/ldapSyntaxDescription.oa";
import { substringAssertion } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/substringAssertion.oa";
import * as decoders from "@wildboar/ldap/src/lib/syntaxDecoders";
import * as encoders from "@wildboar/ldap/src/lib/syntaxEncoders";


export
function loadLDAPSyntaxes (ctx: Context): void {
    [
        attributeTypeDescription,
        bitString,
        boolean_,
        countryString,
        dn,
        deliveryMethod,
        directoryString,
        dITContentRuleDescription,
        dITStructureRuleDescription,
        enhancedGuide,
        facsimileTelephoneNr,
        fax,
        generalizedTime,
        guide,
        ia5String,
        integer,
        jpeg,
        matchingRuleDescription,
        matchingRuleUseDescription,
        nameAndOptionalUID,
        nameFormDescription,
        numericString,
        objectClassDescription,
        oid,
        otherMailbox,
        octetString,
        postalAddr,
        presentationAddr,
        printableString,
        subtreeSpec,
        telephoneNr,
        telexNr,
        utcTime,
        ldapSyntaxDescription,
        substringAssertion,
    ]
        .map(ldapSyntaxFromInformationObject)
        .forEach((syntax) => {
            ctx.ldapSyntaxes.set(syntax.id.toString(), syntax);
        });

    ctx.ldapSyntaxes.get(bitString["&id"]!.toString())!.decoder = decoders.bitString;
    ctx.ldapSyntaxes.get(bitString["&id"]!.toString())!.encoder = encoders.bitString;
    ctx.ldapSyntaxes.get(boolean_["&id"]!.toString())!.decoder = decoders.boolean_;
    ctx.ldapSyntaxes.get(boolean_["&id"]!.toString())!.encoder = encoders.boolean_;
    ctx.ldapSyntaxes.get(countryString["&id"]!.toString())!.decoder = decoders.countryString;
    ctx.ldapSyntaxes.get(countryString["&id"]!.toString())!.encoder = encoders.countryString;
    // ctx.ldapSyntaxes.get(dn["&id"]!.toString())!.decoder = decoders.dn;
    // ctx.ldapSyntaxes.get(dn["&id"]!.toString())!.encoder = encoders.dn;
    ctx.ldapSyntaxes.get(deliveryMethod["&id"]!.toString())!.decoder = decoders.deliveryMethod;
    ctx.ldapSyntaxes.get(deliveryMethod["&id"]!.toString())!.encoder = encoders.deliveryMethod;
    ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!.decoder = decoders.directoryString;
    ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!.encoder = encoders.directoryString;
    // dITContentRuleDescription
    // dITStructureRuleDescription
    // enhancedGuide
    // facsimileTelephoneNr
    // fax
    ctx.ldapSyntaxes.get(generalizedTime["&id"]!.toString())!.decoder = decoders.generalizedTime;
    ctx.ldapSyntaxes.get(generalizedTime["&id"]!.toString())!.encoder = encoders.generalizedTime;
    // guide
    ctx.ldapSyntaxes.get(ia5String["&id"]!.toString())!.decoder = decoders.ia5String;
    ctx.ldapSyntaxes.get(ia5String["&id"]!.toString())!.encoder = encoders.ia5String;
    // integer
    // jpeg
    ctx.ldapSyntaxes.get(jpeg["&id"]!.toString())!.decoder = decoders.jpeg;
    ctx.ldapSyntaxes.get(jpeg["&id"]!.toString())!.encoder = encoders.jpeg;
    // matchingRuleDescription
    // matchingRuleUseDescription
    // nameAndOptionalUID
    // nameFormDescription
    // numericString
    ctx.ldapSyntaxes.get(numericString["&id"]!.toString())!.decoder = decoders.numericString;
    ctx.ldapSyntaxes.get(numericString["&id"]!.toString())!.encoder = encoders.numericString;
    // objectClassDescription
    ctx.ldapSyntaxes.get(oid["&id"]!.toString())!.decoder = decoders.oid;
    ctx.ldapSyntaxes.get(oid["&id"]!.toString())!.encoder = encoders.oid;
    ctx.ldapSyntaxes.get(otherMailbox["&id"]!.toString())!.decoder = decoders.otherMailbox;
    ctx.ldapSyntaxes.get(otherMailbox["&id"]!.toString())!.encoder = encoders.otherMailbox;
    ctx.ldapSyntaxes.get(octetString["&id"]!.toString())!.decoder = decoders.octetString;
    ctx.ldapSyntaxes.get(octetString["&id"]!.toString())!.encoder = encoders.octetString;
    ctx.ldapSyntaxes.get(postalAddr["&id"]!.toString())!.decoder = decoders.postalAddress;
    ctx.ldapSyntaxes.get(postalAddr["&id"]!.toString())!.encoder = encoders.postalAddress;
    // presentationAddr
    ctx.ldapSyntaxes.get(printableString["&id"]!.toString())!.decoder = decoders.printableString;
    ctx.ldapSyntaxes.get(printableString["&id"]!.toString())!.encoder = encoders.printableString;
    // subtreeSpec
    ctx.ldapSyntaxes.get(telephoneNr["&id"]!.toString())!.decoder = decoders.telephoneNumber;
    ctx.ldapSyntaxes.get(telephoneNr["&id"]!.toString())!.encoder = encoders.telephoneNumber;
    // telexNr
    ctx.ldapSyntaxes.get(utcTime["&id"]!.toString())!.decoder = decoders.utcTime;
    ctx.ldapSyntaxes.get(utcTime["&id"]!.toString())!.encoder = encoders.utcTime;
    // ldapSyntaxDescription
    // substringAssertion

    ctx.ldapSyntaxes.set("cn", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("commonName", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("surname", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
    ctx.ldapSyntaxes.set("sn", ctx.ldapSyntaxes.get(directoryString["&id"]!.toString())!);
}

export default loadLDAPSyntaxes;

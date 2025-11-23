import type { Context } from "../types";
import ldapSyntaxFromInformationObject from "./ldapSyntaxFromInformationObject";
import { attributeTypeDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { bitString } from "@wildboar/x500/SelectedAttributeTypes";
import { boolean_ } from "@wildboar/x500/SelectedAttributeTypes";
import { countryString } from "@wildboar/x500/SelectedAttributeTypes";
import { dn } from "@wildboar/x500/SelectedAttributeTypes";
import { deliveryMethod } from "@wildboar/x500/SelectedAttributeTypes";
import { directoryString } from "@wildboar/x500/SelectedAttributeTypes";
import { dITContentRuleDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { dITStructureRuleDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { enhancedGuide } from "@wildboar/x500/SelectedAttributeTypes";
import { facsimileTelephoneNr } from "@wildboar/x500/SelectedAttributeTypes";
import { fax } from "@wildboar/x500/SelectedAttributeTypes";
import { generalizedTime } from "@wildboar/x500/SelectedAttributeTypes";
import { guide } from "@wildboar/x500/SelectedAttributeTypes";
import { ia5String } from "@wildboar/x500/SelectedAttributeTypes";
import { integer } from "@wildboar/x500/SelectedAttributeTypes";
import { jpeg } from "@wildboar/x500/SelectedAttributeTypes";
import { matchingRuleDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { matchingRuleUseDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { nameAndOptionalUID } from "@wildboar/x500/SelectedAttributeTypes";
import { nameFormDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { numericString } from "@wildboar/x500/SelectedAttributeTypes";
import { objectClassDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { oid } from "@wildboar/x500/SelectedAttributeTypes";
import { otherMailbox } from "@wildboar/x500/SelectedAttributeTypes";
import { octetString } from "@wildboar/x500/SelectedAttributeTypes";
import { postalAddr } from "@wildboar/x500/SelectedAttributeTypes";
import { presentationAddr } from "@wildboar/x500/SelectedAttributeTypes";
import { printableString } from "@wildboar/x500/SelectedAttributeTypes";
import { subtreeSpec } from "@wildboar/x500/SelectedAttributeTypes";
import { telephoneNr } from "@wildboar/x500/SelectedAttributeTypes";
import { telexNr } from "@wildboar/x500/SelectedAttributeTypes";
import { utcTime } from "@wildboar/x500/SelectedAttributeTypes";
import { ldapSyntaxDescription } from "@wildboar/x500/SelectedAttributeTypes";
import { substringAssertion } from "@wildboar/x500/SelectedAttributeTypes";
import { syntaxDecoders as decoders } from "@wildboar/ldap";
import { syntaxEncoders as encoders } from "@wildboar/ldap";

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

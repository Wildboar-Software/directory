import type { Context } from "@wildboar/meerkat-types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/country";

// organizationalRole OBJECT-CLASS ::= {
//     SUBCLASS OF   {top}
//     MUST CONTAIN  {commonName}
//     MAY CONTAIN   {description |
//                    LocaleAttributeSet |
//                    organizationalUnitName |
//                    PostalAttributeSet |
//                    preferredDeliveryMethod |
//                    roleOccupant |
//                    seeAlso |
//                    TelecommunicationAttributeSet}
//     LDAP-NAME      {"organizationalRole"}  -- RFC 4519
//     ID            id-oc-organizationalRole }

export
function create (ctx: Context): CommandModule {
    return {
        command: "orgrole <object>",
        describe: "Add an organizational role",
        builder: (yargs) => {
            return yargs
                .positional("object", {
                    type: "string",
                    description: "The object",
                })
                .option("commonName", {
                    alias: "c",
                    type: "array",
                    description: "The common name",
                })
                .option("userPassword", {
                    alias: "u",
                    type: "string",
                    description: "The password for the organization",
                })
                .option("description", {
                    alias: "d",
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "s",
                    type: "array",
                    description: "The name of the state or province",
                })
                .option("streetAddress", {
                    alias: "e",
                    type: "array",
                    description: "The street address",
                })
                .option("physicalDeliveryOfficeName", {
                    alias: "o",
                    type: "array",
                    description: "The name of the physical delivery office",
                })
                .option("postalAddress", {
                    alias: "p",
                    type: "array",
                    description: "The full, multi-line postal address",
                })
                .option("postalCode", {
                    alias: "z",
                    type: "array",
                    description: "The postal code / ZIP code",
                })
                .option("postOfficeBox", {
                    alias: "q",
                    type: "array",
                    description: "The post office box identifier",
                })
                .option("telephoneNumber", {
                    alias: "t",
                    type: "array",
                    description: "The telephone number",
                })
                .option("facsimileTelephoneNumber", {
                    alias: "f",
                    type: "array",
                    description: "The fax number",
                })
                .option("roleOccupant", {
                    alias: "r",
                    type: "array",
                    description: "The distinguished name of a member of this role",
                })
                .demandOption("commonName")
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await addEntry(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;

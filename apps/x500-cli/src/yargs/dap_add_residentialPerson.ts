import type { Context } from "@wildboar/meerkat-types";
import type { CommandModule } from "yargs";
import bind from "../net/bind";
import addEntry from "../commands/dap/add/residentialPerson";

// residentialPerson OBJECT-CLASS ::= {
//     SUBCLASS OF   {person}
//     MUST CONTAIN  {localityName}
//     MAY CONTAIN   {LocaleAttributeSet |
//                    PostalAttributeSet |
//                    preferredDeliveryMethod |
//                    TelecommunicationAttributeSet |
//                    businessCategory}
//     LDAP-NAME     {"residentialPerson"}  -- RFC 4519
//     ID            id-oc-residentialPerson }

export
function create (ctx: Context): CommandModule {
    return {
        command: "resperson <object>",
        describe: "Add a residential person",
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
                .option("surname", {
                    alias: "s",
                    type: "array",
                    description: "The last name of the person",
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
                .option("userPassword", {
                    alias: "u",
                    type: "string",
                    description: "The password for the organization",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "state",
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
                .option("businessCategory", {
                    alias: "b",
                    type: "array",
                    description: "A string identifying the category of the organization",
                })
                .demandOption("commonName")
                .demandOption("surname")
                .demandOption("localityName")
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

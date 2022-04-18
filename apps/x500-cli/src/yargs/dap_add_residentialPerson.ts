import type { Context } from "../types";
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
                    alias: "cn",
                    type: "array",
                    description: "The common name",
                })
                .option("surname", {
                    alias: "sn",
                    type: "array",
                    description: "The last name of the person",
                })
                .option("description", {
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .option("userPassword", {
                    type: "string",
                    description: "The password for the organization",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "st",
                    type: "array",
                    description: "The name of the state or province",
                })
                .option("streetAddress", {
                    type: "array",
                    description: "The street address",
                })
                .option("physicalDeliveryOfficeName", {
                    type: "array",
                    description: "The name of the physical delivery office",
                })
                .option("postalAddress", {
                    type: "array",
                    description: "The full, multi-line postal address",
                })
                .option("postalCode", {
                    type: "array",
                    description: "The postal code / ZIP code",
                })
                .option("postOfficeBox", {
                    type: "array",
                    description: "The post office box identifier",
                })
                .option("telephoneNumber", {
                    type: "array",
                    description: "The telephone number",
                })
                .option("facsimileTelephoneNumber", {
                    type: "array",
                    description: "The fax number",
                })
                .option("businessCategory", {
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

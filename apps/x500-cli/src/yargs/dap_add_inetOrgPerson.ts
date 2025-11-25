import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import addEntry from "../commands/dap/add/inetOrgPerson.js";
import { add_common_add_opts, CommonAddOptions } from "./add_common_add_opts.js";

// inetOrgPerson OBJECT-CLASS ::= {
// 	SUBCLASS OF 	{organizationalPerson}
// 	KIND			structural
// 	MAY CONTAIN		{
// 		audio
//         | businessCategory
//         | carLicense
//         | departmentNumber
//         | displayName
//         | employeeNumber
//         | employeeType
//         | givenName
//         | homeTelephoneNumber
//         | homePostalAddress
//         | initials
//         -- | jpegPhoto
//         | labeledURI
//         | mail
//         | manager
//         | mobileTelephoneNumber
//         | organizationName
//         | pagerTelephoneNumber
//         -- | photo
//         | roomNumber
//         | secretary
//         | uid
//         | userCertificate
//         | uniqueIdentifier
//         | preferredLanguage
//         -- | userSMIMECertificate
//         -- | userPKCS12
// 	}
// 	LDAP-NAME		{"inetOrgPerson"}
// 	LDAP-DESC		"RFC2798: Internet Organizational Person"
// 	ID				{ netscapeDirectory 2 2 }
// }

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, CommonAddOptions> {
    return {
        command: "iop <object>",
        describe: "Add an inet organizational person",
        builder: (yargs) => {
            return add_common_add_opts(yargs
                .positional("object", {
                    type: "string",
                    description: "The object",
                }))
                .option("commonName", {
                    alias: "cn",
                    type: "array",
                    description: "The common name",
                })
                .option("surname", {
                    alias: "s",
                    type: "array",
                    description: "The last name of the person",
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
                    type: "array",
                    description: "The name of the physical delivery office",
                })
                .option("postalAddress", {
                    alias: "p",
                    type: "array",
                    description: "The full, multi-line postal address, where lines are separated by dollar signs '$'.",
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
                .option("userPassword", {
                    alias: "u",
                    type: "string",
                    description: "The password for the organization",
                })
                .option("organizationUnitName", {
                    alias: "o",
                    type: "array",
                    description: "The organizational unit name",
                })
                .option("title", {
                    type: "array",
                    description: "The title of the person within the organization",
                })
                .option("businessCategory", {
                    alias: "b",
                    type: "array",
                    description: "The business category of the person",
                })
                .option("carLicense", {
                    alias: "cl",
                    type: "array",
                    description: "The car license or registration plate",
                })
                .option("departmentNumber", {
                    type: "array",
                    description: "The department identifier",
                })
                .option("displayName", {
                    type: "string", // This attribute is single-valued.
                    description: "The name to display for this user in user interfaces",
                })
                .option("employeeNumber", {
                    type: "string", // This attribute is single-valued.
                    description: "The employee identifier",
                })
                .option("employeeType", {
                    type: "array",
                    description: "The employee identifier",
                })
                .option("givenName", {
                    alias: "gn",
                    type: "array",
                    description: "The first name",
                })
                .option("givenName", {
                    type: "array",
                    description: "The first name",
                })
                .option("homeTelephoneNumber", {
                    alias: "ht",
                    type: "array",
                    description: "The home telephone number",
                })
                .option("homePostalAddress", {
                    alias: "hpa",
                    type: "array",
                    description: "The home postal address, with lines separated by '$'.",
                })
                .option("initials", {
                    alias: "i",
                    type: "array",
                    description: "The initials of the person",
                })
                .option("labeledURI", {
                    alias: "uri",
                    type: "array",
                    description: "Labeled URIs for the person",
                })
                .option("mail", {
                    type: "array",
                    description: "Email addresses",
                })
                .option("manager", {
                    type: "array",
                    description: "Distinguished names of the manager",
                })
                .option("mobileTelephoneNumber", {
                    alias: "mt",
                    type: "array",
                    description: "The mobile telephone number",
                })
                .option("organizationName", {
                    alias: "org",
                    type: "array",
                    description: "The name of the organization to which this person is a member",
                })
                .option("pagerTelephoneNumber", {
                    alias: "pager",
                    type: "array",
                    description: "The pager telephone number",
                })
                .option("roomNumber", {
                    alias: "room",
                    type: "array",
                    description: "The identifier of the room in which this person works",
                })
                .option("secretary", {
                    type: "array",
                    description: "Distinguished names of secretaries that assist this person",
                })
                .option("uid", {
                    type: "array",
                    description: "Login user IDs for this person",
                })
                .option("userCertificate", {
                    alias: "cert",
                    type: "array",
                    description: "The local file path to the X.509 certificate for this person",
                })
                .option("preferredLanguage", {
                    alias: "lang",
                    type: "string",
                    description: "The preferred language of the person",
                })
                .demandOption("commonName")
                .demandOption("surname")
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

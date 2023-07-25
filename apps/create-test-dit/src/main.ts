import { program } from "commander";
import ctx from "./app/ctx";
import bind from "./app/bind";
import { DER, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import createCountries from "./app/create-countries";
import createAdmin from "./app/create-admin";
import { seedUS } from "./app/create-us";
import { seedGB } from "./app/create-gb";
import { seedRU } from "./app/create-ru";
import { seedMoscow } from "./app/create-moscow";
import { adminDN } from "./app/constants";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    countryName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import { _encodePrintableString } from "asn1-ts/dist/node/functional";
import {
    localityName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import { sleep } from "./app/utils";
import seedUN from "./app/create-un";

program.version("1.0.0");

program
  .requiredOption("--accessPoint <ap>", "The access point URL")
  .requiredOption("--profile <prof>", "The profile of the seed to use.")
  .option("-t|--tolerateUnknownProfile", "Whether to return a failing return code if the profile is unknown")
  .option("--single", "Whether to keep all data within a single DSA")
  ;

program.parse(process.argv);
const options = program.opts();

async function main () {
    if (options["single"]) {
        ctx.single = true;
    }
    switch (options["profile"]) {
        case ("root"): {
            const connection = await bind(ctx, options["accessPoint"], [], undefined);
            const { password: adminPassword } = await createAdmin(ctx, connection);
            await connection.close();
            /**
             * We wait just a second for the admin user to be flushed to the
             * database to prevent a race condition where the top level entry
             * creation is attempted before the admin user actually "exists."
             */
            await sleep(3000);
            ctx.log.info(`Created global directory administrator cn=admin with password '${adminPassword}'.`);
            const adminConnection = await bind(ctx, options["accessPoint"], adminDN, adminPassword);
            await createCountries(ctx, adminConnection);
            await seedUN(ctx, adminConnection);
            await seedUS(ctx, adminConnection);
            await adminConnection.close();
            break;
        }
        case ("gb"): {
            const bindDN: DistinguishedName = [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        _encodePrintableString("GB", DER),
                    ),
                ],
            ];
            const password: string = "password4GB";
            const connection = await bind(ctx, options["accessPoint"], bindDN, password);
            await seedGB(ctx, connection);
            await connection.close();
            break;
        }
        case ("ru"): {
            const bindDN: DistinguishedName = [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        _encodePrintableString("RU", DER),
                    ),
                ],
            ];
            const password: string = "password4RU";
            const connection = await bind(ctx, options["accessPoint"], bindDN, password);
            await seedRU(ctx, connection);
            await connection.close();
            break;
        }
        case ("moscow"): {
            const bindDN: DistinguishedName = [
                [
                    new AttributeTypeAndValue(
                        countryName["&id"],
                        _encodePrintableString("RU", DER),
                    ),
                ],
                [
                    new AttributeTypeAndValue(
                        localityName["&id"],
                        _encodeUTF8String("Moscow", DER),
                    ),
                ],
            ];
            const password: string = "password4Moscow";
            const connection = await bind(ctx, options["accessPoint"], bindDN, password);
            await seedMoscow(ctx, connection);
            await connection.close();
            break;
        }
        default: {
            ctx.log.error(`Profile ${options["profile"]} not understood.`);
            if (options["tolerateUnknownProfile"]) {
                process.exit(0);
            } else {
                process.exit(2);
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(666);
    });

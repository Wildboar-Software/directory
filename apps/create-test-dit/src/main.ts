import { program } from "commander";
import ctx from "./app/ctx";
import bind from "./app/bind";
import createCountries from "./app/create-countries";
import createAdmin from "./app/create-admin";
import { adminDN } from "./app/constants";
program.version("1.0.0");

program
  .requiredOption("--accessPoint <ap>", "The access point URL")
  ;

program.parse(process.argv);
const options = program.opts();

async function main () {
    const connection = await bind(ctx, options["accessPoint"], [], undefined);
    const { password: adminPassword } = await createAdmin(ctx, connection);
    await connection.close();
    ctx.log.info(`Created global directory administrator cn=admin with password '${adminPassword}'.`);
    const adminConnection = await bind(ctx, options["accessPoint"], adminDN, adminPassword);
    await createCountries(ctx, adminConnection);
    await adminConnection.close();
}

main();

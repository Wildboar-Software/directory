import { PrismaClient } from "@prisma/client";
import process from "node:process";

const prisma = new PrismaClient();

export
async function seed () {

}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

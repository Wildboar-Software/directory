import { Prisma, PrismaClient } from "@prisma/client";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const prisma = new PrismaClient();


async function main() {
    const gazette_file = path.join(process.cwd(), "data", "zonal", "gazette.csv");
    const boundary_file = path.join(process.cwd(), "data", "zonal", "boundary.csv");
    const gazette_data = await fs.readFile(gazette_file, { encoding: "utf-8" });
    const boundary_data = await fs.readFile(boundary_file, { encoding: "utf-8" });
    await prisma.postalCodesGazetteEntry.createMany({
        data: gazette_data
            .split(/\r?\n/)
            .map((line) => {
                const [ c, st, l, pc ] = line.split(",");
                return {
                    c2c: c,
                    st,
                    locality: l.length > 0 ? l : undefined,
                    postal_code: pc,
                };
            }),
    });
    const ids = await prisma.postalCodesGazetteEntry.findMany({
        select: {
            id: true,
            postal_code: true,
        },
    });
    const pc2id = new Map();
    for (const id of ids) {
        pc2id.set(id.postal_code, id.id);
    }
    const boundary_lines = boundary_data.split(/\r?\n/);
    for (let i = 0; i < boundary_lines.length; i += 10_000) {
        await prisma.postalCodeBoundaryPoints.createMany({
            data: boundary_lines
                .slice(i, i + 10_000)
                .map((line) => {
                    const [ c, st, l, pc, n, e ] = line.split(",");
                    const id = pc2id.get(pc);
                    if (!id) {
                        console.log(pc);
                    }
                    const easting = Number.parseInt(e, 10);
                    const northing = Number.parseInt(n, 10);
                    if (Number.isNaN(easting) || Number.isNaN(northing)) {
                        console.log(c, st, l, pc, n, e);
                        process.exit(1);
                    }
                    return {
                        easting,
                        northing,
                        postal_code_id: id,
                    };
                }),
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

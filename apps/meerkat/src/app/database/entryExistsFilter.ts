import type { Prisma } from "@prisma/client";

export
const entryExistsFilter: Prisma.EntryWhereInput = {
    deleteTimestamp: null,
    OR: [
        {
            expiresTimestamp: null,
        },
        {
            expiresTimestamp: {
                gt: new Date(),
            },
        },
    ],
};

export default entryExistsFilter;

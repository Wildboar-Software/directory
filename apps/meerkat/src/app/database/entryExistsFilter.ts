import type { Prisma } from "@prisma/client";

/**
 * @summary Gets a Prisma filter that returns entries that could appear in results.
 * @description
 * 
 * This MUST be a function, because we have to return the current date every
 * time it is called. This cannot be an object literal.
 * 
 * @returns A Prisma WHERE object that yields entries that could appear in results.
 * 
 * @function
*/
export
const getEntryExistsFilter = (): Prisma.EntryWhereInput => {
    return {
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
};

export default getEntryExistsFilter;

/**
 * @summary Sleeps a specified number of milliseconds
 * @description
 *
 * This function sleeps a specified number of milliseconds. Specifically, it
 * returns a `Promise` that resolves once the sleep is over.
 *
 * @param ms The number of milliseconds to sleep.
 * @returns A promise that resolves once the sleep finishes.
 *
 * @function
 */
export
function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default sleep;

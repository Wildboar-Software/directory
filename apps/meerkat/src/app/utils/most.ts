/**
 * @summary Determine whether most elements of the array satisfy a predicate.
 * @description
 *
 * This function returns true if most elements of an array return `true` when
 * passed into a predicate function given by the `predicate` argument.
 *
 * @param arr The array whose elements are to be evaluated according to the
 *  predicate.
 * @param predicate The function by which to evaluate each element in the array.
 * @returns Whether most elements of the array return a `true` value when
 *  evaluated according to the predicate function.
 *
 * @function
 */
export
function most <T> (arr: T[], predicate: (value: T, index: number) => boolean): boolean {
    let failBudget: number = Math.floor(arr.length / 2);
    for (let i = 0; i < arr.length; i++) {
        if (!predicate(arr[i], i)) {
            failBudget--;
        }
        if (failBudget <= 0) {
            return false;
        }
    }
    return true;
}

export default most;

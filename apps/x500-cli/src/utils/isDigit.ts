/**
 * @summary Whether the character code represents a decimal digit.
 * @description
 *
 * This function determines whether a given character code represents a decimal
 * digit.
 *
 * @param char The character code in question
 * @returns Whether the character code is a decimal digit
 *
 * @function
 */
 export
 function isDigit (char: number): boolean {
     return (
         (char >= 0x30)
         && (char <= 0x39)
     );
 }

 export default isDigit;

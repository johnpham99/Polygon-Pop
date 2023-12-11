/* ----------------------------------  Functions For Board Generation ---------------------------------- */

import {validMoveExists} from './BoardValidation';

/**
 * Generates a board (1D array of size 81) with random numbers [1-5].
 * This function makes sures that there are no matches (3 or more straight vertically/horizontally adjacent cells with the same value).
 * Note: Array size and value range is currently hardcoded. In the future, I plan on making these values player customizable.
 *
 * @returns {number[]} Random 1D Array of size 81 with random numbers [1-5]
 * @see generateValidBoard()
 */
export function generateBoard() {
    const board = Array(81).fill(null)

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
        let bannedValues = new Set()
        let i = r * 9 + c
        if (c > 1 && board[i-1] === board[i-2]) {
            bannedValues.add(board[i-1])
        }
        if (r > 1 && board[i-9] === board[i-18]) {
            bannedValues.add(board[i-9])
        }
        let randomNumber = Math.floor(Math.random() * 5);
        while (bannedValues.has(randomNumber)) {
            randomNumber = Math.floor(Math.random() * 5)
        }
        board[i] = randomNumber
        }
    }
    return board;
}
  
/**
 * Generates a valid board.
 * Valid board means there is at least one move (swapping of 2 adjacent cells) that makes a match.
 *
 * @returns {number[]} Random valid 1D Array of size 81 with random numbers [1-5]
 * @see validMoveExists()
 */
export function generateValidBoard() {
    console.log("generating a valid board")
    let randomBoard = generateBoard()
    while (!validMoveExists(randomBoard)) {
        randomBoard = generateBoard()
    }
    return randomBoard
}
import {inBoard } from './BoardValidation';
import { clearMatch } from './App';

/**
 * Fill in null spaces with non-null elements above them
 *
 * @param {number[]} board - Board immediately after matches were cleared. Null spaces represent empty spaces.
 * @param {Set} emptyCells - Set that contains the indices of the null spaces. (Easier to find where to cascade)
 * @returns {number[]} Board after cascade. Empty spaces should now be on top of non-empty spaces.
 * @see fillIn()
 */
export function cascade(board, emptyCells) {
    let cascadedBoard = board.slice()
    for (const index of emptyCells) {
      if (!(cascadedBoard[index] === null)) continue;
      let curr = index
      while (inBoard(curr)) {
        let search = curr
        while (cascadedBoard[search] === null) {
          search -= 9
          if (!inBoard(search)) break;
        }
        if (!inBoard(search)) break
        cascadedBoard[curr] = cascadedBoard[search]
        cascadedBoard[search] = null
        curr -= 9
      }
    }
    return cascadedBoard
  }
  
  /**
   * Fill in empty spaces with random values. Should be ran after cascade()
   * Note: Another method would be to make it so fill in always results in an active move.
   *  However, this could ruin the game as valid moves would be centered in one area.
   *
   * @param {number[]} board - Board immediately after cascade. Empty spaces are above non-empty spaces.
   * @returns {number[]} Board with null-values replaced with random values.
   * @see cascade()
   */
  export function fillIn(board, numValues) {
    const filledBoard = board.slice()
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let i = r * 9 + c
        if (board[i] === null) {
          let randomNumber = Math.floor(Math.random() * numValues)
          filledBoard[i] = randomNumber
        }
      }
    }
    return filledBoard
  }

/**
 * Find the location of all spaces that need to be cleared (because they are in an active match). 
 *
 * @param {Array} board - Current state of the board. 
 * @returns {Set} Set that contains the indices spaces that should be null spaces.
 * @see clearAllMatches()
 */
export function findAllMatches(board) {
    let clearedCells = new Set()
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let i = r * 9 + c
        clearMatch(i, board, clearedCells)
      }
    }

    return clearedCells
  }

/**
 * Replaces all active matches with null. 
 *
 * @param {number[]} board - Current state of the board. 
 * @param {Set} clearedCells - Set that contains the indices of active matches
 * @returns {number[]} Board after all active matches are replaced with null
 * @see findAllMatches()
 */
export function clearAllMatches(board, clearedCells) {
    let clearedBoard = board.slice()
    clearedCells.forEach(value => clearedBoard[value] = null)
    return clearedBoard
  }
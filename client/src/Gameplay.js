import {inBoard } from './BoardValidation';
import { clearMatch } from './App';

/**
 * Fill in null spaces with non-null elements above them
 *
 * @param {number[]} board - Board immediately after matches were cleared. Null spaces represent empty spaces.
 * @param {Set} emptyCells - Set that contains the indices of the null spaces. (Easier to find where to cascade)
 */
export function cascade(board, emptyCells, numCols) {
    let cascadedBoard = board.slice()
    for (const index of emptyCells) {
      if (!(cascadedBoard[index] === null)) continue;
      let curr = index
      while (inBoard(curr, board)) {
        let search = curr
        while (cascadedBoard[search] === null) {
          search -= numCols
          if (!inBoard(search, board)) break;
        }
        if (!inBoard(search, board)) break
        cascadedBoard[curr] = cascadedBoard[search]
        cascadedBoard[search] = null
        curr -= numCols
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
   */
  export function fillIn(board, numRows, numCols, numValues) {
    const filledBoard = board.slice()
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let i = r * numCols + c
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
 */
export function findAllMatches(board, numRows, numCols) {
    let clearedCells = new Set()
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let i = r * numCols + c
        clearMatch(i, board, clearedCells, numCols)
      }
    }

    return clearedCells
  }

/**
 * Replaces all active matches with null. 
 *
 * @param {number[]} board - Current state of the board. 
 * @param {Set} clearedCells - Set that contains the indices of active matches
 */
export function clearAllMatches(board, clearedCells) {
    let clearedBoard = board.slice()
    clearedCells.forEach(value => clearedBoard[value] = null)
    return clearedBoard
  }
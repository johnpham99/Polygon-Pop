/* ----------------------------------  Functions For Board/Move Validation ---------------------------------- */
/**
 * Determines if there is a valid move on the board. A move is when a player swaps two directly adjacent cells.
 * A move is valid if it results in a match.
 *
 * @param {number[]} board - Current board state
 * @returns {boolean} True if there are no 3 straight vertically/horizontally adjacent cells with the same value
 * @see validMove()
 */
export function validMoveExists(board, numRows, numCols) {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let i = r * numCols + c
        if (validMove(i, "R", board, numCols) || validMove(i, "D", board, numCols)) {
          // console.log(i)
          return true;
        }

      }
    }
    return false;
}
  
/**
 * Determines if a move is valid. A move is being represented as a cell and direction of cell that it is being swapped with.
 *
 * @param {number} i - index of player's first selected cell
 * @param {String} direction - where player is trying to move/swap selected cell ("L" = left, "R" = right, "U" = up, "D" = down)
 * @param {number[]} - current state of the board
 * @returns {boolean} true if given move is valid
 */
export function validMove(i, direction, board, numCols) {
  console.log("inside validMove")
    console.log(numCols)
    const future = board.slice()
    const curr = future[i]
    switch (direction) {
      case "L":
        if (i % numCols === 0) return false
        future[i] = future[i-1]
        future[i-1] = curr
        if (validVerticalMatch(i-1, future, numCols)) return true
        if (validUpMatch(i-1, future, numCols)) return true
        if (validDownMatch(i-1, future, numCols)) return true
        if (validLeftMatch(i-1,future, numCols)) return true
  
        if (validVerticalMatch(i, future, numCols)) return true
        if (validUpMatch(i, future, numCols)) return true
        if (validDownMatch(i, future, numCols)) return true
        if (validRightMatch(i,future, numCols)) return true
        break;
      case "R":
        if ((i + 1) % numCols === 0) return false
        future[i] = future[i+1]
        future[i+1] = curr
        if (validVerticalMatch(i+1, future, numCols)) return true
        if (validRightMatch(i+1, future, numCols)) return true
        if (validUpMatch(i+1, future, numCols)) return true
        if (validDownMatch(i+1, future, numCols)) return true
  
        if (validVerticalMatch(i, future, numCols)) return true
        if (validUpMatch(i, future, numCols)) return true
        if (validDownMatch(i, future, numCols)) return true
        if (validLeftMatch(i,future, numCols)) return true
        break;
      case "U":
        if (i < numCols) return false
        future[i] = future[i-numCols]
        future[i-numCols] = curr
        if (validLeftMatch(i-numCols, future, numCols)) return true
        if (validRightMatch(i-numCols, future, numCols)) return true
        if (validUpMatch(i-numCols, future, numCols)) return true
        if (validHorizontalMatch(i-numCols, future, numCols)) return true
  
        if (validLeftMatch(i, future, numCols)) return true
        if (validRightMatch(i, future, numCols)) return true
        if (validHorizontalMatch(i, future, numCols)) return true
        if (validDownMatch(i,future, numCols)) return true
        break;
      case "D":
        if (i >= board.length - numCols) return false
        future[i] = future[i+numCols]
        future[i+numCols] = curr
        if (validLeftMatch(i+numCols, future, numCols)) return true
        if (validRightMatch(i+numCols, future, numCols)) return true
        if (validDownMatch(i+numCols, future, numCols)) return true
        if (validHorizontalMatch(i+numCols, future, numCols)) return true
  
        if (validLeftMatch(i, future, numCols)) return true
        if (validRightMatch(i, future, numCols)) return true
        if (validHorizontalMatch(i, future, numCols)) return true
        if (validUpMatch(i, future, numCols)) return true
        break;
      default:
        break;
    }
}
  
/**
 * Determines if given index is a valid index with current board.
 * Note: Board is currently hardcoded as an array of 81 (9x9).
 *
 * @param {number} i - given index
 * @returns {boolean} true if index is within bounds
 */
export function inBoard(i, board) {
    return i >= 0 && i < board.length
}
  
/**
 * Determines if cell and it's two left neighbors are the same value.
 * BUG: Currently not checking for wrapping. If beginning of one row and last two of previous row are the same value, should return false.
 * Note: Wrapping is currently being handled in validMove()
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 left neighbors are the same value
 * @see validMove()
 */
export function validLeftMatch(i, board, numCols) {
    if (i % numCols === 0 || i % numCols === 1) return false
    return (inBoard(i-1, board) && inBoard(i-2, board) && board[i] === board[i-1] && board[i] === board[i-2])
}
  
/**
 * Determines if cell and it's two right neighbors are the same value.
 * BUG: Currently not checking for wrapping. If end of one row and first two of next row are the same value, should return false.
 * Note: Wrapping is currently being handled in validMove()
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 right neighbors are the same value
 * @see validMove()
 */
export function validRightMatch(i, board, numCols) {
    if ((i + 1) % numCols === 0 || (i + 2) % numCols === 0) return false
    return (inBoard(i+1, board) && inBoard(i+2, board) && board[i] === board[i+1] && board[i] === board[i+2])    
}
  
/**
 * Determines if cell and it's 2 above neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 above neighbors are the same value
 */
export function validUpMatch(i, board, numCols) {
    return (inBoard(i-numCols, board) && inBoard(i-(numCols*2), board) && board[i] === board[i-numCols] && board[i] === board[i-(numCols*2)])     
}
  
/**
 * Determines if cell and it's 2 below neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 below neighbors are the same value
 */
export function validDownMatch(i, board, numCols) {
    return (inBoard(i+numCols, board) && inBoard(i+(numCols*2), board) && board[i] === board[i+numCols] && board[i] === board[i+(numCols*2)])      
}
  
/**
 * Determines if cell and it's adjacent vertical neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 vertical neighbors are the same value
 */
export function validVerticalMatch(i, board, numCols) {
    return (inBoard(i+numCols, board) && inBoard(i-numCols, board) && board[i] === board[i+numCols] && board[i] === board[i-numCols])    
}

  /**
   * Determines if cell and it's adjacent horizontal neighbors are the same value.
   * BUG: Currently not checking for wrapping. 
   * Note: Wrapping is currently being handled in validMove()
   *
   * @param {number} i - given index
   * @param {number[]} board - current state of board 
   * @returns {boolean} true if cell and it's 2 horizontal neighbors are the same value
   * @see validMove()
   */
export function validHorizontalMatch(i, board, numCols) {
    if (i % numCols === 0 || (i + 1) % numCols === 0) return false
    return (inBoard(i-1, board) && inBoard(i+1, board) && board[i] === board[i-1] && board[i] === board[i+1])    
}
  
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
        if (validMove(i, "R", board) || validMove(i, "D", board)) return true;
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
export function validMove(i, direction, board) {
    const future = board.slice()
    const curr = future[i]
    switch (direction) {
      case "L":
        if (i % 9 === 0) return false
        future[i] = future[i-1]
        future[i-1] = curr
        if (validVerticalMatch(i-1, future)) return true
        if (validUpMatch(i-1, future)) return true
        if (validDownMatch(i-1, future)) return true
        if (validLeftMatch(i-1,future)) return true
  
        if (validVerticalMatch(i, future)) return true
        if (validUpMatch(i, future)) return true
        if (validDownMatch(i, future)) return true
        if (validRightMatch(i,future)) return true
        break;
      case "R":
        if ((i + 1) % 9 === 0) return false
        future[i] = future[i+1]
        future[i+1] = curr
        if (validVerticalMatch(i+1, future)) return true
        if (validRightMatch(i+1, future)) return true
        if (validUpMatch(i+1, future)) return true
        if (validDownMatch(i+1, future)) return true
  
        if (validVerticalMatch(i, future)) return true
        if (validUpMatch(i, future)) return true
        if (validDownMatch(i, future)) return true
        if (validLeftMatch(i,future)) return true
        break;
      case "U":
        if (i < 9) return false
        future[i] = future[i-9]
        future[i-9] = curr
        if (validLeftMatch(i-9, future)) return true
        if (validRightMatch(i-9, future)) return true
        if (validUpMatch(i-9, future)) return true
        if (validHorizontalMatch(i-9, future)) return true
  
        if (validLeftMatch(i, future)) return true
        if (validRightMatch(i, future)) return true
        if (validHorizontalMatch(i, future)) return true
        if (validDownMatch(i,future)) return true
        break;
      case "D":
        if (i >= board.length - 9) return false
        future[i] = future[i+9]
        future[i+9] = curr
        if (validLeftMatch(i+9, future)) return true
        if (validRightMatch(i+9, future)) return true
        if (validDownMatch(i+9, future)) return true
        if (validHorizontalMatch(i+9, future)) return true
  
        if (validLeftMatch(i, future)) return true
        if (validRightMatch(i, future)) return true
        if (validHorizontalMatch(i, future)) return true
        if (validUpMatch(i,future)) return true
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
export function inBoard(i) {
    return i >= 0 && i < 81
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
export function validLeftMatch(i, board) {
    return (inBoard(i-1) && inBoard(i-2) && board[i] === board[i-1] && board[i] === board[i-2])
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
export function validRightMatch(i, board) {
    return (inBoard(i+1) && inBoard(i+2) && board[i] === board[i+1] && board[i] === board[i+2])    
}
  
/**
 * Determines if cell and it's 2 above neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 above neighbors are the same value
 */
export function validUpMatch(i, board) {
    return (inBoard(i-9) && inBoard(i-18) && board[i] === board[i-9] && board[i] === board[i-18])     
}
  
/**
 * Determines if cell and it's 2 below neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 below neighbors are the same value
 */
export function validDownMatch(i, board) {
    return (inBoard(i+9) && inBoard(i+18) && board[i] === board[i+9] && board[i] === board[i+18])      
}
  
/**
 * Determines if cell and it's adjacent vertical neighbors are the same value.
 * Note: Hardcoded for a 9x9 board (array of size 81)
 *
 * @param {number} i - given index
 * @param {number[]} board - current state of board 
 * @returns {boolean} true if cell and it's 2 vertical neighbors are the same value
 */
export function validVerticalMatch(i, board) {
    return (inBoard(i+9) && inBoard(i-9) && board[i] === board[i+9] && board[i] === board[i-9])    
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
export function validHorizontalMatch(i, board) {
    return (inBoard(i-1) && inBoard(i+1) && board[i] === board[i-1] && board[i] === board[i+1])    
}
  
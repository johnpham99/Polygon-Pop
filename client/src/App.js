import { useEffect, useState } from 'react'

function Square({value, onSquareClick, isSelected}) {
  const valueColors = {
    0: '#FFADAD',
    1: '#FFD6A5',
    2: '#FDFFB6',
    3: '#CAFFBF',
    4: '#9BF6FF',
  };

  
  const squareStyle = {
    backgroundColor: isSelected ? 'yellow' : valueColors[value] || 'white',
  };

  return <button className="square" style={squareStyle} onClick = {onSquareClick}>
    {/* {value} */}
  </button>
}

export default function Board() {
  /**
   * 1D Array that keeps track of the values of all squares.
   * Note: Currently, boards are all squares, so an array of size 81 is 9x9 board.
   * @type {number[]}
   */
  const [squares, setSquares] = useState(Array(81).fill(null))

  /**
   * 0 = Player has no cell selected
   * 1 = 1st Cell is Selected
   * @type {number}
   */
  const [state, setState] = useState(0) 

  /**
   * Holds the index of the player's 1st selected cell
   * Value of -1 means player has not selected a cell yet.
   * @type {number}
   * @see {}
   */
  const [selectOne, setSelectOne] = useState(-1)

  /**
   * Holds the value of the player's 1st selected cell
   * @type {number}
   */
  const [selectOneValue, setSelectOneValue] = useState(-1)
  
  useEffect(() => {
    console.log("page launch")
    setSquares(generateValidBoard())
  }, []); 

  function handleClick(i) {
    let nextSquares = squares.slice()
    let selected = i;
    if (state === 0) {
      console.log("1st select: " + squares[i])
      setSelectOne(i)
      setSelectOneValue(squares[i])
      setState(1)
    } else if (state === 1) {
      nextSquares = startMove(nextSquares, selected, selectOne)
      setSquares(nextSquares) 

      // Hacking way to delay rendering....
      // Introduce a delay before calling finishMove
      setTimeout(() => {
        // This will allow the component to render before executing the next step
        setSquares((prevSquares) => {
          // Continue with the rest of the logic
          nextSquares = finishMove(prevSquares, selectOne, selected);
          return nextSquares;
        });
      }, 300); // You can adjust the delay time as needed

      // nextSquares = finishMove(nextSquares, selectOne, selected)
    }
    setSquares(nextSquares)
  }

  function startMove(nextSquares, selected, selectOne) {
    console.log("2nd select:")
    switch(true){
      case selected === selectOne - 1:
        console.log("adjacent cell pressed")
        if (validMove(selectOne, "L", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
        } 
        break;
      case selected === selectOne + 1:
        console.log("adjacent cell pressed")
        if (validMove(selectOne, "R", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
        }
        break;
      case selected === selectOne - 9:
        console.log("adjacent cell pressed")
        if (validMove(selectOne, "U", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
        }
        break;
      case selected === selectOne + 9:
        console.log("adjacent cell pressed")
        if (validMove(selectOne, "D", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
        }
        break;
      case selected === selectOne:
        console.log("same cell pressed")
        nextSquares[selected] = selectOneValue
        break;
      default:
        console.log("pressed invalid cell")
        return nextSquares
    }
    setState(0)
    setSelectOneValue(-1)
    return nextSquares
  }

  function renderSquare(i) {
    return <Square value={squares[i]} onSquareClick={() => handleClick(i)} isSelected={state === 1 && i === selectOne} />
  }

  function renderRow(row) {
    return (
      <div className="board-row">
        {[0,1,2,3,4,5,6,7,8].map((col) => renderSquare(row * 9 + col))}
      </div>
    );
  }

  return(
    <>
      {[0,1,2,3,4,5,6,7,8].map((row) => renderRow(row))}
    </>
  );
}


/* ----------------------------------  Functions For Board Generation + Move Validation ---------------------------------- */

/**
 * Generates a board (1D array of size 81) with random numbers [1-5].
 * This function makes sures that there are no matches (3 or more straight vertically/horizontally adjacent cells with the same value).
 * Note: Array size and value range is currently hardcoded. In the future, I plan on making these values player customizable.
 *
 * @returns {number[]} Random 1D Array of size 81 with random numbers [1-5]
 * @see generateValidBoard()
 */
function generateBoard() {
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
function generateValidBoard() {
  console.log("generating a valid board")
  let randomBoard = generateBoard()
  while (!validMoveExists(randomBoard)) {
    randomBoard = generateBoard()
  }
  return randomBoard
}

/**
 * Determines if there is a valid move on the board. A move is when a player swaps two directly adjacent cells.
 * A move is valid if it results in a match.
 *
 * @param {number[]} board - Current board state
 * @returns {boolean} True if there are no 3 straight vertically/horizontally adjacent cells with the same value
 * @see validMove()
 */
export function validMoveExists(board) {
  console.log("checking if valid move exists")
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let i = r * 9 + c
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
function validMove(i, direction, board) {
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

/* ----------------------------------  Gameplay Functions  ---------------------------------- */

/**
 * Replaces matches with cell at index i with null
 *
 * @param {number} i - given cell index
 * @param {number[]} board - current state of board 
 * @param {Set} clearedCells - set that holds the values of indices needed to be cleared (used to pass into cascade())
 * @returns {number[]} board where matches that include index i are replaced with null
 * @see cascade()
 */
export function clearMatch(i, board, clearedCells) { 
  if (clearedCells === null) {
    clearedCells = new Set()
  }
  if (clearedCells.has(i)) return
  let newBoard = board.slice()
  let u = i
  let d = i
  let l = i
  let r = i
  let sameUp = new Set()
  let sameDown = new Set()
  let sameLeft = new Set()
  let sameRight = new Set()

  while (inBoard(u) && board[u] === board[i]) {
    sameUp.add(u);
    u -= 9
  }
  while (inBoard(d) && board[d] === board[i]) {
    sameDown.add(d)
    d += 9
  }
  while (inBoard(l) && board[l] === board[i]) {
    sameLeft.add(l);
    if (l % 9 === 0) {
      l -= 1
      break
    }
    l -= 1
  }
  while (inBoard(r) && board[r] === board[i]) {
    sameRight.add(r)
    if ((r + 1) % 9 === 0) {
      r += 1 
      break
    }
    r += 1
  }

  if (d - u >= 36) {
    sameUp.forEach(value => clearedCells.add(value))
    sameDown.forEach(value => clearedCells.add(value))
    clearedCells.forEach(value => newBoard[value] = null)
  }

  if (r - l >= 4) {
    sameLeft.forEach(value => clearedCells.add(value))
    sameRight.forEach(value => clearedCells.add(value))
    clearedCells.forEach(value => newBoard[value] = null)
  }
  clearedCells.forEach(value => newBoard[value] = null)
  return newBoard
}

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
export function fillIn(board) {
  const filledBoard = board.slice()
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let i = r * 9 + c
      if (board[i] === null) {
        let randomNumber = Math.floor(Math.random() * 5)
        filledBoard[i] = randomNumber
      }
    }
  }
  return filledBoard
}

/**
 * Find the location of all empty spaces if there are active matches. 
 *
 * @param {Array} board - Current state of the board. 
 * @returns {Set} Set that contains the indices of the null spaces.
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
 * @param {Set} clearedCells - Set that contains the indices of the null spaces.
 * @returns {number[]} Board after all active matches are replaces with null
 * @see findAllMatches()
 */
export function clearAllMatches(board, clearedCells) {
  let clearedBoard = board.slice()
  clearedCells.forEach(value => clearedBoard[value] = null)
  return clearedBoard
}

/**
 * Brings the board to a stable state (no active matches). Typically after player does a valid swap. 
 * Clear Matches / Make Cells Null -> Cascade -> Fill In Empty Spaces -> Clear Active Matches, Cascade, and Fill In until there is no active matches (stable)
 * Regenerates board if stable state does not have a valid move.
 *
 * @param {number[]} board - Current state of the board. 
 * @param {number} selectOne - Index of player's first selected cell
 * @param {number} selected - Index of player's second selected cell
 * @returns {number[]} stable board after player makes valid swap 
 */
export function finishMove(board, selectOne, selected) {
  console.log("finishing move")
  let nextSquares = board.slice()
  let clearedCells = new Set()
  nextSquares = clearMatch(selectOne, nextSquares, clearedCells)
  nextSquares = clearMatch(selected, nextSquares, clearedCells)
  nextSquares = cascade(nextSquares, clearedCells)
  nextSquares = fillIn(nextSquares)
  
  clearedCells = findAllMatches(nextSquares, clearedCells)
  while (clearedCells.size > 0) {
    console.log("cascade / generation resulted in match")
    nextSquares = clearAllMatches(nextSquares, clearedCells)
    nextSquares = cascade(nextSquares, clearedCells)
    nextSquares = fillIn(nextSquares) 
    clearedCells = findAllMatches(nextSquares, clearedCells)
  }

  if (!validMoveExists(board)) {
    nextSquares = generateValidBoard()
  }

  return nextSquares
}


/* ----------------------------------  Example Functions used to test Jest Testing  ---------------------------------- */

// export function add(a, b) {
//   return a + b;
// }

// export function useExampleHook(initialValue) {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     // Some side effect logic here
//   }, [value]);

//   const increment = () => {
//     setValue(value + 1);
//   };

//   return { value, increment };
// }

// export function useExampleHook(initialValue) {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     // Some side effect logic here
//   }, [value]);

//   const increment = () => {
//     setValue(value + 1);
//   };

//   return { value, increment };
// }
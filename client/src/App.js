import { useEffect, useState } from 'react'
import ScoreObject from './Score'
import { validMoveExists, validMove, inBoard } from './BoardValidation';
import {generateValidBoard} from './BoardGeneration';
import {cascade, fillIn, findAllMatches, clearAllMatches} from './Gameplay';
import Timer from './Timer';

/*
TO-DO LIST:
  1. Start Button
  2. Timer
  3. Customize boardsize (requires code refactoring, functions initially hardcoded for 9x9)
  4. Custmize number of values
  5. Customize delay time
  6. Customize color scheme
*/


/**
 * Set of indices that represent which indicies were recently cleared.
 * @type {Set{number}} 
 * @see finishMove
 */
let clearedCells = new Set()

/**
 * State of the game.
 * 0: no cells selected
 * 1: 1st cell selected
 * 2: active match (resulted from 2nd cell selected)
 * 3: cascading
 * 4: filling in
 * 5: active matches (resulted from cascade/fill)
 * 6: stable board (checking for valid move)
 * @type {number} 
 */
export let state = 0

export const setState = (newValue) => {
  state = newValue;
};


/**
 * Index of player's first selected cell before a swap
 * @type {number} 
 */
let selectOne = -1

/**
 * Value of player's first selected cell before a swap
 * @type {number} 
 */
let selectOneValue = -1


/**
 * Index of player's second selected cell before a swap
 * @type {number} 
 */
let selectTwo = -1


/**
 * Object that holds the player's score in the game. 
 * Later on, if there were special score scenarios (ex: chains of matches, 5+ clear gives a multiplier, etc.), can be written in the class.
 * Instance of the scoreObject is passed around different gameplay functions. 
 * @type {ScoreObject} 
 */
const scoreObject = new ScoreObject(0)




function Square({value, onSquareClick, isSelected}) {
  const valueColors = {
    0: '#FFADAD',
    1: '#FFD6A5',
    2: '#FDFFB6',
    3: '#CAFFBF',
    4: '#9BF6FF',
  };

  const squareStyle = {
    backgroundColor: valueColors[value] || 'white',
    border: isSelected ? '3px solid black' : '1px solid black', 
  };

  return <button className="square" style={squareStyle} onClick = {onSquareClick}>
    {/* {value} */}
  </button>
}

function Score({value}) {
  return <div>Score: {value}</div>
}

export default function Board() {

  //Gameboard is represented by a 1D array. Currently hardcoded for 9x9.
  const [squares, setSquares] = useState(Array(81).fill(null))

  const [score, setScore] = useState(0)
  
  useEffect(() => {
    console.log("page launch")
    setSquares(generateValidBoard(9, 9))
  }, []); 

  function handleClick(i) {
    let nextSquares = squares.slice()
    let selected = i;
    if (state === 0) {
      console.log("1st select: " + i)
      selectOne = i
      selectOneValue = squares[i]
      state = 1
      setSquares(nextSquares)
    } else if (state === 1) {
      nextSquares = startMove(nextSquares, selected, selectOne)
      setSquares(nextSquares) 
    }
  }

  useEffect(() => {
    // Your logic here
    let delayTime
    let delayedLogic
    switch(state) {
      case 2:
        delayTime = 500
        delayedLogic = () => {
          const nextSquares = finishMove(squares, selectOne, selectTwo, scoreObject)
          setSquares(nextSquares)
          selectOne = -1
          selectOneValue = -1
          selectTwo = -1
          state = 3
          console.log("setting score to " + scoreObject.value)
          setScore(scoreObject.value)
        };     
        break;
      case 3:
        delayTime = 500
        delayedLogic = () => {
          const nextSquares = afterCascade(squares, scoreObject)
          setSquares(nextSquares)
          state = 4
        };  
        break;
      case 4:
        delayTime = 800
        delayedLogic = () => {
          const nextSquares = afterFill(squares, scoreObject)
          setSquares(nextSquares)
          if (clearedCells.size > 0) {
            state = 5
          } else {
            state = 6
          }
        }; 
        break;
      case 5:
        delayTime = 700
        delayedLogic = () => {
          const nextSquares = afterClearAll(squares)
          setSquares(nextSquares)
          state = 3
          console.log("setting score to " + scoreObject.value)
          setScore(scoreObject.value)
        }; 
        break;
      case 6:
        delayTime = 500
        console.log("checking if there is a valid move....")
        let nextSquares = squares.slice()
        if (!validMoveExists(nextSquares, 9, 9)) {
          console.log("no valid move exists!")
          nextSquares = generateValidBoard(9, 9)
        }
        setSquares(nextSquares)
        state = 0
        console.log("setting score to " + scoreObject.value)
        setScore(scoreObject.value)
        break;
      default:
        break;   
    }

    const delayId = setTimeout(delayedLogic, delayTime);

    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => clearTimeout(delayId);
  }, [squares, scoreObject]);

  /**
   * Changes state of the game / the board after player selects second cell.
   *
   * @param {number[]} nextSquares - Current state of the board. 
   * @param {number} selected - Index of player's second selected cell
   * @param {number} selectOne - Index of player's first selected cell
   * @returns {number[]} board after swap 
   */
  function startMove(nextSquares, selected, selectOne) {
    switch(selected){
      case selectOne - 1:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "L", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          state = 2
        } 
        break;
      case selectOne + 1:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "R", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          state = 2
        }
        break;
      case selectOne - 9:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "U", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          state = 2
        }
        break;
      case selectOne + 9:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "D", nextSquares)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          state = 2
        }
        break;
      case selectOne:
        console.log("2nd select: same cell pressed")
        state = 0
        break;
      default:
        console.log("2nd select: invalid cell")
        return nextSquares
    }
    return nextSquares
  }

  function renderSquare(i) {
    let key = "square-"+i
    return <Square key={key} value={squares[i]} onSquareClick={() => handleClick(i)} isSelected={state === 1 && i === selectOne} />
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
      <Score value={score}/>
      <Timer initialTime={100}/>
    </>
  );
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
  if (board[i] === null) return

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
 * Returns board immediately after player swap/clear is processed. Score gets updated accordingly.
 *
 * @param {number[]} board - current state of board 
 * @param {number} selectOne - index of player's first selected cell
 * @param {number} selected - index of player's second selected cell
 * @param {ScoreObject} scoreObject - object that holds score value
 * @returns {number[]} board after player swap match clears
 */
export function finishMove(board, selectOne, selected, scoreObject) {
  let nextSquares = board.slice()
  clearedCells = new Set()

  nextSquares = clearMatch(selectOne, nextSquares, clearedCells)
  nextSquares = clearMatch(selected, nextSquares, clearedCells)

  console.log("Current score: " + scoreObject.value)
  console.log("You cleared " + clearedCells.size + " cells with that swap!")
  scoreObject.value += clearedCells.size

  return nextSquares
}

/**
 * Returns board immediately after cascade happens. Adds to clearedCells, the clears that result from the cascade. Updates score object accordingly.
 *
 * @param {number[]} board - current state of board 
 * @param {ScoreObject} scoreObject - object that holds score value
 * @returns {number[]} board after cascade occurs
 */
export function afterCascade(board, scoreObject) {
  let nextSquares = board.slice()
  nextSquares = cascade(nextSquares, clearedCells)
  clearedCells = findAllMatches(nextSquares, scoreObject)
  console.log("Cascade resulted in clearing " + clearedCells.size + " cells!")
  scoreObject.value += clearedCells.size
  return nextSquares
}

/**
 * Returns board immediately after fill happens. Adds to clearedCells, the clears that result from the fill. Updates score object accordingly.
 *
 * @param {number[]} board - current state of board 
 * @param {ScoreObject} scoreObject - object that holds score value
 * @returns {number[]} board after player fill occurs
 */
export function afterFill(board, scoreObject) {
  let nextSquares = board.slice()
  let clearedCells2 = new Set()

  nextSquares = fillIn(nextSquares)
  clearedCells2 = findAllMatches(nextSquares, scoreObject)

  console.log("Fill in resulted in clearing " + (clearedCells2.size - clearedCells.size) + " cells!")
  scoreObject.value += (clearedCells2.size - clearedCells.size)
  
  clearedCells = clearedCells2
  
  return nextSquares
}

/**
 * Returns board immediately after all active clears disappear. (Active clears are represented by the global clearedCells object)
 *
 * @param {number[]} board - current state of board 
 * @returns {number[]} board after every i in clearedCells becomes null
 */
export function afterClearAll(board) {
  let nextSquares = board.slice()
  nextSquares = clearAllMatches(nextSquares, clearedCells)
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
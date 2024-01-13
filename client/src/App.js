import { useEffect, useState } from 'react'
import ScoreObject from './Score'
import { validMoveExists, validMove, inBoard } from './BoardValidation';
import {generateValidBoard} from './BoardGeneration';
import {cascade, fillIn, findAllMatches, clearAllMatches} from './Gameplay';
import Square from './Square';
import Timer from './Timer';
import StartButton from './StartButton';
import './App.css'; // Import the CSS file

/*
TO-DO LIST:
  1. Start Button (Inactive on page launch)
  2. Customize delay time
  3. Customize color scheme
*/


/**
 * Set of indices that represent which indicies were recently cleared.
 * @type {Set{number}} 
 * @see finishMove
 */
let clearedCells = new Set()

/**
 * Object that holds the player's score in the game. 
 * Later on, if there were special score scenarios (ex: chains of matches, 5+ clear gives a multiplier, etc.), can be written in the class.
 * Instance of the scoreObject is passed around different gameplay functions. 
 * @type {ScoreObject} 
 */
let scoreObject = new ScoreObject(0)

function Score({value}) {
  return <div className="score">Score: {value}</div>
}

/**
 * State of the game.
 * -1: inactive game (empty timer)
 * 0: no cells selected
 * 1: 1st cell selected
 * 2: active match (resulted from 2nd cell selected)
 * 3: cascading
 * 4: filling in
 * 5: active matches (resulted from cascade/fill)
 * 6: stable board (checking for 1st select)
 */
let gameState = -1

let selectOne = -1 //index of player's first selected cell before a swap
let selectOneValue = -1 //value of player's first selected cell before a swap
let selectTwo = -1  //index of player's second selected cell before a swap
let numValues = 5 
let numRows = 9 
let numCols = 9 
let initialTime = 60

export default function Game() {
  // const [initialTime, setInitialTime] = useState(60);
  const [time, setTime] = useState("1:00");
  const [squares, setSquares] = useState(Array(numRows*numCols).fill(null))   
  const [score, setScore] = useState(0)

/* ----------------------------------  Functions  ---------------------------------- */
  
  const resetGame = () => {
    setSquares(generateValidBoard(numRows, numCols, numValues))
    setScore(0);
    scoreObject = new ScoreObject(0)
    setTime(0)
    setTime(initialTime);
    gameState = 0
  };

  function changeTimeLimit(value) {
    if (gameState === -1) {
      setTime(value)
      initialTime = parseInt(value)
      console.log("initial time:" + initialTime)
    } else {
      gameState = -1
      setScore(0)
      setTime(value)
      initialTime = parseInt(value)     
    }
  }

  function changeNumValues(value) {
    if (gameState === -1) {
      numValues = value
    } else {
      gameState = -1
      numValues = value
      setScore(0)
      setTime(initialTime)    
    }
    setSquares(generateValidBoard(numRows, numCols, numValues))    
  }

  function handleClick(i) {
    let nextSquares = squares.slice()
    let selected = i
    if (gameState === 0) {
      console.log("1st select: " + i)
      selectOne = i
      selectOneValue = squares[i]
      gameState = 1
      setSquares(nextSquares)
    } else if (gameState === 1) {
      nextSquares = startMove(nextSquares, selected, selectOne)
      setSquares(nextSquares) 
    }
  }

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
        if (validMove(selectOne, "L", nextSquares, numCols)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          gameState = 2
        } 
        break;
      case selectOne + 1:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "R", nextSquares, numCols)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          gameState = 2
        }
        break;
      case selectOne - numCols:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "U", nextSquares, numCols)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          gameState = 2
        }
        break;
      case selectOne + numCols:
        console.log("2nd select: " + selected)
        if (validMove(selectOne, "D", nextSquares, numCols)) {
          nextSquares[selectOne] = nextSquares[selected]
          nextSquares[selected] = selectOneValue
          selectTwo = selected
          gameState = 2
        }
        break;
      case selectOne:
        console.log("2nd select: same cell pressed")
        gameState = 0
        break;
      default:
        console.log("2nd select: invalid cell " + selected)
        return nextSquares
    }
    return nextSquares
  }

/* -------------------------------------------------------------------- */

  //page launch
  useEffect(() => {
    console.log("page launch")
    setSquares(generateValidBoard(numRows, numCols, numValues))
  }, []); 

  //timer
  useEffect(() => {
    console.log("game state is currently: " + gameState)
    let timer;

    if (time > 0 && gameState !== -1) {
      timer = setInterval(() => {
        if (time === 1) {
          clearInterval(timer);
          gameState = -1 // Call the callback function when the timer reaches 0
        }

        // Update the time using the callback function
        setTime((time) => time - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  //row and col sliders
  useEffect(() => {
    let rowSlider = document.getElementById("numRows");
    let colSlider = document.getElementById("numCols");
    let output = document.getElementById("demo");

    rowSlider.oninput = function () {
      gameState = -1 
      rowSlider.value = this.value;
      numRows = parseInt(this.value)
      setSquares(generateValidBoard(numRows, numCols, numValues))
      output.innerHTML = "Rows: " + rowSlider.value + " Cols: " + colSlider.value
    }

    colSlider.oninput = function () {
      gameState = -1 
      colSlider.value = this.value;
      numCols = parseInt(this.value)
      console.log(numCols)
      setSquares(generateValidBoard(numRows, numCols, numValues))
      output.innerHTML = "Rows: " + rowSlider.value + " Cols: " + colSlider.value
    }
  }, [squares]); 

  //finish a move
  useEffect(() => {
    let delayTime
    let delayedLogic
    switch(gameState) {
      case 2:
        delayTime = 100
        delayedLogic = () => {
          const nextSquares = finishMove(squares, selectOne, selectTwo, scoreObject)
          setSquares(nextSquares)
          selectOne = -1
          selectOneValue = -1
          selectTwo = -1
          gameState = 3
          console.log("setting score to " + scoreObject.value)
          setScore(scoreObject.value)
        };     
        break;
      case 3:
        delayTime = 400
        delayedLogic = () => {
          const nextSquares = afterCascade(squares, scoreObject)
          setSquares(nextSquares)
          gameState = 4
        };  
        break;
      case 4:
        delayTime = 0
        delayedLogic = () => {
          const nextSquares = afterFill(squares, scoreObject)
          setSquares(nextSquares)
          if (clearedCells.size > 0) {
            gameState = 5
          } else {
            gameState = 6
          }
        }; 
        break;
      case 5:
        delayTime = 400
        delayedLogic = () => {
          const nextSquares = afterClearAll(squares)
          setSquares(nextSquares)
          gameState = 3
          console.log("setting score to " + scoreObject.value)
          setScore(scoreObject.value)
        }; 
        break;
      case 6:
        delayTime = 400
        console.log("checking if there is a valid move....")
        let nextSquares = squares.slice()
        if (!validMoveExists(nextSquares, numRows, numCols)) {
          console.log("no valid move exists!")
          nextSquares = generateValidBoard(numRows, numCols, numValues)
        }
        setSquares(nextSquares)
        gameState = 0
        console.log("setting score to " + scoreObject.value)
        setScore(scoreObject.value)
        break;
      default:
        break;   
    }

    const delayId = setTimeout(delayedLogic, delayTime);

    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => clearTimeout(delayId);
  }, [squares, time]);


  function renderSquare(i) {
    let key = "square-"+i
    return <Square key={key} value={squares[i]} onSquareClick={() => handleClick(i)} isSelected={gameState === 1 && i === selectOne} />
  }

  function renderRow(row) {
    return (
      <div className="board-row">
        {Array.from({ length: numCols }, (_, index) => index).map((col) => renderSquare(row * numCols + col))}
      </div>
    );
  }

  return(
    <div className="game-container">
      <div className="game-board">
        {Array.from({ length: numRows }, (_, index) => index).map((row) => renderRow(row))}
      </div>
      <div className="container">
        <div className="settings-container">
          <div>
            <p id="demo">Rows: 9 Cols: 9</p>
            <label htmlFor="numRows">Num Rows:</label>
            <input
              type="range"
              id="numRows"
              min="3"
              max="10"
              value={numRows}
            />
            <label htmlFor="numCols">Num Cols:</label>
            <input
              type="range"
              id="numCols"
              min="3"
              max="15"
              value={numCols}
            />
          </div>
          <div>
            <label for="timelimit">Select a time limit:</label>
            <select id="timelimit" name="timelimit" onChange={(e) => changeTimeLimit(e.target.value)} defaultValue="60">
              <option value="5">0:05</option>        
              <option value="30">0:30</option>
              <option value="60">1:00</option>
              <option value="90">1:30</option>
              <option value="120">2:00</option>
            </select>
          </div>
          <div>
            <label for="numvalues">Select a number of colors:</label>
            <select id="numvalues" name="numvalues" onChange={(e) => changeNumValues(e.target.value)} defaultValue="5">
              <option value="3">3</option>        
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>
          <div>
            <Timer time={time} />       
          </div>
        </div>
        <div className="start-score">
          <Score value={score}/>
          <StartButton resetGame={resetGame} />
        </div>
      </div>
    </div>
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
export function clearMatch(i, board, clearedCells, numCols) { 
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

  while (inBoard(u, board) && board[u] === board[i]) {
    sameUp.add(u);
    u -= numCols
  }
  while (inBoard(d, board) && board[d] === board[i]) {
    sameDown.add(d)
    d += numCols
  }
  while (inBoard(l, board) && board[l] === board[i]) {
    sameLeft.add(l);
    if (l % numCols === 0) {
      l -= 1
      break
    }
    l -= 1
  }
  while (inBoard(r, board) && board[r] === board[i]) {
    sameRight.add(r)
    if ((r + 1) % numCols === 0) {
      r += 1 
      break
    }
    r += 1
  }

  if (d - u >= numCols * 4) {
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

  nextSquares = clearMatch(selectOne, nextSquares, clearedCells, numCols)
  nextSquares = clearMatch(selected, nextSquares, clearedCells, numCols)

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
  nextSquares = cascade(nextSquares, clearedCells, numCols)
  clearedCells = findAllMatches(nextSquares, numRows, numCols)
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

  nextSquares = fillIn(nextSquares, numRows, numCols, numValues)
  clearedCells2 = findAllMatches(nextSquares, numRows, numCols)

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
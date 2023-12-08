import { useEffect, useState } from 'react'

function Square({value, onSquareClick, isSelected}) {
  const squareStyle = isSelected ? { backgroundColor: 'yellow' } : {};
  return <button className="square" style={squareStyle} onClick = {onSquareClick}>
    {value}
  </button>
}

export default function Board() {
  const [squares, setSquares] = useState(Array(81).fill(null))

  // 0 = no cell selected, 1 = 1st cell selected
  const [state, setState] = useState(0) 

  const [selectOne, setSelectOne] = useState(-1)
  const [selectOneValue, setSelectOneValue] = useState(0)
  
  useEffect(() => {
    console.log("page launch")
    setValidSquares(); 
  }, []); 

  function setValidSquares() {
    setSquares(generateValidBoard());
  }

  function handleClick(i) {
    console.log("state is currently " + state)
    let nextSquares = squares.slice()
    let selected = i;
    if (state === 0) {
      console.log("1st select: " + squares[i])
      setSelectOne(i)
      setSelectOneValue(squares[i])
      setState(1)
    } else if (state === 1) {
      console.log("2nd select:")
      switch(true){
        case selected === selectOne - 1:
          console.log("adjacent cell pressed")
          if (validMove(selectOne, "L", nextSquares)) {
            nextSquares[selectOne] = nextSquares[selected]
            nextSquares[selected] = selectOneValue
            setState(0)
            setSelectOne(-1)
            nextSquares = clearAllMatches(nextSquares)
          } 
          break;
        case selected === selectOne + 1:
          console.log("adjacent cell pressed")
          if (validMove(selectOne, "R", nextSquares)) {
            nextSquares[selectOne] = nextSquares[selected]
            nextSquares[selected] = selectOneValue
            setState(0)
            setSelectOne(-1)
            nextSquares = clearAllMatches(nextSquares)
          }
          break;
        case selected === selectOne - 9:
          console.log("adjacent cell pressed")
          if (validMove(selectOne, "U", nextSquares)) {
            nextSquares[selectOne] = nextSquares[selected]
            nextSquares[selected] = selectOneValue
            setState(0)
            setSelectOne(-1)
            nextSquares = clearAllMatches(nextSquares)
          }
          break;
        case selected === selectOne + 9:
          console.log("adjacent cell pressed")
          if (validMove(selectOne, "D", nextSquares)) {
            nextSquares[selectOne] = nextSquares[selected]
            nextSquares[selected] = selectOneValue
            setState(0)
            setSelectOne(-1)
            nextSquares = clearAllMatches(nextSquares)
          }
          break;
        case selected === selectOne:
          console.log("same cell pressed")
          nextSquares[i] = selectOneValue
          setState(0)
          setSelectOne(-1)
          break;
        default:
          console.log("pressed invalid cell")
      }
    }
    setSquares(nextSquares)
    console.log("now on current state is " + state);
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


/* Functions For Board Generation + Move Validation */

function generateBoard() {
  console.log("generating a board")
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

function generateValidBoard() {
  console.log("generating a valid board")
  let randomBoard = generateBoard()
  while (!validMoveExists(randomBoard)) {
    randomBoard = generateBoard()
  }
  return randomBoard
}

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

export function inBoard(i) {
  return i >= 0 && i < 81
}

// technically there is a wrapping issue here....
export function validLeftMatch(i, board) {
  return (inBoard(i-1) && inBoard(i-2) && board[i] === board[i-1] && board[i] === board[i-2])
}

export function validRightMatch(i, board) {
  return (inBoard(i+1) && inBoard(i+2) && board[i] === board[i+1] && board[i] === board[i+2])    
}

export function validUpMatch(i, board) {
  return (inBoard(i-9) && inBoard(i-18) && board[i] === board[i-9] && board[i] === board[i-18])     
}

export function validDownMatch(i, board) {
  return (inBoard(i+9) && inBoard(i+18) && board[i] === board[i+9] && board[i] === board[i+18])      
}

export function validVerticalMatch(i, board) {
  return (inBoard(i+9) && inBoard(i-9) && board[i] === board[i+9] && board[i] === board[i-9])    
}

export function validHorizontalMatch(i, board) {
  return (inBoard(i-1) && inBoard(i+1) && board[i] === board[i-1] && board[i] === board[i+1])    
}

/* Gameplay Functions */

export function clearMatch(i, board, clearedCells) {
  if (clearedCells.has(i)) return
  const newBoard = board.slice()
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
}

export function clearAllMatches(board) {
  let clearedBoard = board.slice()
  let clearedCells = new Set()
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let i = r * 9 + c
      clearMatch(i, board, clearedCells)
    }
  }
  clearedCells.forEach(value => clearedBoard[value] = null)
  return clearedBoard
}



/* Example Methods to Try with Jest Testing */
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
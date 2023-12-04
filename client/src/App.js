import { useEffect, useState } from 'react'

function Square({value, onSquareClick}) {
  return <button className="square" onClick = {onSquareClick}>
    {value}
  </button>
}

export default function Board() {
  const [squares, setSquares] = useState(Array(81).fill(null))

  useEffect(() => {
    randomizeBoard(); 
  }, []); 

  function randomizeBoard() {
    const nextSquares = squares.slice()

    for (let r = 0; r < squares.length; r++) {
      for (let c = 0; c < squares.length; c++) {
        const randomNumber = Math.floor(Math.random() * 5);
        nextSquares[r*9+c] = randomNumber.toString()
      }
    }
    setSquares(nextSquares)
  }
  
  function handleClick(i) {
    const nextSquares = squares.slice()
    nextSquares[i] = "X"
    setSquares(nextSquares)
  }

  function renderSquare(i) {
    return <Square value={squares[i]} onSquareClick={() => handleClick(i)} />
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
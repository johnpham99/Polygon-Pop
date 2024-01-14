import React from 'react';

function Square({value, onSquareClick, isSelected, numCols}) {
    const valueColors = {
      0: '#FFADAD',
      1: '#FFD6A5',
      2: '#FDFFB6',
      3: '#CAFFBF',
      4: '#9BF6FF',
      5: '#BDB2FF',
      6: '#d4a373'
    };
  
    const squareStyle = {
      backgroundColor: valueColors[value] || 'white',
      border: isSelected ? '3px solid black' : '1px solid black', 
    };
  
    return <button className="square" style={squareStyle} onClick = {onSquareClick} data-num-cols={numCols}>
    </button>
  }

// function Square({ value, onSquareClick, isSelected }) {
//     const iconStyles = {
//       fontSize: '20px', // Adjust the font size of the icon
//       color: '#ffffff', // Set the color of the icon
//     };
  
//     const selectedStyles = {
//       border: '3px solid black',
//     };
  
//     return (
//       <button className="square" style={isSelected ? selectedStyles : {}} onClick={onSquareClick}>
//         {value === 1 && <i className="fas fa-star" style={iconStyles}></i>}
//         {value === 2 && <i className="fas fa-heart" style={iconStyles}></i>}
//         {/* Add more cases for other values/icons */}
//       </button>
//     );
//   }

export default Square;
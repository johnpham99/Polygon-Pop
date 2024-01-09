import React from 'react';

const StartButton = ({ resetGame }) => {
  return (
    <button onClick={resetGame}>
      Start
    </button>
  );
};

export default StartButton;
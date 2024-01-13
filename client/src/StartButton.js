import React from 'react';

const StartButton = ({ resetGame }) => {
  return (
    <button className="start-button" onClick={resetGame}>
      Start
    </button>
  );
};

export default StartButton;
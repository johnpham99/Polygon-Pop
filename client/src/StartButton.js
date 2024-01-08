import React from 'react';

const StartButton = ({ resetTimer }) => {
  
  const handleClick = () => {
    resetTimer();
  };

  return (
    <button onClick={handleClick}>
      Start
    </button>
  );
};

export default StartButton;
import React, { useEffect, useState } from 'react';

const Timer = ({ time }) => {

  // Format seconds into minutes:seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div>
      {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
    </div>
  );
};

export default Timer;

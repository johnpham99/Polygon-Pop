import React, { useEffect } from 'react';

const Timer = ({ time, onTimerEnd, onTimeUpdate }) => {
  useEffect(() => {
    let timer;

    if (time > 0) {
      timer = setInterval(() => {
        if (time === 1) {
          clearInterval(timer);
          onTimerEnd(); // Call the callback function when the timer reaches 0
        }

        // Update the time using the callback function
        onTimeUpdate((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [time, onTimerEnd, onTimeUpdate]);

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

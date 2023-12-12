import React, { useEffect, useState } from 'react'
import {setState} from './App'

const Timer = ({initialTime}) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft === 1) {
              clearInterval(timer); // Stop the timer when it reaches 0
              // You can add additional logic here when the timer reaches 0
              setState(-1)
            }
            return prevTimeLeft - 1;
          });
        }, 1000); // Update every 1000 milliseconds (1 second)
    
        return () => {
          clearInterval(timer);
        };
      }, []); // Empty dependency array to run the effect only once on component mount

    if (timeLeft === 0) {
        setState(-1)
    }
    // Format seconds into minutes:seconds
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div>
          {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
        </div>
      );
}

export default Timer
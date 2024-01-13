const Timer = ({ time }) => {

  // Format seconds into minutes:seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  let display = `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`
  if (isNaN(time)) display = time

  return (
    <div className="time">
      Time: {display}
    </div>
  );
};

export default Timer;

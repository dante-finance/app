import React from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface LaunchCountdownProps {
  deadline: Date;
}

const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ deadline }) => {
  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);

    return (
      <>
        <span style={{ color: 'rgb(244, 143, 78)', fontSize: '24px' }}>Genesis Ends In</span>
        <span style={{ fontSize: '24px' }}>
          : {h} Hours {m} Minutes {s} Seconds
        </span>
      </>
    );
  };

  return <Countdown date={deadline} renderer={countdownRenderer} />;
};

export default LaunchCountdown;

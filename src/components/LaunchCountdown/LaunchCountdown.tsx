import React from 'react';
import styled from 'styled-components';
import config from '../../config';
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

    return <span>GENESIS START TIME: {h} Hours {m} Minutes {s} Seconds</span>;
  };

  return (
    <Countdown date={deadline} renderer={countdownRenderer} />
  );
};

export default LaunchCountdown;

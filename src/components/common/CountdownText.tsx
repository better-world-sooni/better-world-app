import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Span} from './Span';

export default function CountdownText({dueDate}) {
  const getTimeDiffString = due => {
    if (!due) return '';
    const diffInSeconds = moment(due).diff(moment(), 's');
    const dayInSeconds = 24 * 60 * 60;
    const hourInSeconds = 24 * 60;
    const minuteInSeconds = 60;
    const day = (diffInSeconds / dayInSeconds).toFixed();
    const hour = ((diffInSeconds % dayInSeconds) / hourInSeconds).toFixed();
    const minute = (
      (diffInSeconds % hourInSeconds) /
      minuteInSeconds
    ).toFixed();
    const second = (
      (diffInSeconds % hourInSeconds) %
      minuteInSeconds
    ).toFixed();
    if (parseInt(day) > 0) return `D-${day}`;
    return `D-${hour.length > 1 ? '' : 0}${hour}:${
      minute.length > 1 ? '' : 0
    }${minute}:${second.length > 1 ? '' : 0}${second}`;
  };
  const [countdown, setCountdown] = useState(getTimeDiffString(dueDate));
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(getTimeDiffString(dueDate));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  });

  if (!dueDate) return null;
  return (
    <Span white bold>
      {countdown}
    </Span>
  );
}
